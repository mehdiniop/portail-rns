import { LEVELS, RISKS, CATEGORIES, CHANGE_TYPES } from './choices.js';

const SHORT_DESC = { name: 'short_description', type: 'text', required: true };
const DESCRIPTION = { name: 'description', type: 'textarea' };

export const MODULES = [
  {
    key: 'incident',
    table: 'incident',
    prefix: 'INC',
    tone: '#cf6a4d',
    fields: [
      SHORT_DESC,
      DESCRIPTION,
      { name: 'category', type: 'select', options: CATEGORIES, ns: 'category' },
      { name: 'urgency', type: 'select', options: LEVELS, ns: 'urgency', default: '2' },
      { name: 'impact', type: 'select', options: LEVELS, ns: 'impact', default: '2' },
    ],
  },
  {
    key: 'request',
    table: 'sc_request',
    prefix: 'REQ',
    tone: '#3d92b0',
    fields: [
      SHORT_DESC,
      DESCRIPTION,
      { name: 'urgency', type: 'select', options: LEVELS, ns: 'urgency', default: '3' },
    ],
  },
  {
    key: 'change',
    table: 'change_request',
    prefix: 'CHG',
    tone: '#7d80c4',
    fields: [
      SHORT_DESC,
      DESCRIPTION,
      { name: 'type', type: 'select', options: CHANGE_TYPES, ns: 'changeType', default: 'normal' },
      { name: 'risk', type: 'select', options: RISKS, ns: 'risk', default: '3' },
      { name: 'impact', type: 'select', options: LEVELS, ns: 'impact', default: '2' },
    ],
  },
  {
    key: 'problem',
    table: 'problem',
    prefix: 'PRB',
    tone: '#4aa38c',
    fields: [
      SHORT_DESC,
      DESCRIPTION,
      { name: 'urgency', type: 'select', options: LEVELS, ns: 'urgency', default: '2' },
      { name: 'impact', type: 'select', options: LEVELS, ns: 'impact', default: '2' },
    ],
  },
];

export function findModule(key) {
  return MODULES.find((module) => module.key === key) || null;
}

export function emptyValues(module) {
  const values = {};
  for (const field of module.fields) {
    values[field.name] = field.default ?? (field.type === 'select' ? field.options[0] : '');
  }
  return values;
}