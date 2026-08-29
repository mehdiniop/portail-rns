/**
 * Client HTTP du proxy ServiceNow (dossier server/).
 * Aucun identifiant ne transite ici : le navigateur ne parle qu'à /api.
 */

const API = import.meta.env.VITE_API_URL || '/api';

async function send(method, path, body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Erreur ${response.status}`);
  return data;
}

const post = (path, body) => send('POST', path, body);
const patch = (path, body) => send('PATCH', path, body);
const get = (path) => send('GET', path);

/** Incident du portail → table incident. */
export const pushIncident = (values) => post('/incidents', values);

/** Lignes de panier (ou une ligne seule) → sc_request + sc_req_item. */
export const pushRequest = (lines) =>
  post('/requests', {
    lines: lines.map((line) => ({
      itemKey: line.item?.key || 'unknown',
      itemLabel: line.item?.label?.fr || line.item?.key || 'Article',
      quantity: line.quantity || 1,
      price: line.item?.amount ?? null,
      values: line.values || {},
    })),
  });

/** Formulaires directs Change / Problem. */
export const pushRecord = (table, values) => post(`/records/${table}`, values);

/** Mise à jour d'un enregistrement existant (commentaire, statut). */
export const patchRecord = (table, sysId, values) => patch(`/records/${table}/${sysId}`, values);

/** Fil de commentaires d'un enregistrement, tel que ServiceNow le connaît. */
export const fetchJournal = (sysId, all = false) =>
  get(`/journal/${sysId}${all ? '?elements=all' : ''}`);

/** Incidents du demandeur, lus dans ServiceNow. */
export const fetchIncidents = () => get('/incidents');

/** Ping du proxy — pratique pour vérifier la configuration au démarrage. */
export const health = () => get('/health');