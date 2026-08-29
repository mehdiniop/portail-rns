import { useEffect, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { pick } from '../catalog.js';
import {
  CATEGORIES,
  IMPACTS,
  PRIORITIES,
  STATES,
  STATE_FLOW,
  URGENCIES,
  formatDuration,
  slaStatus,
  subcategoriesOf,
} from '../incidents.js';
import CatalogIcon from './CatalogIcon.jsx';

const TXT = {
  fr: {
    home: 'Accueil',
    incidents: 'Mes incidents',
    details: 'Détails',
    category: 'Catégorie',
    subcategory: 'Sous-catégorie',
    impact: 'Impact',
    urgency: 'Urgence',
    priority: 'Priorité',
    state: 'État',
    opened: 'Ouvert le',
    location: 'Lieu',
    phone: 'Téléphone',
    description: 'Description',
    noDescription: 'Aucune description fournie.',
    attachments: 'Pièces jointes',
    noAttachments: 'Aucune pièce jointe.',
    sla: 'Engagements de service',
    slaResponse: 'Première réponse',
    slaResolve: 'Résolution',
    target: 'Cible',
    remaining: 'restant',
    overdue: 'dépassé de',
    met: 'Respecté',
    activity: 'Activité',
    addNote: 'Ajouter un commentaire',
    placeholder: 'Votre message…',
    send: 'Envoyer',
    you: 'Vous',
    system: 'Système',
    created: 'Incident créé.',
    stateChanged: (from, to) => `État : ${from} → ${to}`,
    progress: 'Progression',
    actions: 'Actions',
    resolve: 'Marquer comme résolu',
    reopen: 'Rouvrir',
    cancel: 'Annuler l’incident',
    back: 'Retour à mes incidents',
    locale: 'fr-CA',
  },
  en: {
    home: 'Home',
    incidents: 'My incidents',
    details: 'Details',
    category: 'Category',
    subcategory: 'Subcategory',
    impact: 'Impact',
    urgency: 'Urgency',
    priority: 'Priority',
    state: 'State',
    opened: 'Opened',
    location: 'Location',
    phone: 'Phone',
    description: 'Description',
    noDescription: 'No description provided.',
    attachments: 'Attachments',
    noAttachments: 'No attachment.',
    sla: 'Service commitments',
    slaResponse: 'First response',
    slaResolve: 'Resolution',
    target: 'Target',
    remaining: 'left',
    overdue: 'overdue by',
    met: 'Met',
    activity: 'Activity',
    addNote: 'Add a comment',
    placeholder: 'Your message…',
    send: 'Send',
    you: 'You',
    system: 'System',
    created: 'Incident created.',
    stateChanged: (from, to) => `State: ${from} → ${to}`,
    progress: 'Progress',
    actions: 'Actions',
    resolve: 'Mark as resolved',
    reopen: 'Reopen',
    cancel: 'Cancel incident',
    back: 'Back to my incidents',
    locale: 'en-CA',
  },
  ar: {
    home: 'الرئيسية',
    incidents: 'حوادثي',
    details: 'التفاصيل',
    category: 'الفئة',
    subcategory: 'الفئة الفرعية',
    impact: 'التأثير',
    urgency: 'الاستعجال',
    priority: 'الأولوية',
    state: 'الحالة',
    opened: 'تاريخ الفتح',
    location: 'الموقع',
    phone: 'الهاتف',
    description: 'الوصف',
    noDescription: 'لا يوجد وصف.',
    attachments: 'المرفقات',
    noAttachments: 'لا توجد مرفقات.',
    sla: 'التزامات الخدمة',
    slaResponse: 'أول رد',
    slaResolve: 'الحل',
    target: 'الهدف',
    remaining: 'متبقٍ',
    overdue: 'متأخر بـ',
    met: 'ضمن المهلة',
    activity: 'النشاط',
    addNote: 'إضافة تعليق',
    placeholder: 'رسالتك…',
    send: 'إرسال',
    you: 'أنت',
    system: 'النظام',
    created: 'تم إنشاء الحادث.',
    stateChanged: (from, to) => `الحالة: ${from} ← ${to}`,
    progress: 'التقدم',
    actions: 'الإجراءات',
    resolve: 'وضع علامة تم الحل',
    reopen: 'إعادة الفتح',
    cancel: 'إلغاء الحادث',
    back: 'العودة إلى حوادثي',
    locale: 'ar',
  },
};

function labelOf(list, value, lang) {
  const found = list.find((o) => o.value === String(value));
  return found ? pick(found.label, lang) : '—';
}

function SlaGauge({ incident, kind, label, tx, lang, now }) {
  const sla = slaStatus(incident, kind, now);
  const tone = sla.done ? 'done' : sla.breached ? 'breached' : sla.warning ? 'warn' : '';

  return (
    <div className={`id-sla ${tone}`}>
      <div className="id-sla-head">
        <span>{label}</span>
        <strong>
          {sla.done
            ? tx.met
            : sla.breached
              ? `${tx.overdue} ${formatDuration(sla.remaining, lang)}`
              : `${formatDuration(sla.remaining, lang)} ${tx.remaining}`}
        </strong>
      </div>
      <div className="id-bar">
        <span style={{ width: `${sla.percent}%` }} />
      </div>
      <p className="id-sla-foot">
        {tx.target} · {formatDuration(sla.minutes, lang)}
      </p>
    </div>
  );
}

export default function IncidentDetail({
  incident,
  onBack,
  onBackToIncidents,
  onResolve,
  onReopen,
  onCancel,
  onComment,
}) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;
  const [note, setNote] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const priority = PRIORITIES[incident.priority];
  const state = STATES[incident.state];
  const category = CATEGORIES.find((c) => c.value === incident.category);
  const sub = subcategoriesOf(incident.category).find((s) => s.value === incident.subcategory);
  const open = state.open;

  const stepIndex = STATE_FLOW.indexOf(incident.state);

  const date = new Date(incident.opened).toLocaleString(tx.locale, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const send = (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    onComment(incident.id, note.trim());
    setNote('');
  };

  return (
    <section className="id" style={{ '--pri': priority.tone, '--state': state.tone }}>
      <nav className="id-crumbs" aria-label={tx.incidents}>
        <button type="button" className="crumb-link" onClick={onBack}>{tx.home}</button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button type="button" className="crumb-link" onClick={onBackToIncidents || onBack}>
          {tx.incidents}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <span className="crumb-current">{incident.number}</span>
      </nav>

      <div className="id-grid">
        {/* ------------------------------------------------------ colonne principale */}
        <div className="id-main">
          <header className="id-head">
            {category && (
              <span className="id-thumb" aria-hidden="true">
                <CatalogIcon name={category.icon} size={26} />
              </span>
            )}
            <div>
              <p className="id-number">{incident.number}</p>
              <h2>{incident.short_description}</h2>
            </div>
            <div className="id-badges">
              <span className="id-pri">
                <span className="id-pri-dot" aria-hidden="true" />
                {pick(priority.label, lang)}
              </span>
              <span className="id-state">{pick(state.label, lang)}</span>
            </div>
          </header>

          <section className="id-section">
            <h3>{tx.details}</h3>
            <dl className="id-facts">
              <div>
                <dt>{tx.category}</dt>
                <dd>{category ? pick(category.label, lang) : '—'}</dd>
              </div>
              <div>
                <dt>{tx.subcategory}</dt>
                <dd>{sub ? pick(sub.label, lang) : '—'}</dd>
              </div>
              <div>
                <dt>{tx.impact}</dt>
                <dd>{labelOf(IMPACTS, incident.impact, lang)}</dd>
              </div>
              <div>
                <dt>{tx.urgency}</dt>
                <dd>{labelOf(URGENCIES, incident.urgency, lang)}</dd>
              </div>
              <div>
                <dt>{tx.opened}</dt>
                <dd>{date}</dd>
              </div>
              <div>
                <dt>{tx.location}</dt>
                <dd>{incident.location || '—'}</dd>
              </div>
              {incident.phone && (
                <div>
                  <dt>{tx.phone}</dt>
                  <dd>{incident.phone}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="id-section">
            <h3>{tx.description}</h3>
            <p className={incident.description ? 'id-desc' : 'id-empty'}>
              {incident.description || tx.noDescription}
            </p>
          </section>

          <section className="id-section">
            <h3>{tx.attachments}</h3>
            {!(incident.attachments || []).length ? (
              <p className="id-empty">{tx.noAttachments}</p>
            ) : (
              <ul className="id-files">
                {incident.attachments.map((file, index) => (
                  <li key={`${file.name || file}-${index}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3.5H7a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8L14 3.5Z" />
                      <path d="M13.8 3.6V8.2h4.6" />
                    </svg>
                    {file.name || file}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ---------------------------------------------------------- activité */}
          <section className="id-section">
            <h3>{tx.activity}</h3>

            <ol className="id-feed">
              {(incident.activity || []).map((entry, index) => (
                <li key={index} className={entry.author === 'system' ? 'sys' : ''}>
                  <span className="id-avatar" aria-hidden="true">
                    {entry.author === 'system' ? '•' : tx.you.slice(0, 1)}
                  </span>
                  <div>
                    <p className="id-feed-meta">
                      <strong>{entry.author === 'system' ? tx.system : tx.you}</strong>
                      <time>
                        {new Date(entry.at).toLocaleString(tx.locale, {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </time>
                    </p>
                    <p className="id-feed-text">{entry.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {open && (
              <form className="id-note" onSubmit={send}>
                <label htmlFor="id-note">{tx.addNote}</label>
                <textarea
                  id="id-note"
                  rows={3}
                  placeholder={tx.placeholder}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button type="submit" className="id-btn primary" disabled={!note.trim()}>
                  {tx.send}
                </button>
              </form>
            )}
          </section>
        </div>

        {/* --------------------------------------------------------------- latéral */}
        <aside className="id-side">
          <div className="id-box">
            <h3>{tx.sla}</h3>
            <SlaGauge incident={incident} kind="response" label={tx.slaResponse}
                      tx={tx} lang={lang} now={now} />
            <SlaGauge incident={incident} kind="resolve" label={tx.slaResolve}
                      tx={tx} lang={lang} now={now} />
          </div>

          <div className="id-box">
            <h3>{tx.progress}</h3>
            <ol className="id-steps">
              {STATE_FLOW.map((key, index) => (
                <li
                  key={key}
                  className={index < stepIndex ? 'done' : index === stepIndex ? 'now' : ''}
                >
                  <span className="id-dot" aria-hidden="true" />
                  {pick(STATES[key].label, lang)}
                </li>
              ))}
            </ol>
          </div>

          <div className="id-box">
            <h3>{tx.actions}</h3>
            {open && onResolve && (
              <button type="button" className="id-btn ok" onClick={() => onResolve(incident.id)}>
                {tx.resolve}
              </button>
            )}
            {!open && onReopen && (
              <button type="button" className="id-btn ghost" onClick={() => onReopen(incident.id)}>
                {tx.reopen}
              </button>
            )}
            {open && onCancel && (
              <button type="button" className="id-btn danger" onClick={() => onCancel(incident.id)}>
                {tx.cancel}
              </button>
            )}
            <button type="button" className="id-btn ghost" onClick={onBackToIncidents || onBack}>
              {tx.back}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}