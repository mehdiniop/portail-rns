import { useI18n } from '../i18n.jsx';
import { CATEGORIES, pick, priceOf, toneOf } from '../catalog.js';
import CatalogIcon from './CatalogIcon.jsx';

const TXT = {
  fr: {
    home: 'Accueil',
    catalog: 'Catalogue de services',
    requests: 'Mes demandes',
    summary: 'Résumé',
    item: 'Article',
    category: 'Catégorie',
    quantity: 'Quantité',
    price: 'Prix',
    opened: 'Créée le',
    state: 'État',
    stateOpen: 'Ouverte',
    stateClosed: 'Fermée',
    options: 'Options soumises',
    attachments: 'Pièces jointes',
    noAttachments: 'Aucune pièce jointe.',
    noOptions: 'Aucune option renseignée.',
    progress: 'Suivi',
    steps: ['Soumise', 'En approbation', 'En cours de traitement', 'Clôturée'],
    actions: 'Actions',
    cancel: 'Annuler la demande',
    back: 'Retour à mes demandes',
    canceled: 'Cette demande a été annulée.',
    locale: 'fr-CA',
  },
  en: {
    home: 'Home',
    catalog: 'Service catalog',
    requests: 'My requests',
    summary: 'Summary',
    item: 'Item',
    category: 'Category',
    quantity: 'Quantity',
    price: 'Price',
    opened: 'Opened',
    state: 'State',
    stateOpen: 'Open',
    stateClosed: 'Closed',
    options: 'Submitted options',
    attachments: 'Attachments',
    noAttachments: 'No attachment.',
    noOptions: 'No option provided.',
    progress: 'Progress',
    steps: ['Submitted', 'Awaiting approval', 'In progress', 'Closed'],
    actions: 'Actions',
    cancel: 'Cancel request',
    back: 'Back to my requests',
    canceled: 'This request has been cancelled.',
    locale: 'en-CA',
  },
  ar: {
    home: 'الرئيسية',
    catalog: 'كتالوج الخدمات',
    requests: 'طلباتي',
    summary: 'الملخص',
    item: 'العنصر',
    category: 'الفئة',
    quantity: 'الكمية',
    price: 'السعر',
    opened: 'تاريخ الإنشاء',
    state: 'الحالة',
    stateOpen: 'مفتوح',
    stateClosed: 'مغلق',
    options: 'الخيارات المُرسلة',
    attachments: 'المرفقات',
    noAttachments: 'لا توجد مرفقات.',
    noOptions: 'لم تُقدَّم أي خيارات.',
    progress: 'التتبع',
    steps: ['تم الإرسال', 'بانتظار الموافقة', 'قيد المعالجة', 'مغلق'],
    actions: 'الإجراءات',
    cancel: 'إلغاء الطلب',
    back: 'العودة إلى طلباتي',
    canceled: 'تم إلغاء هذا الطلب.',
    locale: 'ar',
  },
};

/** Retrouve le libellé d'un champ et de sa valeur dans la définition de l'article. */
function describe(item, name, value, lang) {
  const field = (item?.fields || []).find((f) => f.name === name);
  if (!field) return { label: name, value: String(value) };

  const label = pick(field.label, lang) || name;
  if (field.type === 'select') {
    const choice = (field.choices || []).find((c) => c.value === value);
    return { label, value: choice ? pick(choice.label, lang) : String(value) };
  }
  return { label, value: String(value) };
}

