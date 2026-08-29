import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { CATEGORIES, pick, priceOf, toneOf } from '../catalog.js';
import CatalogIcon from './CatalogIcon.jsx';
import LeaveModal from './LeaveModal.jsx';

const TXT = {
  fr: {
    home: 'Accueil',
    catalog: 'Catalogue de services',
    specs: 'Caractéristiques',
    options: 'Options de la demande',
    attach: 'Pièces jointes',
    choose: 'Choisir un fichier',
    drop: 'ou glissez-le ici.',
    remove: 'Retirer',
    quantity: 'Quantité',
    price: 'Prix',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    cart: 'Ajouter au panier',
    draft: 'Enregistrer le brouillon',
    draftUpdate: 'Mettre à jour le brouillon',
    order: 'Commander',
    added: 'Votre article a été ajouté au panier.',
    saved: 'Votre article a été enregistré dans Mes demandes.',
    viewCart: 'Voir le panier',
    viewDrafts: 'Voir les brouillons',
    dismiss: 'Fermer le message',
    delivery: 'Livraison estimée sous 5 jours ouvrés.',
  },
  en: {
    home: 'Home',
    catalog: 'Service catalog',
    specs: 'Specifications',
    options: 'Request options',
    attach: 'Attachments',
    choose: 'Choose a file',
    drop: 'or drag it here.',
    remove: 'Remove',
    quantity: 'Quantity',
    price: 'Price',
    unitPrice: 'Unit price',
    total: 'Total',
    cart: 'Add to cart',
    draft: 'Save as draft',
    draftUpdate: 'Update draft',
    order: 'Order now',
    added: 'Your item has been added to the cart.',
    saved: 'Your item has been saved in My Requests.',
    viewCart: 'View cart',
    viewDrafts: 'View drafts',
    dismiss: 'Dismiss this message',
    delivery: 'Estimated delivery within 5 business days.',
  },
  ar: {
    home: 'الرئيسية',
    catalog: 'كتالوج الخدمات',
    specs: 'المواصفات',
    options: 'خيارات الطلب',
    attach: 'المرفقات',
    choose: 'اختر ملفًا',
    drop: 'أو اسحبه إلى هنا.',
    remove: 'إزالة',
    quantity: 'الكمية',
    price: 'السعر',
    unitPrice: 'سعر الوحدة',
    total: 'الإجمالي',
    cart: 'أضف إلى السلة',
    draft: 'حفظ كمسودة',
    draftUpdate: 'تحديث المسودة',
    order: 'اطلب الآن',
    added: 'تمت إضافة العنصر إلى السلة.',
    saved: 'تم حفظ العنصر في «طلباتي».',
    viewCart: 'عرض السلة',
    viewDrafts: 'عرض المسودات',
    dismiss: 'إغلاق الرسالة',
    delivery: 'التسليم المتوقع خلال 5 أيام عمل.',
  },
};

