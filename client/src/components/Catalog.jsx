import { useMemo, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { CATEGORIES, ITEMS, itemsOf, pick, priceOf, toneOf } from '../catalog.js';
import CatalogIcon from './CatalogIcon.jsx';

/* Libellés locaux : le composant ne dépend d'aucune clé i18n particulière. */
const TXT = {
  fr: {
    home: 'Accueil',
    catalog: 'Catalogue de services',
    all: 'Toutes les catégories',
    search: 'Rechercher un article…',
    categories: 'Catégories',
    details: 'Voir le détail',
    empty: 'Aucun article ne correspond à cette recherche.',
    reset: 'Réinitialiser la recherche',
    results: (n) => `${n} article${n > 1 ? 's' : ''}`,
    grid: 'Affichage en grille',
    list: 'Affichage en liste',
    myRequests: 'Mes demandes',
    cart: 'Panier',
  },
  en: {
    home: 'Home',
    catalog: 'Service catalog',
    all: 'All categories',
    search: 'Search the catalog…',
    categories: 'Categories',
    details: 'View details',
    empty: 'No item matches this search.',
    reset: 'Clear the search',
    results: (n) => `${n} item${n > 1 ? 's' : ''}`,
    grid: 'Grid view',
    list: 'List view',
    myRequests: 'My requests',
    cart: 'Cart',
  },
  ar: {
    home: 'الرئيسية',
    catalog: 'كتالوج الخدمات',
    all: 'كل الفئات',
    search: 'ابحث في الكتالوج…',
    categories: 'الفئات',
    details: 'عرض التفاصيل',
    empty: 'لا يوجد عنصر مطابق لهذا البحث.',
    reset: 'مسح البحث',
    results: (n) => `${n} عنصر`,
    grid: 'عرض شبكي',
    list: 'عرض قائمة',
    myRequests: 'طلباتي',
    cart: 'السلة',
  },
};

export default function Catalog({
  onSelectItem,
  onBack,
  onViewRequests,
  pendingCount = 0,
  onViewCart,
  cartCount = 0,
}) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;

  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');

  const counts = useMemo(() => {
    const map = {};
    ITEMS.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return map;
  }, []);

  const visible = useMemo(() => {
    const base = itemsOf(category);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((item) => {
      const haystack = `${pick(item.label, lang)} ${pick(item.description, lang)}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [category, query, lang]);

  const currentCategory = CATEGORIES.find((c) => c.key === category);
  const currentLabel = currentCategory ? pick(currentCategory.label, lang) : tx.all;
  const accent = currentCategory ? currentCategory.tone : '#3d92b0';

  return (
    <section className="catalog" style={{ '--cat-accent': accent }}>
      <nav className="catalog-crumbs" aria-label={tx.catalog}>
        <button type="button" className="crumb-link" onClick={onBack}>
          {tx.home}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button
          type="button"
          className="crumb-link"
          onClick={() => {
            setCategory('');
            setQuery('');
          }}
        >
          {tx.catalog}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <span className="crumb-current">{currentLabel}</span>
      </nav>

      <header className="catalog-head">
        <div className="catalog-heading">
          <h2 className="catalog-title">{currentLabel}</h2>
          <p className="catalog-count">{tx.results(visible.length)}</p>
        </div>

        <div className="catalog-tools">
          {onViewRequests && (
            <button type="button" className="catalog-mine" onClick={onViewRequests}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14.2a.8.8 0 0 1-1.2.7L12 17l-5.3 2.9a.8.8 0 0 1-1.2-.7V5A1.5 1.5 0 0 1 7 3.5Z" />
                <path d="M9.2 8.6h5.6M9.2 11.8h3.4" />
              </svg>
              {tx.myRequests}
              {pendingCount > 0 && <em>{pendingCount}</em>}
            </button>
          )}

          {onViewCart && (
            <button
              type="button"
              className="catalog-mine cart-btn-top"
              onClick={onViewCart}
              title={tx.cart}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4h2.2l2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L20.5 8H6" />
                <circle cx="9.5" cy="20" r="1.2" />
                <circle cx="17.5" cy="20" r="1.2" />
              </svg>
              {tx.cart}
              {cartCount > 0 && <em>{cartCount}</em>}
            </button>
          )}

          <label className="catalog-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              placeholder={tx.search}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="view-toggle" role="group" aria-label={tx.catalog}>
            <button
              type="button"
              className={view === 'grid' ? 'on' : ''}
              title={tx.grid}
              aria-label={tx.grid}
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
              </svg>
            </button>
            <button
              type="button"
              className={view === 'list' ? 'on' : ''}
              title={tx.list}
              aria-label={tx.list}
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6.5h16M4 12h16M4 17.5h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="catalog-body">
        <aside className="catalog-side">
          <h3>{tx.categories}</h3>
          <ul>
            <li>
              <button
                type="button"
                className={!category ? 'on' : ''}
                style={{ '--row-tone': '#3d92b0' }}
                onClick={() => setCategory('')}
              >
                <span className="row-dot" aria-hidden="true" />
                <span className="row-label">{tx.all}</span>
                <em>{ITEMS.length}</em>
              </button>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.key}>
                <button
                  type="button"
                  className={category === cat.key ? 'on' : ''}
                  style={{ '--row-tone': cat.tone }}
                  onClick={() => setCategory(cat.key)}
                >
                  <span className="row-dot" aria-hidden="true" />
                  <span className="row-label">{pick(cat.label, lang)}</span>
                  <em>{counts[cat.key] || 0}</em>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="catalog-main">
          {visible.length === 0 ? (
            <div className="catalog-empty">
              <p>{tx.empty}</p>
              <button type="button" onClick={() => setQuery('')}>
                {tx.reset}
              </button>
            </div>
          ) : (
            <div className={`catalog-items ${view}`}>
              {visible.map((item) => {
                const cat = CATEGORIES.find((c) => c.key === item.category);
                return (
                  <article
                    key={item.key}
                    className="item"
                    style={{ '--cat-accent': toneOf(item.category) }}
                  >
                    <div className="item-top">
                      <span className="item-thumb" aria-hidden="true">
                        <CatalogIcon name={item.icon} size={24} />
                      </span>
                      <div className="item-text">
                        {cat && <p className="item-cat">{pick(cat.label, lang)}</p>}
                        <h4 className="item-name">{pick(item.label, lang)}</h4>
                        <p className="item-desc">{pick(item.description, lang)}</p>
                      </div>
                    </div>

                    <footer className="item-foot">
                      <button type="button" className="item-cta" onClick={() => onSelectItem(item)}>
                        {tx.details}
                        <span className="item-arrow" aria-hidden="true">→</span>
                      </button>
                      <span className="item-price">{priceOf(item, 1, lang).unitText}</span>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}