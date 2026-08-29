/**
 * Données factices au format renvoyé par l'API ServiceNow :
 * chaque champ porte sa valeur brute et son libellé d'affichage.
 */
export const MOCK_INCIDENTS = [
  {
    sys_id: { value: 'mock-1', display: 'mock-1' },
    number: { value: 'INC0010023', display: 'INC0010023' },
    short_description: {
      value: 'Perte de connectivité sur le site de Georgetown',
      display: 'Perte de connectivité sur le site de Georgetown',
    },
    state: { value: '2', display: 'In Progress' },
    priority: { value: '1', display: '1 - Critical' },
    assigned_to: { value: 'u1', display: 'Beth Anglin' },
    opened_at: { value: '2026-08-27 09:14:02', display: '2026-08-27 09:14:02' },
  },
  {
    sys_id: { value: 'mock-2', display: 'mock-2' },
    number: { value: 'INC0010024', display: 'INC0010024' },
    short_description: {
      value: 'Le routeur client ne répond plus après redémarrage',
      display: 'Le routeur client ne répond plus après redémarrage',
    },
    state: { value: '1', display: 'New' },
    priority: { value: '2', display: '2 - High' },
    assigned_to: { value: '', display: '' },
    opened_at: { value: '2026-08-27 11:40:55', display: '2026-08-27 11:40:55' },
  },
  {
    sys_id: { value: 'mock-3', display: 'mock-3' },
    number: { value: 'INC0010025', display: 'INC0010025' },
    short_description: {
      value: 'Débit descendant inférieur au contrat',
      display: 'Débit descendant inférieur au contrat',
    },
    state: { value: '3', display: 'On Hold' },
    priority: { value: '3', display: '3 - Moderate' },
    assigned_to: { value: 'u2', display: 'Charlie Whitherspoon' },
    opened_at: { value: '2026-08-26 16:02:10', display: '2026-08-26 16:02:10' },
  },
  {
    sys_id: { value: 'mock-4', display: 'mock-4' },
    number: { value: 'INC0010026', display: 'INC0010026' },
    short_description: {
      value: 'Demande de changement d’adresse IP statique',
      display: 'Demande de changement d’adresse IP statique',
    },
    state: { value: '6', display: 'Resolved' },
    priority: { value: '4', display: '4 - Low' },
    assigned_to: { value: 'u1', display: 'Beth Anglin' },
    opened_at: { value: '2026-08-25 08:21:33', display: '2026-08-25 08:21:33' },
  },
];