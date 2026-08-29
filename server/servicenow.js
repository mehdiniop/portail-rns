/**
 * Accès bas niveau à la Table API de ServiceNow.
 *
 * Deux modes d'authentification, choisis par SN_AUTH dans server/.env :
 *   - "oauth" (défaut) : jeton OAuth 2.0 mis en cache et renouvelé tout seul.
 *   - "basic"          : Basic Auth, refusé par les instances récentes.
 *
 * Les identifiants ne quittent jamais ce processus : le navigateur ne parle
 * qu'au proxy Express, jamais directement à l'instance.
 */

function base() {
  return (process.env.SN_INSTANCE || '').replace(/\/+$/, '');
}

function mode() {
  return (process.env.SN_AUTH || 'oauth').toLowerCase();
}

function grantType() {
  return process.env.SN_GRANT || 'password';
}

export function assertConfig() {
  const required =
    mode() === 'basic'
      ? ['SN_INSTANCE', 'SN_USER', 'SN_PASSWORD']
      : grantType() === 'client_credentials'
        ? ['SN_INSTANCE', 'SN_CLIENT_ID', 'SN_CLIENT_SECRET']
        : ['SN_INSTANCE', 'SN_CLIENT_ID', 'SN_CLIENT_SECRET', 'SN_USER', 'SN_PASSWORD'];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Variables absentes de server/.env : ${missing.join(', ')}`);
  }
}

/* ------------------------------------------------------------------ OAuth */

let cached = null; // { value, expiresAt }

/** Demande un jeton à /oauth_token.do et le garde jusqu'à son expiration. */
async function fetchToken() {
  const body = new URLSearchParams({
    grant_type: grantType(),
    client_id: process.env.SN_CLIENT_ID,
    client_secret: process.env.SN_CLIENT_SECRET,
  });

  if (grantType() === 'password') {
    body.set('username', process.env.SN_USER);
    body.set('password', process.env.SN_PASSWORD);
  }

  let response;
  try {
    response = await fetch(`${base()}/oauth_token.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body,
    });
  } catch (cause) {
    throw new Error(
      `Instance ServiceNow injoignable (${base()}) : ${cause.message}. ` +
        'Vérifie SN_INSTANCE et que la PDI est réveillée.',
    );
  }

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text };
  }

  if (!response.ok || !payload.access_token) {
    const detail =
      payload?.error_description || payload?.error || payload?.raw || response.statusText;
    throw new Error(`OAuth ${response.status} refusé par ServiceNow : ${detail}`);
  }

  const lifetime = Number(payload.expires_in || 1800);
  cached = { value: payload.access_token, expiresAt: Date.now() + (lifetime - 60) * 1000 };
  return cached.value;
}

async function token() {
  if (cached && Date.now() < cached.expiresAt) return cached.value;
  return fetchToken();
}

/** Force le renouvellement au prochain appel (utilisé après un 401). */
function invalidateToken() {
  cached = null;
}

async function authorization() {
  if (mode() === 'basic') {
    const raw = `${process.env.SN_USER || ''}:${process.env.SN_PASSWORD || ''}`;
    return `Basic ${Buffer.from(raw).toString('base64')}`;
  }
  return `Bearer ${await token()}`;
}

/** Diagnostic : tente d'obtenir un jeton et décrit le résultat. */
export async function checkAuth() {
  assertConfig();
  if (mode() === 'basic') return { mode: 'basic', ok: true, note: 'Aucun jeton à obtenir.' };
  invalidateToken();
  await token();
  return { mode: 'oauth', grant: grantType(), ok: true };
}

/* -------------------------------------------------------------- Table API */

async function call(url, options, label) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (cause) {
    throw new Error(
      `Instance ServiceNow injoignable (${base()}) : ${cause.message}. ` +
        'Vérifie SN_INSTANCE et que la PDI est réveillée.',
    );
  }

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    const detail =
      body?.error?.message || body?.error?.detail || body?.raw || response.statusText;
    throw new Error(`ServiceNow ${response.status} sur « ${label} » : ${detail}`);
  }

  return body.result || {};
}

/**
 * Crée un enregistrement et renvoie { sys_id, number }.
 * Un 401 (jeton périmé côté serveur) déclenche un seul réessai avec un jeton neuf.
 */
export async function createRecord(table, fields) {
  assertConfig();

  const url = `${base()}/api/now/table/${encodeURIComponent(table)}?sysparm_fields=sys_id,number`;
  const build = async () => ({
    method: 'POST',
    headers: {
      Authorization: await authorization(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });

  try {
    return await call(url, await build(), table);
  } catch (error) {
    if (!/ServiceNow 401/.test(error.message) || mode() === 'basic') throw error;
    invalidateToken();
    return call(url, await build(), table);
  }
}

/** Lit un enregistrement par sys_id (utile pour rafraîchir un statut). */
export async function readRecord(table, sysId, fields = 'sys_id,number,state,short_description') {
  assertConfig();

  const url =
    `${base()}/api/now/table/${encodeURIComponent(table)}/${encodeURIComponent(sysId)}` +
    `?sysparm_fields=${encodeURIComponent(fields)}&sysparm_display_value=true`;

  return call(url, {
    method: 'GET',
    headers: { Authorization: await authorization(), Accept: 'application/json' },
  }, table);
}

/** Met à jour un enregistrement par sys_id. Même logique de réessai que createRecord. */
export async function updateRecord(table, sysId, fields) {
  assertConfig();

  const url =
    `${base()}/api/now/table/${encodeURIComponent(table)}/${encodeURIComponent(sysId)}` +
    `?sysparm_fields=sys_id,number,state`;

  const build = async () => ({
    method: 'PATCH',
    headers: {
      Authorization: await authorization(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });

  try {
    return await call(url, await build(), table);
  } catch (error) {
    if (!/ServiceNow 401/.test(error.message) || mode() === 'basic') throw error;
    invalidateToken();
    return call(url, await build(), table);
  }
}

/**
 * Lit le journal d'un enregistrement : chaque commentaire ou note de travail
 * est une ligne de sys_journal_field, avec son auteur et son horodatage UTC.
 */
export async function readJournal(sysId, elements = 'comments') {
  assertConfig();

  const query = `element_id=${sysId}^elementIN${elements}^ORDERBYsys_created_on`;
  const url =
    `${base()}/api/now/table/sys_journal_field` +
    `?sysparm_query=${encodeURIComponent(query)}` +
    `&sysparm_fields=element,value,sys_created_on,sys_created_by` +
    `&sysparm_limit=200`;

  const result = await call(url, {
    method: 'GET',
    headers: { Authorization: await authorization(), Accept: 'application/json' },
  }, 'sys_journal_field');

  return Array.isArray(result) ? result : [];
}

/**
 * Recherche une liste d'enregistrements. Renvoie toujours un tableau,
 * meme si ServiceNow ne trouve rien.
 */
export async function listRecords(table, query, fields, limit = 100) {
  assertConfig();

  const url =
    `${base()}/api/now/table/${encodeURIComponent(table)}` +
    `?sysparm_query=${encodeURIComponent(query)}` +
    `&sysparm_fields=${encodeURIComponent(fields)}` +
    `&sysparm_limit=${limit}`;

  const result = await call(url, {
    method: 'GET',
    headers: { Authorization: await authorization(), Accept: 'application/json' },
  }, table);

  return Array.isArray(result) ? result : [];
}