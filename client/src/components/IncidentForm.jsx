import { useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { pick } from '../catalog.js';
import {
  CATEGORIES,
  IMPACTS,
  PRIORITIES,
  SLA,
  URGENCIES,
  formatDuration,
  priorityOf,
  subcategoriesOf,
} from '../incidents.js';
import CatalogIcon from './CatalogIcon.jsx';

const TXT = {
  fr: {
    home: 'Accueil',
    crumb: 'Signaler un incident',
    myIncidents: 'Mes incidents',
    title: 'Signaler un incident',
    lead: 'Décrivez ce qui ne fonctionne pas. La priorité et les délais sont calculés automatiquement.',
    what: 'Ce qui se passe',
    summary: 'Résumé',
    summaryHint: 'Une phrase courte, comme un titre.',
    description: 'Description détaillée',
    descriptionHint: 'Message d’erreur, étapes pour reproduire, depuis quand.',
    classify: 'Classification',
    category: 'Catégorie',
    subcategory: 'Sous-catégorie',
    none: '—',
    impact: 'Impact — qui est touché ?',
    urgency: 'Urgence — à quel point c’est bloquant ?',
    context: 'Contexte',
    location: 'Lieu / site',
    phone: 'Téléphone de rappel',
    attachments: 'Pièces jointes',
    choose: 'Choisir un fichier',
    drop: 'ou glissez-le ici.',
    remove: 'Retirer',
    resulting: 'Priorité calculée',
    slaTitle: 'Engagements de service',
    slaResponse: 'Première réponse',
    slaResolve: 'Résolution',
    slaNote: 'Le compte à rebours démarre dès la création de l’incident.',
    submit: 'Créer l’incident',
    cancel: 'Annuler',
    error: 'Le résumé est obligatoire.',
  },
  en: {
    home: 'Home',
    crumb: 'Report an incident',
    myIncidents: 'My incidents',
    title: 'Report an incident',
    lead: 'Describe what is broken. Priority and targets are derived automatically.',
    what: 'What is happening',
    summary: 'Summary',
    summaryHint: 'One short sentence, like a title.',
    description: 'Detailed description',
    descriptionHint: 'Error message, steps to reproduce, since when.',
    classify: 'Classification',
    category: 'Category',
    subcategory: 'Subcategory',
    none: '—',
    impact: 'Impact — who is affected?',
    urgency: 'Urgency — how blocking is it?',
    context: 'Context',
    location: 'Location / site',
    phone: 'Callback phone',
    attachments: 'Attachments',
    choose: 'Choose a file',
    drop: 'or drag it here.',
    remove: 'Remove',
    resulting: 'Derived priority',
    slaTitle: 'Service commitments',
    slaResponse: 'First response',
    slaResolve: 'Resolution',
    slaNote: 'The clock starts as soon as the incident is created.',
    submit: 'Create incident',
    cancel: 'Cancel',
    error: 'A summary is required.',
  },
  ar: {
    home: 'الرئيسية',
    crumb: 'الإبلاغ عن حادث',
    myIncidents: 'حوادثي',
    title: 'الإبلاغ عن حادث',
    lead: 'صف ما لا يعمل. تُحتسب الأولوية والمهل تلقائيًا.',
    what: 'ما الذي يحدث',
    summary: 'الملخص',
    summaryHint: 'جملة قصيرة بمثابة عنوان.',
    description: 'وصف مفصل',
    descriptionHint: 'رسالة الخطأ وخطوات إعادة الإنتاج ومنذ متى.',
    classify: 'التصنيف',
    category: 'الفئة',
    subcategory: 'الفئة الفرعية',
    none: '—',
    impact: 'التأثير — من المتأثر؟',
    urgency: 'الاستعجال — ما مدى الإعاقة؟',
    context: 'السياق',
    location: 'الموقع',
    phone: 'هاتف للاتصال',
    attachments: 'المرفقات',
    choose: 'اختر ملفًا',
    drop: 'أو اسحبه إلى هنا.',
    remove: 'إزالة',
    resulting: 'الأولوية المحتسبة',
    slaTitle: 'التزامات الخدمة',
    slaResponse: 'أول رد',
    slaResolve: 'الحل',
    slaNote: 'يبدأ العد التنازلي فور إنشاء الحادث.',
    submit: 'إنشاء الحادث',
    cancel: 'إلغاء',
    error: 'الملخص مطلوب.',
  },
};

export default function IncidentForm({ onSubmit, onBack, onViewIncidents }) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;
  const fileInput = useRef(null);

  const [values, setValues] = useState({
    short_description: '',
    description: '',
    category: 'hardware',
    subcategory: '',
    impact: '2',
    urgency: '2',
    location: '',
    phone: '',
  });
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const set = (name, value) =>
    setValues((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : null),
    }));

  const priority = priorityOf(values.impact, values.urgency);
  const meta = PRIORITIES[priority];
  const targets = SLA[priority];
  const subs = useMemo(() => subcategoriesOf(values.category), [values.category]);
  const category = CATEGORIES.find((c) => c.value === values.category);

  const addFiles = (list) => {
    const incoming = Array.from(list || []).map((f) => ({ name: f.name, size: f.size }));
    if (incoming.length) setFiles((prev) => [...prev, ...incoming]);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!values.short_description.trim()) {
      setError(tx.error);
      return;
    }
    setError('');
    onSubmit({ ...values, priority, attachments: files });
  };

  return (
    <section className="inc" style={{ '--pri': meta.tone }}>
      <nav className="inc-crumbs" aria-label={tx.crumb}>
        <button type="button" className="crumb-link" onClick={onBack}>{tx.home}</button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        {onViewIncidents && (
          <>
            <button type="button" className="crumb-link" onClick={onViewIncidents}>
              {tx.myIncidents}
            </button>
            <span className="crumb-sep" aria-hidden="true">›</span>
          </>
        )}
        <span className="crumb-current">{tx.crumb}</span>
      </nav>

      <form className="inc-grid" onSubmit={submit} noValidate>
        <div className="inc-main">
          <header className="inc-head">
            <h2>{tx.title}</h2>
            <p>{tx.lead}</p>
          </header>

          {/* ------------------------------------------------------ description */}
          <section className="inc-section">
            <h3>{tx.what}</h3>

            <div className="inc-field">
              <label htmlFor="inc-short">
                {tx.summary}<span className="req" aria-hidden="true"> *</span>
              </label>
              <input
                id="inc-short"
                type="text"
                value={values.short_description}
                onChange={(e) => set('short_description', e.target.value)}
              />
              <p className="inc-hint">{tx.summaryHint}</p>
            </div>

            <div className="inc-field">
              <label htmlFor="inc-desc">{tx.description}</label>
              <textarea
                id="inc-desc"
                rows={6}
                value={values.description}
                onChange={(e) => set('description', e.target.value)}
              />
              <p className="inc-hint">{tx.descriptionHint}</p>
            </div>
          </section>

          {/* --------------------------------------------------- classification */}
          <section className="inc-section">
            <h3>{tx.classify}</h3>

            <div className="inc-cats" role="radiogroup" aria-label={tx.category}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  role="radio"
                  aria-checked={values.category === cat.value}
                  className={`inc-cat ${values.category === cat.value ? 'on' : ''}`}
                  onClick={() => set('category', cat.value)}
                >
                  <CatalogIcon name={cat.icon} size={20} />
                  {pick(cat.label, lang)}
                </button>
              ))}
            </div>

            {!!subs.length && (
              <div className="inc-field narrow">
                <label htmlFor="inc-sub">{tx.subcategory}</label>
                <select
                  id="inc-sub"
                  value={values.subcategory}
                  onChange={(e) => set('subcategory', e.target.value)}
                >
                  <option value="">{tx.none}</option>
                  {subs.map((sub) => (
                    <option key={sub.value} value={sub.value}>{pick(sub.label, lang)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="inc-pair">
              <div className="inc-field">
                <label htmlFor="inc-impact">{tx.impact}</label>
                <select
                  id="inc-impact"
                  value={values.impact}
                  onChange={(e) => set('impact', e.target.value)}
                >
                  {IMPACTS.map((o) => (
                    <option key={o.value} value={o.value}>{pick(o.label, lang)}</option>
                  ))}
                </select>
              </div>

              <div className="inc-field">
                <label htmlFor="inc-urgency">{tx.urgency}</label>
                <select
                  id="inc-urgency"
                  value={values.urgency}
                  onChange={(e) => set('urgency', e.target.value)}
                >
                  {URGENCIES.map((o) => (
                    <option key={o.value} value={o.value}>{pick(o.label, lang)}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------- contexte */}
          <section className="inc-section">
            <h3>{tx.context}</h3>
            <div className="inc-pair">
              <div className="inc-field">
                <label htmlFor="inc-loc">{tx.location}</label>
                <input
                  id="inc-loc"
                  type="text"
                  value={values.location}
                  onChange={(e) => set('location', e.target.value)}
                />
              </div>
              <div className="inc-field">
                <label htmlFor="inc-phone">{tx.phone}</label>
                <input
                  id="inc-phone"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------- pièces jointes */}
          <section className="inc-section">
            <h3>{tx.attachments}</h3>

            <div
              className={`inc-drop ${dragging ? 'over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 18a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.68-1.2A4.25 4.25 0 0 1 18 18" />
                <path d="M12 12v8m0-8 3 3m-3-3-3 3" />
              </svg>
              <p>
                <button type="button" className="link" onClick={() => fileInput.current?.click()}>
                  {tx.choose}
                </button>{' '}
                {tx.drop}
              </p>
              <input
                ref={fileInput}
                type="file"
                multiple
                hidden
                onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {!!files.length && (
              <ul className="inc-files">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                    >
                      {tx.remove}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ------------------------------------------------------------ latéral */}
        <aside className="inc-side">
          <div className="inc-box">
            <h3>{tx.resulting}</h3>
            <p className="inc-priority">
              <span className="inc-pri-dot" aria-hidden="true" />
              {pick(meta.label, lang)}
            </p>
            {category && (
              <p className="inc-pri-sub">{pick(category.label, lang)}</p>
            )}
          </div>

          <div className="inc-box">
            <h3>{tx.slaTitle}</h3>
            <div className="inc-sla-row">
              <span>{tx.slaResponse}</span>
              <strong>{formatDuration(targets.response, lang)}</strong>
            </div>
            <div className="inc-sla-row">
              <span>{tx.slaResolve}</span>
              <strong>{formatDuration(targets.resolve, lang)}</strong>
            </div>
            <p className="inc-note">{tx.slaNote}</p>
          </div>

          <div className="inc-box">
            {error && <p className="inc-error" role="alert">{error}</p>}
            <button type="submit" className="inc-btn primary">{tx.submit}</button>
            <button type="button" className="inc-btn ghost" onClick={onBack}>{tx.cancel}</button>
          </div>
        </aside>
      </form>
    </section>
  );
}