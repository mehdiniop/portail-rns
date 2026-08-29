/**
 * Traduction « payload du portail » → « champs ServiceNow ».
 * Tout ce qui est spécifique au modèle de données vit ici.
 */

/**
 * Le portail utilise la taxonomie du catalogue (hardware, software, access,
 * network, support). La table incident de ServiceNow n'expose par défaut que
 * hardware, software, network, database et inquiry.
 * Si tu ajoutes des choix dans ServiceNow (System Definition > Choice Lists),
 * mets simplement cette table à jour.
 */
const INCIDENT_CATEGORY = {
  hardware: 'hardware',
  software: 'software',
  network: 'network',
  access: 'inquiry',
  support: 'inquiry',
};

function lines(...entries) {
  return entries.filter(Boolean).join('\n');
}

function contextBlock(values) {
  return lines(
    values.location ? `Lieu / site : ${values.location}` : null,
    values.phone ? `Téléphone de rappel : ${values.phone}` : null,
    values.subcategory ? `Sous-catégorie portail : ${values.subcategory}` : null,
    values.attachments?.length
      ? `Pièces jointes : ${values.attachments.map((file) => file.name).join(', ')}`
      : null,
  );
}

/**
 * Incident. On n'envoie pas `priority` : ServiceNow la recalcule lui-même à
 * partir de impact × urgency, exactement comme le portail.
 * `subcategory` part dans la description plutôt que dans le champ dédié, dont
 * les choix dépendent de la catégorie côté ServiceNow.
 */
export function toIncident(values) {
  const context = contextBlock(values);
  return {
    short_description: values.short_description || 'Incident signalé depuis le portail',
    description: [values.description, context].filter(Boolean).join('\n\n'),
    category: INCIDENT_CATEGORY[values.category] || 'inquiry',
    impact: String(values.impact || '3'),
    urgency: String(values.urgency || '3'),
    contact_type: 'self-service',
  };
}

function lineText(line) {
  const fields = Object.entries(line.values || {})
    .filter(([key, value]) => key !== 'attachments' && value !== '' && value != null)
    .map(([key, value]) => `- ${key} : ${value}`);
  return lines(`${line.itemLabel} — quantité ${line.quantity || 1}`, ...fields);
}

/** En-tête de demande (sc_request). */
export function toRequest(cartLines) {
  const first = cartLines[0];
  return {
    short_description:
      cartLines.length === 1
        ? `${first.itemLabel} (x${first.quantity || 1})`
        : `${cartLines.length} articles commandés depuis le portail`,
    description: cartLines.map(lineText).join('\n\n'),
  };
}

/**
 * Ligne de demande (sc_req_item).
 * `cat_item` n'est renseigné que si tu as mappé tes articles du catalogue vers
 * de vrais sys_id ServiceNow (voir CAT_ITEM_SYS_ID ci-dessous).
 */
export function toRequestedItem(line, requestSysId) {
  const catItem = CAT_ITEM_SYS_ID[line.itemKey];
  return {
    request: requestSysId,
    short_description: `${line.itemLabel} (x${line.quantity || 1})`,
    description: lineText(line),
    quantity: String(line.quantity || 1),
    ...(line.price ? { price: String(line.price) } : {}),
    ...(catItem ? { cat_item: catItem } : {}),
  };
}

/**
 * Optionnel : clé d'article du portail → sys_id de l'item de catalogue
 * ServiceNow. Laisse vide tant que tu n'as pas créé les items côté SN.
 * Exemple : laptop: '04b7e94b4f7b4200086eeed18110c7fd'
 */
export const CAT_ITEM_SYS_ID = {};

/** Change / Problem : formulaires génériques du portail. */
export function toGenericRecord(values) {
  const { short_description, description, attachments, ...rest } = values;
  const extras = Object.entries(rest)
    .filter(([, value]) => value !== '' && value != null)
    .map(([key, value]) => `- ${key} : ${value}`);

  return {
    short_description: short_description || 'Enregistrement créé depuis le portail',
    description: [
      description,
      extras.join('\n'),
      attachments?.length
        ? `Pièces jointes : ${attachments.map((file) => file.name).join(', ')}`
        : null,
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
}
