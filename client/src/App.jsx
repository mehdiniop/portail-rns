import { useEffect, useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import Portal from './components/Portal.jsx';
import Catalog from './components/Catalog.jsx';
import CatalogItem from './components/CatalogItem.jsx';
import MyRequests from './components/MyRequests.jsx';
import Cart from './components/Cart.jsx';
import RequestDetail from './components/RequestDetail.jsx';
import IncidentForm from './components/IncidentForm.jsx';
import IncidentList from './components/IncidentList.jsx';
import IncidentDetail from './components/IncidentDetail.jsx';
import RecordForm from './components/RecordForm.jsx';
import { findModule } from './modules.js';
import { pick } from './catalog.js';
import { I18nProvider, useI18n } from './i18n.jsx';
import {
  pushIncident,
  pushRecord,
  patchRecord,
  fetchJournal,
  fetchIncidents,
} from './servicenow.js';

let counter = 1042;

/* Titres des formulaires directs (Incident / Change / Problem).
   Local, donc indépendant des clés présentes dans i18n.jsx. */
const MODULE_TXT = {
  incident: {
    fr: { title: 'Signaler un incident', sub: 'Quelque chose ne fonctionne pas comme prévu.' },
    en: { title: 'Report an incident', sub: 'Something is not working as expected.' },
    ar: { title: 'الإبلاغ عن حادث', sub: 'هناك شيء لا يعمل كما هو متوقع.' },
  },
  change: {
    fr: { title: 'Demander un changement', sub: 'Une modification planifiée sur un service ou une infrastructure.' },
    en: { title: 'Request a change', sub: 'A planned modification to a service or infrastructure.' },
    ar: { title: 'طلب تغيير', sub: 'تعديل مخطط على خدمة أو بنية تحتية.' },
  },
  problem: {
    fr: { title: 'Déclarer un problème', sub: 'Une cause récurrente derrière plusieurs incidents.' },
    en: { title: 'Raise a problem', sub: 'A recurring root cause behind several incidents.' },
    ar: { title: 'الإبلاغ عن مشكلة', sub: 'سبب جذري متكرر وراء عدة حوادث.' },
  },
  request: {
    fr: { title: 'Nouvelle demande', sub: 'Choisis un article du catalogue.' },
    en: { title: 'New request', sub: 'Pick an item from the catalog.' },
    ar: { title: 'طلب جديد', sub: 'اختر عنصرًا من الكتالوج.' },
  },
};

/* Codes d'etat ServiceNow -> cles du portail (voir STATES dans incidents.js). */
const SN_STATE = {
  1: 'new',
  2: 'in_progress',
  3: 'on_hold',
  6: 'resolved',
  7: 'closed',
  8: 'canceled',
};

/* Horodatage ServiceNow (UTC, "2026-08-29 12:36:13") -> millisecondes. */
function snTime(value) {
  if (!value) return Date.now();
  const ms = new Date(`${String(value).replace(' ', 'T')}Z`).getTime();
  return Number.isNaN(ms) ? Date.now() : ms;
}

/* Enregistrement ServiceNow -> incident tel que l'attendent les composants. */
function fromServiceNow(row) {
  return {
    id: row.sys_id,
    sys_id: row.sys_id,
    number: row.number,
    short_description: row.short_description || '',
    description: row.description || '',
    category: row.category || '',
    subcategory: '',
    impact: String(row.impact || '3'),
    urgency: String(row.urgency || '3'),
    priority: Number(row.priority) || 4,
    state: SN_STATE[Number(row.state)] || 'new',
    opened: snTime(row.opened_at),
    location: '',
    phone: '',
    attachments: [],
    activity: [],
    respondedAt: null,
    resolvedAt: null,
  };
}

/* Ecran de choix affiche quand on entre dans le module Incident. */
const CHOICE_TXT = {
  fr: {
    eyebrow: 'Support',
    title: 'Incidents',
    sub: 'Que souhaites-tu faire ?',
    list: 'Voir mes incidents',
    listSub: 'Consulter les incidents déjà signalés et leur avancement.',
    create: 'Signaler un incident',
    createSub: 'Déclarer un dysfonctionnement qui te bloque.',
    back: 'Retour à l’accueil',
  },
  en: {
    eyebrow: 'Support',
    title: 'Incidents',
    sub: 'What would you like to do?',
    list: 'View my incidents',
    listSub: 'Check incidents already reported and their progress.',
    create: 'Report an incident',
    createSub: 'Raise something that is not working.',
    back: 'Back to home',
  },
  ar: {
    eyebrow: 'الدعم',
    title: 'الحوادث',
    sub: 'ماذا تريد أن تفعل؟',
    list: 'عرض حوادثي',
    listSub: 'الاطلاع على الحوادث المبلغ عنها وحالتها.',
    create: 'الإبلاغ عن حادث',
    createSub: 'الإبلاغ عن عطل يعيق عملك.',
    back: 'العودة إلى الرئيسية',
  },
};

/* Feuille de style de l'ecran de choix, portee par le composant lui-meme :
   pas de modification d'index.css, et les etats de survol restent possibles. */
const CHOICE_CSS = `
.rns-choice { max-width: 880px; margin: 0 auto; padding: 3rem 1.5rem 3.5rem; }
.rns-choice-head { text-align: center; margin-bottom: 2.4rem; }
.rns-choice-eyebrow {
  display: inline-block; font-size: .7rem; letter-spacing: .16em;
  text-transform: uppercase; opacity: .45; margin-bottom: .7rem;
}
.rns-choice-head h1 { margin: 0 0 .55rem; font-size: clamp(1.7rem, 3.2vw, 2.2rem); line-height: 1.15; }
.rns-choice-head p { margin: 0; opacity: .6; font-size: .98rem; }
.rns-choice-grid {
  display: grid; gap: 1.1rem;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
}
.rns-card {
  position: relative; display: flex; gap: 1.05rem; align-items: flex-start;
  text-align: start; padding: 1.7rem 1.5rem; border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, .2);
  background: linear-gradient(158deg, rgba(148, 163, 184, .085), rgba(148, 163, 184, .025));
  color: inherit; font: inherit; cursor: pointer;
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease, background .18s ease;
}
.rns-card:hover, .rns-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 16px 34px -20px var(--accent);
  background: linear-gradient(158deg, rgba(148, 163, 184, .14), rgba(148, 163, 184, .04));
  outline: none;
}
.rns-card-icon {
  flex: 0 0 auto; width: 46px; height: 46px; border-radius: 13px;
  display: grid; place-items: center;
  color: var(--accent); background: var(--accent-soft);
}
.rns-card-body { display: flex; flex-direction: column; gap: .38rem; padding-inline-end: 1.4rem; }
.rns-card-title { display: flex; align-items: center; gap: .55rem; font-size: 1.04rem; font-weight: 600; }
.rns-card-sub { opacity: .58; font-size: .89rem; line-height: 1.5; }
.rns-card-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 22px; padding: 0 7px; border-radius: 999px;
  font-size: .74rem; font-weight: 600; font-style: normal;
  color: var(--accent); background: var(--accent-soft);
}
.rns-card-chevron {
  position: absolute; inset-inline-end: 1.15rem; top: 1.85rem;
  opacity: .3; transition: transform .18s ease, opacity .18s ease;
}
.rns-card:hover .rns-card-chevron { opacity: .75; transform: translateX(3px); }
[dir="rtl"] .rns-card-chevron { transform: scaleX(-1); }
[dir="rtl"] .rns-card:hover .rns-card-chevron { transform: scaleX(-1) translateX(3px); }
.rns-choice-back {
  display: block; margin: 2.3rem auto 0; padding: .4rem .2rem;
  background: none; border: 0; color: inherit; font: inherit; opacity: .5;
  cursor: pointer; text-decoration: underline; text-underline-offset: 4px;
  transition: opacity .16s ease;
}
.rns-choice-back:hover { opacity: .85; }
`;

const ICON_LIST = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6h12M8 12h12M8 18h12" />
    <circle cx="3.6" cy="6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="3.6" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="3.6" cy="18" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const ICON_ALERT = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.3 3.6 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4.5M12 17.2h.01" />
  </svg>
);

