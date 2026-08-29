import { useMemo, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { pick, toneOf } from '../catalog.js';
import CatalogIcon from './CatalogIcon.jsx';

const TXT = {
  fr: {
    home: 'Accueil',
    catalog: 'Catalogue de services',
    crumb: 'Mes demandes',
    title: 'Mes demandes',
    submitted: 'Demandes soumises',
    drafts: 'Brouillons',
    search: 'Rechercher…',
    draftName: 'Nom du brouillon',
    itemName: 'Article',
    updated: 'Mis à jour',
    del: 'Supprimer',
    number: 'Numéro',
    opened: 'Créée le',
    state: 'État',
    open: 'Ouvrir',
    view: 'Vue',
    viewOpen: 'Demandes ouvertes',
    viewClosed: 'Demandes fermées',
    viewAll: 'Toutes les demandes',
    searchOpen: 'Rechercher dans les demandes ouvertes',
    searchClosed: 'Rechercher dans les demandes fermées',
    searchAll: 'Rechercher dans toutes les demandes',
    stateNew: 'Ouverte',
    stateClosed: 'Fermée',
    emptyDrafts: 'Aucun brouillon enregistré.',
    emptySubmitted: "Vous n'avez aucune demande.",
    noMatch: 'Aucun résultat pour cette recherche.',
    draftSuffix: (name) => `Brouillon — ${name}`,
    confirmDelete: 'Supprimer ce brouillon ?',
    now: "à l'instant",
    minutes: (n) => `il y a ${n} min`,
    hours: (n) => `il y a ${n} h`,
    days: (n) => `il y a ${n} j`,
  },
  en: {
    home: 'Home',
    catalog: 'Service catalog',
    crumb: 'My requests',
    title: 'My requests',
    submitted: 'Submitted requests',
    drafts: 'Drafts',
    search: 'Search…',
    draftName: 'Draft name',
    itemName: 'Item name',
    updated: 'Updated',
    del: 'Delete',
    number: 'Number',
    opened: 'Opened',
    state: 'State',
    open: 'Open',
    view: 'View',
    viewOpen: 'Open requests',
    viewClosed: 'Closed requests',
    viewAll: 'All requests',
    searchOpen: 'Search open requests',
    searchClosed: 'Search closed requests',
    searchAll: 'Search all requests',
    stateNew: 'Open',
    stateClosed: 'Closed',
    emptyDrafts: 'No draft saved yet.',
    emptySubmitted: 'You do not have any requests.',
    noMatch: 'Nothing matches this search.',
    draftSuffix: (name) => `${name} draft`,
    confirmDelete: 'Delete this draft?',
    now: 'just now',
    minutes: (n) => `${n} min ago`,
    hours: (n) => `${n} h ago`,
    days: (n) => `${n} d ago`,
  },
  ar: {
    home: 'الرئيسية',
    catalog: 'كتالوج الخدمات',
    crumb: 'طلباتي',
    title: 'طلباتي',
    submitted: 'الطلبات المُرسلة',
    drafts: 'المسودات',
    search: 'بحث…',
    draftName: 'اسم المسودة',
    itemName: 'العنصر',
    updated: 'آخر تحديث',
    del: 'حذف',
    number: 'الرقم',
    opened: 'تاريخ الإنشاء',
    state: 'الحالة',
    open: 'فتح',
    view: 'العرض',
    viewOpen: 'الطلبات المفتوحة',
    viewClosed: 'الطلبات المغلقة',
    viewAll: 'كل الطلبات',
    searchOpen: 'ابحث في الطلبات المفتوحة',
    searchClosed: 'ابحث في الطلبات المغلقة',
    searchAll: 'ابحث في كل الطلبات',
    stateNew: 'مفتوح',
    stateClosed: 'مغلق',
    emptyDrafts: 'لا توجد مسودات محفوظة.',
    emptySubmitted: 'ليس لديك أي طلبات.',
    noMatch: 'لا توجد نتائج مطابقة.',
    draftSuffix: (name) => `مسودة — ${name}`,
    confirmDelete: 'هل تريد حذف هذه المسودة؟',
    now: 'الآن',
    minutes: (n) => `قبل ${n} دقيقة`,
    hours: (n) => `قبل ${n} ساعة`,
    days: (n) => `قبل ${n} يوم`,
  },
};

function relative(timestamp, tx) {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return tx.now;
  if (seconds < 3600) return tx.minutes(Math.floor(seconds / 60));
  if (seconds < 86400) return tx.hours(Math.floor(seconds / 3600));
  return tx.days(Math.floor(seconds / 86400));
}

export default function MyRequests({
  tab = 'drafts',
  onTab,
  drafts = [],
  requests = [],
  onOpenDraft,
  onOpenRequest,
  onDeleteDraft,
  onBack,
  onBackToCatalog,
}) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('open');

  const source = useMemo(() => {
    if (tab === 'drafts') return drafts;
    if (view === 'all') return requests;
    return requests.filter((row) =>
      view === 'closed' ? row.state === 'closed' : row.state !== 'closed');
  }, [tab, drafts, requests, view]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((row) => {
      const label = pick(row.item?.label, lang);
      return `${label} ${row.number || ''}`.toLowerCase().includes(q);
    });
  }, [source, query, lang]);

  const empty = tab === 'drafts' ? tx.emptyDrafts : tx.emptySubmitted;
  const placeholder = tab === 'drafts'
    ? tx.search
    : { open: tx.searchOpen, closed: tx.searchClosed, all: tx.searchAll }[view];

  return (
    <section className="mr">
      <nav className="mr-crumbs" aria-label={tx.crumb}>
        <button type="button" className="crumb-link" onClick={onBack}>{tx.home}</button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <button
          type="button"
          className="crumb-link"
          onClick={onBackToCatalog || onBack}
        >
          {tx.catalog}
        </button>
        <span className="crumb-sep" aria-hidden="true">›</span>
        <span className="crumb-current">{tx.crumb}</span>
      </nav>

      <div className="mr-panel">
        <header className="mr-head">
          <h2>{tx.title}</h2>
        </header>

        <div className="mr-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'submitted'}
            className={tab === 'submitted' ? 'on' : ''}
            onClick={() => onTab('submitted')}
          >
            {tx.submitted}
            {!!requests.length && <em>{requests.length}</em>}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'drafts'}
            className={tab === 'drafts' ? 'on' : ''}
            onClick={() => onTab('drafts')}
          >
            {tx.drafts}
            {!!drafts.length && <em>{drafts.length}</em>}
          </button>
        </div>

        <div className="mr-toolbar">
          {tab === 'submitted' && (
            <label className="mr-view">
              <span>{tx.view}</span>
              <select value={view} onChange={(event) => setView(event.target.value)}>
                <option value="open">{tx.viewOpen}</option>
                <option value="closed">{tx.viewClosed}</option>
                <option value="all">{tx.viewAll}</option>
              </select>
            </label>
          )}

          <label className="mr-search">
            <input
              type="search"
              value={query}
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
            />
            <span aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" strokeLinecap="round" />
              </svg>
            </span>
          </label>
        </div>

        {rows.length === 0 ? (
          <p className="mr-empty">{source.length === 0 ? empty : tx.noMatch}</p>
        ) : (
          <div className="mr-table-wrap">
            <table className="mr-table">
              <thead>
                {tab === 'drafts' ? (
                  <tr>
                    <th>{tx.draftName}</th>
                    <th>{tx.itemName}</th>
                    <th>{tx.updated}</th>
                    <th className="right">{tx.del}</th>
                  </tr>
                ) : (
                  <tr>
                    <th>{tx.number}</th>
                    <th>{tx.itemName}</th>
                    <th>{tx.opened}</th>
                    <th className="right">{tx.state}</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {rows.map((row) => {
                  const label = pick(row.item?.label, lang);
                  const tone = toneOf(row.item?.category);

                  return (
                    <tr
                      key={row.id}
                      className={tab === 'submitted' && onOpenRequest ? 'clickable' : ''}
                      onClick={
                        tab === 'submitted' && onOpenRequest
                          ? (event) => {
                              if (event.target.closest('button')) return;
                              onOpenRequest(row);
                            }
                          : undefined
                      }
                    >
                      <td>
                        {tab === 'drafts' ? (
                          <button type="button" className="mr-link" onClick={() => onOpenDraft(row)}>
                            {tx.draftSuffix(label)}
                          </button>
                        ) : onOpenRequest ? (
                          <button
                            type="button"
                            className="mr-link mr-number"
                            onClick={() => onOpenRequest(row)}
                          >
                            {row.number}
                          </button>
                        ) : (
                          <span className="mr-number">{row.number}</span>
                        )}
                      </td>

                      <td>
                        <span className="mr-item">
                          <span className="mr-icon" style={{ '--cat-accent': tone }} aria-hidden="true">
                            <CatalogIcon name={row.item?.icon} size={16} />
                          </span>
                          {label}
                        </span>
                      </td>

                      <td className="mr-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <circle cx="12" cy="12" r="8.5" />
                          <path d="M12 7.5V12l3 1.8" strokeLinecap="round" />
                        </svg>
                        {relative(row.updated || row.opened, tx)}
                      </td>

                      <td className="right">
                        {tab === 'drafts' ? (
                          <button
                            type="button"
                            className="mr-del"
                            title={tx.del}
                            aria-label={`${tx.del} — ${label}`}
                            onClick={() => onDeleteDraft(row.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                                 strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6.5h16M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7" />
                              <path d="M6.5 6.5 7.4 19a1.2 1.2 0 0 0 1.2 1.1h6.8a1.2 1.2 0 0 0 1.2-1.1l.9-12.5" />
                              <path d="M10.5 10v6M13.5 10v6" />
                            </svg>
                          </button>
                        ) : (
                          <span className={`mr-state ${row.state === 'closed' ? 'closed' : ''}`}>
                            {row.state === 'closed' ? tx.stateClosed : tx.stateNew}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}