export default function CatalogItem({
  item,
  draft = null,
  onSubmit,
  onSaveDraft,
  onAddToCart,
  onBack,
  onBackToCatalog,
  onViewDrafts,
  onViewCart,
}) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;
  const fileInput = useRef(null);

  const category = CATEGORIES.find((c) => c.key === item.category);
  const accent = toneOf(item.category);

  const initial = useMemo(() => {
    const seed = {};
    (item.fields || []).forEach((field) => {
      if (draft?.values?.[field.name] !== undefined) seed[field.name] = draft.values[field.name];
      else if (field.default !== undefined) seed[field.name] = field.default;
      else if (field.type === 'select' && field.choices?.length) seed[field.name] = field.choices[0].value;
      else seed[field.name] = '';
    });
    return seed;
  }, [item, draft]);

  const [values, setValues] = useState(initial);
  const [quantity, setQuantity] = useState(draft?.quantity || 1);
  const [files, setFiles] = useState(draft?.attachments || []);
  const [dragging, setDragging] = useState(false);
  const [banner, setBanner] = useState(null); // { kind: 'cart' | 'draft' }
  const [isDraft, setIsDraft] = useState(!!draft);

  const [pending, setPending] = useState(null);

  /* La page est « sale » dès qu'une saisie diverge de l'état initial. */
  const dirty =
    JSON.stringify(values) !== JSON.stringify(initial) ||
    files.length !== (draft?.attachments?.length || 0) ||
    quantity !== (draft?.quantity || 1);

  /* Avertit aussi au rechargement / à la fermeture de l'onglet. */
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  /* Enveloppe une navigation : demande confirmation si nécessaire. */
  const guard = (navigate) => () => {
    if (!navigate) return;
    if (!dirty) {
      navigate();
      return;
    }
    setPending(() => navigate);
  };

  const price = priceOf(item, quantity, lang);

  const set = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const addFiles = (list) => {
    const incoming = Array.from(list || []).map((f) => ({ name: f.name, size: f.size }));
    if (incoming.length) setFiles((prev) => [...prev, ...incoming]);
  };

  const payload = () => ({
    item,
    values,
    quantity,
    attachments: files,
    id: draft?.id,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setPending(null);
    onSubmit({
      item: item.key,
      category: item.category,
      quantity,
      attachments: files.map((f) => f.name),
      ...values,
    });
  };

  const renderField = (field) => {
    const id = `f-${field.name}`;
    const label = pick(field.label, lang) || field.name;
    const common = {
      id,
      name: field.name,
      required: field.required,
      value: values[field.name] ?? '',
      onChange: (e) => set(field.name, e.target.value),
    };

    return (
      <div key={field.name} className={`ci-field ${field.type === 'textarea' ? 'wide' : ''}`}>
        <label htmlFor={id}>
          {label}
          {field.required && <span className="req" aria-hidden="true"> *</span>}
        </label>

        {field.type === 'textarea' && <textarea rows={5} {...common} />}

        {field.type === 'select' && (
          <select {...common}>
            {(field.choices || []).map((choice) => (
              <option key={choice.value} value={choice.value}>
                {pick(choice.label, lang)}
              </option>
            ))}
          </select>
        )}

        {['text', 'number', 'date'].includes(field.type) && <input type={field.type} {...common} />}
      </div>
    );
  };

  return (
    <section className="ci" style={{ '--cat-accent': accent }}>
      {pending && (
        <LeaveModal
          onCancel={() => setPending(null)}
          onConfirm={() => {
            const navigate = pending;
            setPending(null);
            navigate();
          }}
        />
      )}

      <nav className="ci-crumbs" aria-label={tx.catalog}>
        <button type="button" className="crumb-link" onClick={guard(onBack)}>{tx.home}</button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button type="button" className="crumb-link" onClick={guard(onBackToCatalog || onBack)}>
          {tx.catalog}
        </button>
        {category && (
          <>
            <span className="crumb-sep" aria-hidden="true">›</span>
            <button type="button" className="crumb-link" onClick={guard(onBackToCatalog || onBack)}>
              {pick(category.label, lang)}
            </button>
          </>
        )}
        <span className="crumb-sep" aria-hidden="true">›</span>
        <span className="crumb-current">{pick(item.label, lang)}</span>
      </nav>

      <form className="ci-grid" onSubmit={handleSubmit}>
        <div className="ci-left">
          {banner && (
            <div className="ci-banner" role="status">
              <span className="ci-banner-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <p>
                {banner === 'draft' ? tx.saved : tx.added}{' '}
                <button
                  type="button"
                  className="link"
                  onClick={banner === 'draft' ? onViewDrafts : onViewCart}
                >
                  {banner === 'draft' ? tx.viewDrafts : tx.viewCart}
                </button>
              </p>
              <button
                type="button"
                className="ci-banner-close"
                aria-label={tx.dismiss}
                onClick={() => setBanner(null)}
              >
                ×
              </button>
            </div>
          )}

        {/* ------------------------------------------------ panneau principal */}
        <div className="ci-main">
          <header className="ci-head">
            <h2>{pick(item.label, lang)}</h2>
            <p>{pick(item.description, lang)}</p>
          </header>

          <div className="ci-overview">
            <div className="ci-media" aria-hidden="true">
              <CatalogIcon name={item.icon} size={72} />
            </div>

            <div className="ci-copy">
              <h3>{tx.specs}</h3>
              <ul>
                {(item.specs || []).map((spec, index) => (
                  <li key={index}>{pick(spec, lang)}</li>
                ))}
              </ul>
            </div>
          </div>

          {!!(item.fields || []).length && (
            <section className="ci-section">
              <h3>{tx.options}</h3>
              <div className="ci-fields">{item.fields.map(renderField)}</div>
            </section>
          )}

          <section className="ci-section">
            <h3>{tx.attach}</h3>

            <div
              className={`ci-drop ${dragging ? 'over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
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
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>

            {!!files.length && (
              <ul className="ci-files">
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
        </div>

        {/* ------------------------------------------------------ bloc commande */}
        <aside className="ci-side">
          <div className="ci-order">
            <div className="ci-row">
              <label htmlFor="ci-qty">{tx.quantity}</label>
              <input
                id="ci-qty"
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>

            {price.kind === 'amount' && quantity > 1 && (
              <div className="ci-row">
                <span>{tx.unitPrice}</span>
                <strong className="soft">{price.unitText}</strong>
              </div>
            )}

            <div className="ci-row price">
              <span>{quantity > 1 && price.kind === 'amount' ? tx.total : tx.price}</span>
              <strong>{price.totalText}</strong>
            </div>

            <div className="ci-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  if (onAddToCart) onAddToCart(payload());
                  setBanner('cart');
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 4h2.2l2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L20.5 8H6" />
                  <circle cx="9.5" cy="20" r="1.2" />
                  <circle cx="17.5" cy="20" r="1.2" />
                </svg>
                {tx.cart}
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  if (onSaveDraft) onSaveDraft(payload());
                  setIsDraft(true);
                  setBanner('draft');
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4.5 4.5h11L19.5 8.5v11a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" />
                  <path d="M8 4.5v5h7M8 20.5v-5h8v5" />
                </svg>
                {isDraft ? tx.draftUpdate : tx.draft}
              </button>

              <button type="submit" className="btn primary">{tx.order}</button>
            </div>

            <p className="ci-hint">{tx.delivery}</p>
          </div>
        </aside>
      </form>
    </section>
  );
}