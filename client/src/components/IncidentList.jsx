import { useI18n } from '../i18n.jsx';
import { PRIORITIES, STATES } from '../incidents.js';

const TXT = {
  fr: {
    title: 'Mes incidents',
    sub: 'Incidents ouverts depuis ce portail, tels que ServiceNow les connaît.',
    empty: 'Aucun incident pour le moment.',
    create: 'Signaler un incident',
    back: 'Accueil',
    number: 'Numéro',
    summary: 'Description',
    state: 'État',
    priority: 'Priorité',
    opened: 'Ouvert le',
    locale: 'fr-CA',
  },
  en: {
    title: 'My incidents',
    sub: 'Incidents raised from this portal, as ServiceNow knows them.',
    empty: 'No incident yet.',
    create: 'Report an incident',
    back: 'Home',
    number: 'Number',
    summary: 'Description',
    state: 'State',
    priority: 'Priority',
    opened: 'Opened',
    locale: 'en-CA',
  },
  ar: {
    title: 'حوادثي',
    sub: 'الحوادث المفتوحة من هذه البوابة.',
    empty: 'لا يوجد حادث حتى الآن.',
    create: 'الإبلاغ عن حادث',
    back: 'الرئيسية',
    number: 'الرقم',
    summary: 'الوصف',
    state: 'الحالة',
    priority: 'الأولوية',
    opened: 'تاريخ الفتح',
    locale: 'ar',
  },
};

function labelOf(dict, lang) {
  if (!dict) return '';
  return dict[lang] || dict.fr || '';
}

export default function IncidentList({ incidents = [], onOpen, onCreate, onBack }) {
  const { lang } = useI18n();
  const t = TXT[lang] || TXT.fr;

  const formatDate = (ms) => {
    if (!ms) return '—';
    try {
      return new Date(ms).toLocaleString(t.locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <section className="record">
      <header className="record-head">
        <h1>{t.title}</h1>
        <p className="portal-sub">{t.sub}</p>
      </header>

      <div className="record-actions">
        {onCreate && (
          <button type="button" className="btn" onClick={onCreate}>
            {t.create}
          </button>
        )}
        {onBack && (
          <button type="button" className="btn" onClick={onBack}>
            {t.back}
          </button>
        )}
      </div>

      {incidents.length === 0 ? (
        <p className="placeholder">{t.empty}</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t.number}</th>
                <th>{t.summary}</th>
                <th>{t.state}</th>
                <th>{t.priority}</th>
                <th>{t.opened}</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => {
                const state = STATES[incident.state] || STATES.new;
                const priority = PRIORITIES[incident.priority] || null;

                return (
                  <tr
                    key={incident.id || incident.sys_id || incident.number}
                    className="row-clickable"
                    tabIndex={0}
                    onClick={() => onOpen && onOpen(incident)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && onOpen) onOpen(incident);
                    }}
                  >
                    <td className="mono">{incident.number || '—'}</td>
                    <td>{incident.short_description || <span className="muted">—</span>}</td>
                    <td>
                      <span className="badge" style={{ color: state.tone }}>
                        {labelOf(state.label, lang)}
                      </span>
                    </td>
                    <td>
                      {priority ? (
                        <span className="badge" style={{ color: priority.tone }}>
                          {labelOf(priority.label, lang)}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="mono">{formatDate(incident.opened)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}