export default function RequestDetail({
  request,
  onBack,
  onBackToCatalog,
  onBackToRequests,
  onCancel,
}) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;

  const item = request.item;
  const category = item ? CATEGORIES.find((c) => c.key === item.category) : null;
  const accent = item ? toneOf(item.category) : '#3d92b0';
  const closed = request.state === 'closed';
  const price = item ? priceOf(item, request.quantity || 1, lang) : null;

  const entries = Object.entries(request.values || {}).filter(
    ([, value]) => value !== '' && value !== undefined && value !== null,
  );

  const date = new Date(request.opened).toLocaleString(tx.locale, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  /* Étape courante : 1 (soumise) tant qu'ouverte, 4 une fois close. */
  const currentStep = closed ? 4 : 1;

  return (
    <section className="rd" style={{ '--cat-accent': accent }}>
      <nav className="rd-crumbs" aria-label={tx.requests}>
        <button type="button" className="crumb-link" onClick={onBack}>{tx.home}</button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button type="button" className="crumb-link" onClick={onBackToCatalog || onBack}>
          {tx.catalog}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button type="button" className="crumb-link" onClick={onBackToRequests || onBack}>
          {tx.requests}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <span className="crumb-current">{request.number}</span>
      </nav>

      <div className="rd-grid">
        {/* -------------------------------------------------- panneau principal */}
        <div className="rd-main">
          <header className="rd-head">
            {item && (
              <span className="rd-thumb" aria-hidden="true">
                <CatalogIcon name={item.icon} size={26} />
              </span>
            )}
            <div>
              <p className="rd-number">{request.number}</p>
              <h2>{item ? pick(item.label, lang) : request.summary || request.number}</h2>
            </div>
            <span className={`rd-state ${closed ? 'closed' : ''}`}>
              {closed ? tx.stateClosed : tx.stateOpen}
            </span>
          </header>

          {closed && <p className="rd-banner">{tx.canceled}</p>}

          <section className="rd-section">
            <h3>{tx.summary}</h3>
            <dl className="rd-facts">
              {item && (
                <>
                  <div>
                    <dt>{tx.item}</dt>
                    <dd>{pick(item.label, lang)}</dd>
                  </div>
                  <div>
                    <dt>{tx.category}</dt>
                    <dd>{category ? pick(category.label, lang) : '—'}</dd>
                  </div>
                </>
              )}
              <div>
                <dt>{tx.quantity}</dt>
                <dd>{request.quantity || 1}</dd>
              </div>
              {price && (
                <div>
                  <dt>{tx.price}</dt>
                  <dd>{price.totalText}</dd>
                </div>
              )}
              <div>
                <dt>{tx.opened}</dt>
                <dd>{date}</dd>
              </div>
              <div>
                <dt>{tx.state}</dt>
                <dd>{closed ? tx.stateClosed : tx.stateOpen}</dd>
              </div>
            </dl>
          </section>

          <section className="rd-section">
            <h3>{tx.options}</h3>
            {entries.length === 0 ? (
              <p className="rd-empty">{tx.noOptions}</p>
            ) : (
              <dl className="rd-facts">
                {entries.map(([name, value]) => {
                  const row = describe(item, name, value, lang);
                  return (
                    <div key={name} className={String(row.value).length > 40 ? 'wide' : ''}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </section>

          <section className="rd-section">
            <h3>{tx.attachments}</h3>
            {!(request.attachments || []).length ? (
              <p className="rd-empty">{tx.noAttachments}</p>
            ) : (
              <ul className="rd-files">
                {request.attachments.map((file, index) => (
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
        </div>

        {/* ------------------------------------------------------------ latéral */}
        <aside className="rd-side">
          <div className="rd-box">
            <h3>{tx.progress}</h3>
            <ol className="rd-steps">
              {tx.steps.map((step, index) => (
                <li
                  key={step}
                  className={
                    index + 1 < currentStep ? 'done' : index + 1 === currentStep ? 'now' : ''
                  }
                >
                  <span className="rd-dot" aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rd-box">
            <h3>{tx.actions}</h3>
            {!closed && onCancel && (
              <button type="button" className="rd-btn danger" onClick={() => onCancel(request.id)}>
                {tx.cancel}
              </button>
            )}
            <button type="button" className="rd-btn ghost" onClick={onBackToRequests || onBack}>
              {tx.back}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}