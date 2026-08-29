/**
 * Proxy entre le portail React et ServiceNow.
 * Le navigateur ne connaît que ces routes ; les identifiants restent ici.
 */
import cors from 'cors';
import express from 'express';

import { toGenericRecord, toIncident, toRequest, toRequestedItem } from './mapping.js';
import {
  checkAuth,
  createRecord,
  readRecord,
  updateRecord,
  readJournal,
  listRecords,
} from './servicenow.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

/** Renvoie une 502 lisible plutôt qu'un plantage silencieux. */
const route = (handler) => (req, res) => {
  Promise.resolve(handler(req, res)).catch((error) => {
    console.error(`[${req.method} ${req.path}]`, error.message);
    if (!res.headersSent) res.status(502).json({ error: error.message });
  });
};

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    instance: process.env.SN_INSTANCE || null,
    auth: (process.env.SN_AUTH || 'oauth').toLowerCase(),
    grant: process.env.SN_GRANT || 'password',
    user: process.env.SN_USER || null,
    clientId: process.env.SN_CLIENT_ID ? 'renseigné' : null,
  });
});

/** Diagnostic : obtient un jeton sans rien créer dans ServiceNow. */
app.get(
  '/api/auth-check',
  route(async (req, res) => {
    res.json(await checkAuth());
  }),
);

/* ------------------------------------------- liste des incidents */

const INCIDENT_FIELDS =
  'sys_id,number,short_description,description,category,impact,urgency,priority,state,opened_at';

app.get(
  '/api/incidents',
  route(async (req, res) => {
    const user = process.env.SN_USER || '';
    const query = `opened_by.user_name=${user}^ORDERBYDESCsys_created_on`;
    res.json({ incidents: await listRecords('incident', query, INCIDENT_FIELDS, 50) });
  }),
);

/* ------------------------------------------------------------- incidents */

app.post(
  '/api/incidents',
  route(async (req, res) => {
    const result = await createRecord('incident', toIncident(req.body || {}));
    res.json({ table: 'incident', number: result.number, sys_id: result.sys_id });
  }),
);

/* ---------------------------------------------------------- demandes */

app.post(
  '/api/requests',
  route(async (req, res) => {
    const lines = Array.isArray(req.body?.lines) ? req.body.lines : [];
    if (!lines.length) {
      res.status(400).json({ error: 'Aucune ligne à commander.' });
      return;
    }

    const request = await createRecord('sc_request', toRequest(lines));

    const items = [];
    for (const line of lines) {
      const item = await createRecord('sc_req_item', toRequestedItem(line, request.sys_id));
      items.push({ key: line.itemKey, number: item.number, sys_id: item.sys_id });
    }

    res.json({
      table: 'sc_request',
      number: request.number,
      sys_id: request.sys_id,
      items,
    });
  }),
);

/* ------------------------------------------------- change / problem */

const ALLOWED_TABLES = new Set(['change_request', 'problem', 'incident']);

app.post(
  '/api/records/:table',
  route(async (req, res) => {
    const { table } = req.params;
    if (!ALLOWED_TABLES.has(table)) {
      res.status(400).json({ error: `Table non autorisée : ${table}` });
      return;
    }
    const result = await createRecord(table, toGenericRecord(req.body || {}));
    res.json({ table, number: result.number, sys_id: result.sys_id });
  }),
);

/* --------------------------------------------------- relecture d'un statut */

app.get(
  '/api/records/:table/:sysId',
  route(async (req, res) => {
    const { table, sysId } = req.params;
    if (!ALLOWED_TABLES.has(table) && !['sc_request', 'sc_req_item'].includes(table)) {
      res.status(400).json({ error: `Table non autorisée : ${table}` });
      return;
    }
    res.json(await readRecord(table, sysId));
  }),
);

/* ------------------------------------------- mise à jour (commentaire, statut) */

app.patch(
  '/api/records/:table/:sysId',
  route(async (req, res) => {
    const { table, sysId } = req.params;
    if (!ALLOWED_TABLES.has(table)) {
      res.status(400).json({ error: `Table non autorisée : ${table}` });
      return;
    }
    res.json(await updateRecord(table, sysId, req.body || {}));
  }),
);

/* ------------------------------------------- journal (commentaires) */

app.get(
  '/api/journal/:sysId',
  route(async (req, res) => {
    const elements = req.query.elements === 'all' ? 'comments,work_notes' : 'comments';
    res.json({ entries: await readJournal(req.params.sysId, elements) });
  }),
);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Proxy ServiceNow prêt sur http://localhost:${port}`);
  if (!process.env.SN_INSTANCE) {
    console.warn('⚠  SN_INSTANCE absent : remplis server/.env avant de créer un enregistrement.');
  }
});