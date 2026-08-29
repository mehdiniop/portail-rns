/**
 * Modèle Incident : matrice de priorité, cibles SLA, états et catégories.
 * Aligné sur la logique ServiceNow (priorité dérivée d'impact × urgence).
 */

export const IMPACTS = [
  { value: '1', label: { fr: 'Élevé — plusieurs équipes', en: 'High — several teams', ar: 'عالٍ — عدة فرق' } },
  { value: '2', label: { fr: 'Moyen — mon équipe', en: 'Medium — my team', ar: 'متوسط — فريقي' } },
  { value: '3', label: { fr: 'Faible — moi seulement', en: 'Low — only me', ar: 'منخفض — أنا فقط' } },
];

export const URGENCIES = [
  { value: '1', label: { fr: 'Haute — bloquant', en: 'High — blocking', ar: 'عالية — يعيق العمل' } },
  { value: '2', label: { fr: 'Moyenne — contournement', en: 'Medium — workaround exists', ar: 'متوسطة — يوجد حل بديل' } },
  { value: '3', label: { fr: 'Basse — gênant', en: 'Low — inconvenient', ar: 'منخفضة — مزعج' } },
];

/** Matrice ServiceNow : priorité = f(impact, urgence). */
const MATRIX = {
  '1': { '1': 1, '2': 2, '3': 3 },
  '2': { '1': 2, '2': 3, '3': 4 },
  '3': { '1': 3, '2': 4, '3': 5 },
};

export function priorityOf(impact, urgency) {
  return MATRIX[String(impact)]?.[String(urgency)] || 4;
}

export const PRIORITIES = {
  1: { key: 'critical', tone: '#d0654f', label: { fr: '1 — Critique', en: '1 — Critical', ar: '1 — حرجة' } },
  2: { key: 'high', tone: '#d08a4a', label: { fr: '2 — Élevée', en: '2 — High', ar: '2 — عالية' } },
  3: { key: 'moderate', tone: '#3d92b0', label: { fr: '3 — Moyenne', en: '3 — Moderate', ar: '3 — متوسطة' } },
  4: { key: 'low', tone: '#4aa38c', label: { fr: '4 — Basse', en: '4 — Low', ar: '4 — منخفضة' } },
  5: { key: 'planning', tone: '#7d80c4', label: { fr: '5 — Planification', en: '5 — Planning', ar: '5 — تخطيط' } },
};

/** Cibles SLA en minutes : première réponse et résolution. */
export const SLA = {
  1: { response: 15, resolve: 4 * 60 },
  2: { response: 30, resolve: 8 * 60 },
  3: { response: 4 * 60, resolve: 24 * 60 },
  4: { response: 8 * 60, resolve: 48 * 60 },
  5: { response: 24 * 60, resolve: 96 * 60 },
};

export const STATES = {
  new: { label: { fr: 'Nouveau', en: 'New', ar: 'جديد' }, tone: '#3d92b0', open: true },
  in_progress: { label: { fr: 'En cours', en: 'In progress', ar: 'قيد المعالجة' }, tone: '#d08a4a', open: true },
  on_hold: { label: { fr: 'En attente', en: 'On hold', ar: 'معلّق' }, tone: '#7d80c4', open: true },
  resolved: { label: { fr: 'Résolu', en: 'Resolved', ar: 'تم الحل' }, tone: '#4aa38c', open: false },
  closed: { label: { fr: 'Clôturé', en: 'Closed', ar: 'مغلق' }, tone: '#8a9aa2', open: false },
  canceled: { label: { fr: 'Annulé', en: 'Canceled', ar: 'ملغى' }, tone: '#8a9aa2', open: false },
};

export const STATE_FLOW = ['new', 'in_progress', 'on_hold', 'resolved', 'closed'];