const CHEVRON = (
  <svg className="rns-card-chevron" width="17" height="17" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const ACCENT_LIST = { '--accent': '#3d92b0', '--accent-soft': 'rgba(61, 146, 176, .15)' };
const ACCENT_NEW = { '--accent': '#d08a4a', '--accent-soft': 'rgba(208, 138, 74, .15)' };

function moduleText(key, lang) {
  const entry = MODULE_TXT[key] || MODULE_TXT.request;
  return entry[lang] || entry.fr;
}

function Shell() {
  const { t, lang } = useI18n();
  const [session, setSession] = useState(null);
  const [moduleKey, setModuleKey] = useState(null);
  const [item, setItem] = useState(null);
  const [created, setCreated] = useState(null);

  /* Écran « Mes demandes » */
  const [screen, setScreen] = useState(null); // null | 'requests' | 'cart'
  const [tab, setTab] = useState('drafts');
  const [drafts, setDrafts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editingDraft, setEditingDraft] = useState(null);
  const [cart, setCart] = useState([]);
  const [request, setRequest] = useState(null);

  /* ---------------------------------------------------------- incidents */
  const [incidents, setIncidents] = useState([]);
  const [incident, setIncident] = useState(null);
  const [incidentMode, setIncidentMode] = useState(null); // null = ecran de choix, 'create' = formulaire

  const module = findModule(moduleKey);

  function reset() {
    setIncident(null);
    setIncidentMode(null);
    setRequest(null);
    setModuleKey(null);
    setItem(null);
    setCreated(null);
    setScreen(null);
    setEditingDraft(null);
  }

  function openRequests(nextTab) {
    setRequest(null);
    setTab(nextTab);
    setItem(null);
    setCreated(null);
    setEditingDraft(null);
    setScreen('requests');
  }

  function openCart() {
    setItem(null);
    setCreated(null);
    setEditingDraft(null);
    setScreen('cart');
  }

  /* ------------------------------------------------------ incidents : flux */

  /* La liste fait foi cote ServiceNow : on la relit plutot que de la garder en memoire. */
  async function loadIncidents() {
    try {
      const { incidents: rows } = await fetchIncidents();
      const remote = (rows || []).map(fromServiceNow);

      setIncidents((prev) => {
        const known = new Map(prev.map((inc) => [inc.sys_id || inc.id, inc]));
        return remote.map((inc) => {
          const local = known.get(inc.sys_id);
          return local ? { ...inc, activity: local.activity } : inc;
        });
      });

      // L'incident affiche suit les changements faits dans ServiceNow (etat, priorite).
      setIncident((prev) => {
        if (!prev) return prev;
        const fresh = remote.find((inc) => inc.sys_id === (prev.sys_id || prev.id));
        return fresh ? { ...fresh, activity: prev.activity } : prev;
      });
    } catch (error) {
      console.warn('Liste ServiceNow illisible :', error.message);
    }
  }

  useEffect(() => {
    if (session) loadIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  /* Rafraichissement automatique : ServiceNow ne previent pas, on va voir. */
  const openSysId = screen === 'incident' ? incident?.sys_id : null;

  useEffect(() => {
    if (!session) return undefined;
    if (screen !== 'incident' && screen !== 'incidents') return undefined;

    const tick = () => {
      loadIncidents();
      if (openSysId) syncIncident(openSysId);
    };

    const timer = setInterval(tick, 15000);
    const onFocus = () => tick();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, screen, openSysId]);

  function openIncidents() {
    setIncident(null);
    setItem(null);
    setCreated(null);
    setModuleKey(null);
    setIncidentMode(null);
    setScreen('incidents');
    loadIncidents();
  }

  function openIncidentForm() {
    setIncident(null);
    setScreen(null);
    setModuleKey('incident');
    setIncidentMode('create');
  }

  /* Convertit une entree du journal ServiceNow en element du fil d'activite. */
  function journalEntry(row, userName) {
    return {
      author: row.sys_created_by === userName ? 'user' : 'system',
      at: new Date(`${row.sys_created_on.replace(' ', 'T')}Z`).getTime(),
      text: row.element === 'work_notes' ? `[Note interne] ${row.value}` : row.value,
    };
  }

  /* Recharge le fil depuis ServiceNow : il fait foi sur les commentaires. */
  async function syncIncident(sysId) {
    if (!sysId) return;

    try {
      const { entries } = await fetchJournal(sysId);
      const remote = (entries || []).map((row) => journalEntry(row, session?.user));

      const merge = (inc) => {
        if (!inc || (inc.sys_id || inc.id) !== sysId) return inc;
        const creation = (inc.activity || []).filter(
          (a) => a.author === 'system' && /ServiceNow \(/.test(a.text || ''));
        return { ...inc, activity: [...creation, ...remote].sort((a, b) => a.at - b.at) };
      };

      setIncidents((prev) => prev.map(merge));
      setIncident((prev) => merge(prev));
    } catch (error) {
      console.warn('Journal ServiceNow illisible :', error.message);
    }
  }

  function openIncident(record) {
    setIncident(record);
    setScreen('incident');
    syncIncident(record.sys_id);
  }

  /* Crée l'incident dans ServiceNow via le proxy, puis l'affiche.
     Le numéro et le sys_id viennent de l'instance, plus d'un compteur local. */
  async function createIncident(payload) {
    try {
      const result = await pushIncident({
        short_description: payload.short_description,
        description: payload.description || '',
        category: payload.category,
        impact: payload.impact,
        urgency: payload.urgency,
      });

      const record = {
        ...payload,
        id: result.sys_id,
        number: result.number,
        sys_id: result.sys_id,
        state: 'new',
        opened: Date.now(),
        respondedAt: null,
        resolvedAt: null,
        activity: [
          { author: 'system', at: Date.now(), text: `Incident créé dans ServiceNow (${result.number}).` },
        ],
      };

      setIncidents((prev) => [record, ...prev]);
      setModuleKey(null);
      setIncident(record);
      setScreen('incident');
    } catch (error) {
      alert('Echec de la creation dans ServiceNow : ' + error.message);
    }
  }

  /* Applique une mise à jour à un incident, dans la liste et dans la vue ouverte. */
  function patchIncident(id, patch, note) {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        const next = { ...inc, ...patch };
        if (note) {
          next.activity = [...(inc.activity || []), { author: 'system', at: Date.now(), text: note }];
        }
        return next;
      }));

    setIncident((prev) => {
      if (!prev || prev.id !== id) return prev;
      const next = { ...prev, ...patch };
      if (note) {
        next.activity = [...(prev.activity || []), { author: 'system', at: Date.now(), text: note }];
      }
      return next;
    });
  }

  function resolveIncident(id) {
    patchIncident(
      id,
      { state: 'resolved', resolvedAt: Date.now(), respondedAt: Date.now() },
      'Incident marqué comme résolu.',
    );
  }

  function reopenIncident(id) {
    patchIncident(id, { state: 'in_progress', resolvedAt: null }, 'Incident rouvert.');
  }

  function cancelIncident(id) {
    patchIncident(id, { state: 'canceled', resolvedAt: Date.now() }, 'Incident annulé.');
  }

  /* Affichage immediat, puis ecriture du commentaire dans ServiceNow. */
  async function commentIncident(id, text) {
    const entry = { author: 'user', at: Date.now(), text };

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, activity: [...(inc.activity || []), entry] } : inc));
    setIncident((prev) =>
      prev && prev.id === id ? { ...prev, activity: [...(prev.activity || []), entry] } : prev);

    const target = incidents.find((inc) => inc.id === id) || incident;
    const sysId = target?.sys_id;
    if (!sysId) return;

    try {
      await patchRecord('incident', sysId, { comments: text });
      await syncIncident(sysId);
    } catch (error) {
      alert('Commentaire non enregistre dans ServiceNow : ' + error.message);
    }
  }

  function openRequest(record) {
    setRequest(record);
    setScreen('request');
  }

  function cancelRequest(id) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, state: 'closed' } : r)));
    setRequest((prev) => (prev && prev.id === id ? { ...prev, state: 'closed' } : prev));
  }

  function backToCatalog() {
    setRequest(null);
    setScreen(null);
    setModuleKey('request');
    setItem(null);
    setEditingDraft(null);
  }

  /* ------------------------------------------------------------- panier */

  function addToCart(payload) {
    setCart((prev) => {
      const index = prev.findIndex((line) => line.item.key === payload.item.key);
      if (index === -1) {
        return [...prev, { ...payload, id: `${payload.item.key}-${Date.now()}` }];
      }
      const next = [...prev];
      next[index] = {
        ...next[index],
        values: payload.values,
        quantity: next[index].quantity + (payload.quantity || 1),
      };
      return next;
    });
  }

  function setLineQuantity(id, quantity) {
    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, quantity } : line)));
  }

  function removeLine(id) {
    setCart((prev) => prev.filter((line) => line.id !== id));
  }

  function checkout() {
    if (!cart.length) return;

    const numbers = [];
    const records = cart.map((line) => {
      counter += 1;
      const number = `REQ00${counter}`;
      numbers.push(number);
      return {
        id: number,
        number,
        item: line.item,
        summary: line.values?.justification || line.values?.short_description || '',
        values: line.values || {},
        attachments: line.attachments || [],
        quantity: line.quantity,
        state: 'open',
        opened: Date.now(),
      };
    });

    setRequests((prev) => [...records.reverse(), ...prev]);
    setCart([]);
    setScreen(null);
    setCreated({
      number: numbers[0],
      summary: numbers.length > 1
        ? `${numbers.length} ${lang === 'en' ? 'items ordered' : lang === 'ar' ? 'عناصر مطلوبة' : 'articles commandés'}`
        : records[0].summary,
    });
  }

  /* Crée ou met à jour un brouillon (un seul par article). */
  function saveDraft(payload) {
    setDrafts((prev) => {
      const id = payload.id || `${payload.item.key}-${Date.now()}`;
      const record = { ...payload, id, updated: Date.now() };
      const index = prev.findIndex((d) => d.id === id || d.item.key === payload.item.key);
      if (index === -1) return [record, ...prev];
      const next = [...prev];
      next[index] = { ...next[index], ...record, id: next[index].id };
      return next;
    });
  }

  function deleteDraft(id) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  function openDraft(draft) {
    setModuleKey('request');
    setEditingDraft(draft);
    setItem(draft.item);
    setScreen(null);
  }

  /* Change et Problem partent dans ServiceNow ; le catalogue reste local. */
  async function handleSubmit(values, label, submittedItem) {
    const summary = values.short_description || values.justification || label || '';

    try {
      let record;

      if (module?.key === 'change' || module?.key === 'problem') {
        record = await pushRecord(module.key === 'change' ? 'change_request' : 'problem', {
          short_description: summary,
          description: values.description || '',
        });
      } else {
        counter += 1;
        record = { number: `${module.prefix}00${counter}`, sys_id: null };
      }

      setRequests((prev) => [
        {
          id: record.sys_id || record.number,
          number: record.number,
          sys_id: record.sys_id || null,
          item: submittedItem || null,
          summary,
          values,
          attachments: values.attachments || [],
          quantity: values.quantity || 1,
          state: 'open',
          opened: Date.now(),
        },
        ...prev,
      ]);

      // Une demande soumise n'est plus un brouillon.
      if (submittedItem) {
        setDrafts((prev) => prev.filter((d) => d.item.key !== submittedItem.key));
      }

      setEditingDraft(null);
      setCreated({ number: record.number, summary });
    } catch (error) {
      alert('Echec de la creation dans ServiceNow : ' + error.message);
    }
  }

  if (!session) {
    return <LoginScreen onLogin={setSession} />;
  }

  let view;

  if (created) {
    view = (
      <div className="app">
        <section className="record">
          <div className="created">
            <span className="created-badge">{t('created.badge')}</span>
            <h1 className="mono">{created.number}</h1>
            <p className="portal-sub">{created.summary}</p>
            <div className="record-actions">
              <button type="button" className="btn" onClick={() => openRequests('submitted')}>
                {lang === 'en' ? 'My requests' : lang === 'ar' ? 'طلباتي' : 'Mes demandes'}
              </button>
              <button type="button" className="btn" onClick={reset}>
                {t('created.back')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  } else if (screen === 'cart') {
    view = (
      <div className="app">
        <Cart
          lines={cart}
          onQuantity={setLineQuantity}
          onRemove={removeLine}
          onCheckout={checkout}
          onBack={reset}
          onBackToCatalog={backToCatalog}
        />
      </div>
    );
  } else if (screen === 'incidents') {
    view = (
      <div className="app">
        <IncidentList
          incidents={incidents}
          onOpen={openIncident}
          onCreate={openIncidentForm}
          onBack={reset}
        />
      </div>
    );
  } else if (screen === 'incident' && incident) {
    view = (
      <div className="app">
        <IncidentDetail
          incident={incident}
          onBack={reset}
          onBackToIncidents={openIncidents}
          onResolve={resolveIncident}
          onReopen={reopenIncident}
          onCancel={cancelIncident}
          onComment={commentIncident}
        />
      </div>
    );
  } else if (screen === 'request' && request) {
    view = (
      <div className="app">
        <RequestDetail
          request={request}
          onBack={reset}
          onBackToCatalog={backToCatalog}
          onBackToRequests={() => openRequests('submitted')}
          onCancel={cancelRequest}
        />
      </div>
    );
  } else if (screen === 'requests') {
    view = (
      <div className="app">
        <MyRequests
          tab={tab}
          onTab={setTab}
          drafts={drafts}
          requests={requests}
          onOpenDraft={openDraft}
          onOpenRequest={openRequest}
          onDeleteDraft={deleteDraft}
          onBack={reset}
          onBackToCatalog={backToCatalog}
        />
      </div>
    );
  } else if (item) {
    /* Article du catalogue → page détail façon ServiceNow */
    view = (
      <div className="app">
        <CatalogItem
          item={item}
          draft={editingDraft}
          onBack={reset}
          onBackToCatalog={() => {
            setItem(null);
            setEditingDraft(null);
          }}
          onSaveDraft={saveDraft}
          onAddToCart={addToCart}
          onSubmit={(values) => handleSubmit(values, pick(item.label, lang), item)}
          onViewDrafts={() => openRequests('drafts')}
          onViewCart={openCart}
        />
      </div>
    );
  } else if (module?.key === 'request') {
    /* Tuile « Request » → catalogue de services */
    view = (
      <div className="app">
        <Catalog
          onSelectItem={setItem}
          onBack={reset}
          onViewRequests={() => openRequests(drafts.length ? 'drafts' : 'submitted')}
          pendingCount={drafts.length + requests.length}
          onViewCart={openCart}
          cartCount={cart.reduce((sum, line) => sum + (line.quantity || 1), 0)}
        />
      </div>
    );
  } else if (module?.key === 'incident' && incidentMode !== 'create') {
    /* Entrée dans le module Incident : consulter ou déclarer. */
    const txt = CHOICE_TXT[lang] || CHOICE_TXT.fr;
    view = (
      <div className="app">
        <style>{CHOICE_CSS}</style>
        <section className="rns-choice">
          <header className="rns-choice-head">
            <span className="rns-choice-eyebrow">{txt.eyebrow}</span>
            <h1>{txt.title}</h1>
            <p>{txt.sub}</p>
          </header>

          <div className="rns-choice-grid">
            <button type="button" className="rns-card" style={ACCENT_LIST} onClick={openIncidents}>
              <span className="rns-card-icon">{ICON_LIST}</span>
              <span className="rns-card-body">
                <span className="rns-card-title">
                  {txt.list}
                  {incidents.length > 0 && <em className="rns-card-count">{incidents.length}</em>}
                </span>
                <span className="rns-card-sub">{txt.listSub}</span>
              </span>
              {CHEVRON}
            </button>

            <button
              type="button"
              className="rns-card"
              style={ACCENT_NEW}
              onClick={() => setIncidentMode('create')}
            >
              <span className="rns-card-icon">{ICON_ALERT}</span>
              <span className="rns-card-body">
                <span className="rns-card-title">{txt.create}</span>
                <span className="rns-card-sub">{txt.createSub}</span>
              </span>
              {CHEVRON}
            </button>
          </div>

          <button type="button" className="rns-choice-back" onClick={reset}>
            {txt.back}
          </button>
        </section>
      </div>
    );
  } else if (module?.key === 'incident') {
    view = (
      <div className="app">
        <IncidentForm
          onSubmit={createIncident}
          onBack={reset}
          onViewIncidents={openIncidents}
        />
      </div>
    );
  } else if (module) {
    /* Change / Problem → formulaire direct */
    const txt = moduleText(module.key, lang);
    view = (
      <div className="app">
        <RecordForm
          fields={module.fields}
          title={txt.title}
          subtitle={txt.sub}
          chip={module.prefix}
          tone={module.tone}
          onSubmit={(values) => handleSubmit(values, txt.title, null)}
          onBack={reset}
        />
      </div>
    );
  } else {
    view = <Portal onSelect={setModuleKey} />;
  }

  return (
    <>
      <AppHeader
        session={session}
        onHome={reset}
        onRequests={() => openRequests('submitted')}
        onIncidents={openIncidents}
        onLogout={() => setSession(null)}
      />
      {view}
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}