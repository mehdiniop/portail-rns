/**
 * Vérifie que server/.env existe et qu'il est complet avant le démarrage.
 * Sans lui, le proxy démarre puis échoue au premier appel avec un message
 * bien moins clair que celui-ci.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const envPath = join(root, 'server', '.env');

const box = (lines) => {
  const bar = '─'.repeat(66);
  console.error(`\n  ${bar}`);
  lines.forEach((l) => console.error(`  ${l}`));
  console.error(`  ${bar}\n`);
};

if (!existsSync(envPath)) {
  box([
    'Fichier server/.env introuvable.',
    '',
    "L'application a besoin des identifiants ServiceNow pour",
    'démarrer. Ton enseignant te les a fournis dans un fichier',
    '.env : dépose-le dans le dossier server/, à côté de index.js.',
    '',
    '    RNS/server/.env',
    '',
    "Si tu ne l'as pas reçu, pars du modèle et remplis-le :",
    '',
    '    cp server/.env.example server/.env',
  ]);
  process.exit(1);
}

const content = readFileSync(envPath, 'utf8');
const value = (key) => {
  const line = content.split('\n').find((l) => l.trim().startsWith(`${key}=`));
  return line ? line.slice(line.indexOf('=') + 1).trim() : '';
};

const required = ['SN_INSTANCE', 'SN_CLIENT_ID', 'SN_CLIENT_SECRET', 'SN_USER', 'SN_PASSWORD'];
const missing = required.filter((key) => !value(key));

if (missing.length) {
  box([
    'Le fichier server/.env est incomplet.',
    '',
    `Variables vides : ${missing.join(', ')}`,
    '',
    'Ouvre server/.env et renseigne-les, puis relance.',
  ]);
  process.exit(1);
}

console.log('✓ server/.env complet — démarrage du proxy et du client…\n');
