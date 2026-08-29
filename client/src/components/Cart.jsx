import { useI18n } from '../i18n.jsx';
import { CATEGORIES, cartTotal, pick, priceOf, toneOf } from '../catalog.js';
import CatalogIcon from './CatalogIcon.jsx';

const TXT = {
  fr: {
    home: 'Accueil',
    catalog: 'Catalogue de services',
    crumb: 'Panier',
    title: 'Mon panier',
    count: (n) => `${n} article${n > 1 ? 's' : ''}`,
    empty: 'Votre panier est vide.',
    browse: 'Parcourir le catalogue',
    quantity: 'Quantité',
    price: 'Prix',
    quoteLines: (n) => `+ ${n} article${n > 1 ? 's' : ''} sur devis`,
    recurring: 'dont des montants récurrents',
    remove: 'Retirer',
    summary: 'Récapitulatif',
    lines: 'Lignes',
    units: 'Unités',
    total: 'Total',
    quote: 'Sur devis',
    checkout: 'Commander',
    keepShopping: 'Continuer mes achats',
    note: 'Les prix sont indicatifs. Le montant final est confirmé après validation.',
  },
  en: {
    home: 'Home',
    catalog: 'Service catalog',
    crumb: 'Cart',
    title: 'My cart',
    count: (n) => `${n} item${n > 1 ? 's' : ''}`,
    empty: 'Your cart is empty.',
    browse: 'Browse the catalog',
    quantity: 'Quantity',
    price: 'Price',
    quoteLines: (n) => `+ ${n} quoted item${n > 1 ? 's' : ''}`,
    recurring: 'includes recurring charges',
    remove: 'Remove',
    summary: 'Summary',
    lines: 'Lines',
    units: 'Units',
    total: 'Total',
    quote: 'Quoted separately',
    checkout: 'Order now',
    keepShopping: 'Continue shopping',
    note: 'Prices are indicative. The final amount is confirmed after approval.',
  },
  ar: {
    home: 'الرئيسية',
    catalog: 'كتالوج الخدمات',
    crumb: 'السلة',
    title: 'سلتي',
    count: (n) => `${n} عنصر`,
    empty: 'سلتك فارغة.',
    browse: 'تصفح الكتالوج',
    quantity: 'الكمية',
    price: 'السعر',
    quoteLines: (n) => `+ ${n} عنصر حسب عرض السعر`,
    recurring: 'يشمل مبالغ متكررة',
    remove: 'إزالة',
    summary: 'الملخص',
    lines: 'السطور',
    units: 'الوحدات',
    total: 'الإجمالي',
    quote: 'حسب عرض السعر',
    checkout: 'اطلب الآن',
    keepShopping: 'متابعة التسوق',
    note: 'الأسعار تقديرية ويتم تأكيد المبلغ النهائي بعد الموافقة.',
  },
};

export default function Cart({
  lines = [],
  onQuantity,
  onRemove,
  onCheckout,
  onBack,
  onBackToCatalog,
}) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;

  const units = lines.reduce((sum, line) => sum + (line.quantity || 1), 0);
  const totals = cartTotal(lines, lang);

  return (
    <section className="cart">
      <nav className="cart-crumbs" aria-label={tx.crumb}>
        <button type="button" className="crumb-link" onClick={onBack}>{tx.home}</button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button type="button" className="crumb-link" onClick={onBackToCatalog || onBack}>
          {tx.catalog}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <span className="crumb-current">{tx.crumb}</span>
      </nav>

      {lines.length === 0 ? (
        <div className="cart-panel">
          <div className="cart-empty">
            <span className="cart-empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4h2.2l2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L20.5 8H6" />
                <circle cx="9.5" cy="20" r="1.2" />
                <circle cx="17.5" cy="20" r="1.2" />
              </svg>
            </span>
            <p>{tx.empty}</p>
            <button type="button" className="cart-browse" onClick={onBackToCatalog || onBack}>
              {tx.browse}
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-panel">
            <header className="cart-head">
              <h2>{tx.title}</h2>
              <p>{tx.count(lines.length)}</p>
            </header>

            <ul className="cart-lines">
              {lines.map((line) => {
                const category = CATEGORIES.find((c) => c.key === line.item.category);
                return (
                  <li
                    key={line.id}
                    className="cart-line"
                    style={{ '--cat-accent': toneOf(line.item.category) }}
                  >
                    <span className="cart-thumb" aria-hidden="true">
                      <CatalogIcon name={line.item.icon} size={22} />
                    </span>

                    <div className="cart-text">
                      {category && <p className="cart-cat">{pick(category.label, lang)}</p>}
                      <h3>{pick(line.item.label, lang)}</h3>
                      <p className="cart-price">
                        {priceOf(line.item, 1, lang).unitText}
                      </p>
                    </div>

                    <label className="cart-qty">
                      <span>{tx.quantity}</span>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={line.quantity}
                        onChange={(event) =>
                          onQuantity(line.id, Math.max(1, Number(event.target.value) || 1))
                        }
                      />
                    </label>

                    <span className="cart-line-total">
                      {priceOf(line.item, line.quantity, lang).totalText}
                    </span>

                    <button
                      type="button"
                      className="cart-remove"
                      title={tx.remove}
                      aria-label={`${tx.remove} — ${pick(line.item.label, lang)}`}
                      onClick={() => onRemove(line.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                           strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6.5h16M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7" />
                        <path d="M6.5 6.5 7.4 19a1.2 1.2 0 0 0 1.2 1.1h6.8a1.2 1.2 0 0 0 1.2-1.1l.9-12.5" />
                        <path d="M10.5 10v6M13.5 10v6" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="cart-side">
            <div className="cart-summary">
              <h3>{tx.summary}</h3>

              <div className="cart-row">
                <span>{tx.lines}</span>
                <strong>{lines.length}</strong>
              </div>
              <div className="cart-row">
                <span>{tx.units}</span>
                <strong>{units}</strong>
              </div>
              <div className="cart-row total">
                <span>{tx.total}</span>
                <strong>{totals.text}</strong>
              </div>

              {totals.quotes > 0 && (
                <p className="cart-quotes">{tx.quoteLines(totals.quotes)}</p>
              )}
              {totals.recurring && <p className="cart-quotes">{tx.recurring}</p>}

              <button type="button" className="cart-btn primary" onClick={onCheckout}>
                {tx.checkout}
              </button>
              <button
                type="button"
                className="cart-btn ghost"
                onClick={onBackToCatalog || onBack}
              >
                {tx.keepShopping}
              </button>

              <p className="cart-note">{tx.note}</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}