export const CATEGORIES = [
  {
    value: 'hardware',
    icon: 'laptop',
    label: { fr: 'Matériel', en: 'Hardware', ar: 'الأجهزة' },
    subcategories: [
      { value: 'laptop', label: { fr: 'Ordinateur portable', en: 'Laptop', ar: 'حاسوب محمول' } },
      { value: 'monitor', label: { fr: 'Écran', en: 'Monitor', ar: 'شاشة' } },
      { value: 'printer', label: { fr: 'Imprimante', en: 'Printer', ar: 'طابعة' } },
      { value: 'phone', label: { fr: 'Téléphone', en: 'Phone', ar: 'هاتف' } },
    ],
  },
  {
    value: 'software',
    icon: 'license',
    label: { fr: 'Logiciel', en: 'Software', ar: 'البرمجيات' },
    subcategories: [
      { value: 'office', label: { fr: 'Bureautique', en: 'Office suite', ar: 'حزمة المكتب' } },
      { value: 'business_app', label: { fr: 'Application métier', en: 'Business application', ar: 'تطبيق أعمال' } },
      { value: 'os', label: { fr: "Système d'exploitation", en: 'Operating system', ar: 'نظام التشغيل' } },
    ],
  },
  {
    value: 'network',
    icon: 'wifi',
    label: { fr: 'Réseau', en: 'Network', ar: 'الشبكة' },
    subcategories: [
      { value: 'wifi', label: { fr: 'Wi-Fi', en: 'Wi-Fi', ar: 'واي فاي' } },
      { value: 'vpn', label: { fr: 'VPN', en: 'VPN', ar: 'VPN' } },
      { value: 'lan', label: { fr: 'Réseau filaire', en: 'Wired network', ar: 'شبكة سلكية' } },
    ],
  },
  {
    value: 'access',
    icon: 'key',
    label: { fr: 'Accès et comptes', en: 'Access & accounts', ar: 'الوصول والحسابات' },
    subcategories: [
      { value: 'password', label: { fr: 'Mot de passe', en: 'Password', ar: 'كلمة المرور' } },
      { value: 'permissions', label: { fr: 'Droits insuffisants', en: 'Missing permissions', ar: 'صلاحيات ناقصة' } },
      { value: 'mfa', label: { fr: 'Authentification à deux facteurs', en: 'Two-factor authentication', ar: 'المصادقة الثنائية' } },
    ],
  },
  {
    value: 'other',
    icon: 'question',
    label: { fr: 'Autre', en: 'Other', ar: 'أخرى' },
    subcategories: [],
  },
];

export function categoryOf(value) {
  return CATEGORIES.find((c) => c.value === value) || null;
}

export function subcategoriesOf(value) {
  return categoryOf(value)?.subcategories || [];
}

/**
 * État du SLA à l'instant `now`.
 * → { targetAt, remaining, elapsed, percent, breached, done }
 * `remaining` est en minutes (négatif si dépassé).
 */
export function slaStatus(incident, kind, now = Date.now()) {
  const priority = incident.priority || priorityOf(incident.impact, incident.urgency);
  const minutes = SLA[priority][kind];
  const startedAt = incident.opened;
  const targetAt = startedAt + minutes * 60000;

  const stoppedAt =
    kind === 'response' ? incident.respondedAt : incident.resolvedAt;
  const reference = stoppedAt || now;

  const elapsed = (reference - startedAt) / 60000;
  const remaining = (targetAt - reference) / 60000;
  const percent = Math.min(100, Math.max(0, (elapsed / minutes) * 100));

  return {
    minutes,
    targetAt,
    elapsed,
    remaining,
    percent,
    done: !!stoppedAt,
    breached: remaining < 0,
    warning: remaining >= 0 && percent >= 75,
  };
}

/** « 3 h 20 » / « 45 min » / « 2 j 4 h » à partir d'un nombre de minutes. */
export function formatDuration(minutes, lang = 'fr') {
  const abs = Math.abs(Math.round(minutes));
  const unit = { fr: ['j', 'h', 'min'], en: ['d', 'h', 'min'], ar: ['ي', 'س', 'د'] }[lang] ||
    ['j', 'h', 'min'];

  if (abs < 60) return `${abs} ${unit[2]}`;
  if (abs < 1440) {
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return m ? `${h} ${unit[1]} ${m}` : `${h} ${unit[1]}`;
  }
  const d = Math.floor(abs / 1440);
  const h = Math.floor((abs % 1440) / 60);
  return h ? `${d} ${unit[0]} ${h} ${unit[1]}` : `${d} ${unit[0]}`;
}