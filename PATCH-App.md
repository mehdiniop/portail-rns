# Brancher `App.jsx` sur ServiceNow

Trois modifications dans `client/src/App.jsx`. Le principe est le même partout :
**affichage optimiste** — le numéro local (`INC001043`) apparaît tout de suite,
puis il est remplacé par le vrai numéro ServiceNow (`INC0010042`) dès que
l'appel revient. Si l'appel échoue, l'enregistrement reste visible avec une
note d'erreur : rien n'est perdu.

---

## 1. Import (en haut du fichier)

Après `import { I18nProvider, useI18n } from './i18n.jsx';` :

```js
import { pushIncident, pushRecord, pushRequest } from './servicenow.js';
```

---

## 2. `createIncident` — table `incident`

À la fin de la fonction, juste après `setScreen('incident');` :

```js
    pushIncident(payload)
      .then((sn) =>
        patchIncident(
          number,
          { number: sn.number, sys_id: sn.sys_id },
          `Créé dans ServiceNow : ${sn.number}.`,
        ))
      .catch((error) =>
        patchIncident(
          number,
          { syncError: error.message },
          `Échec de création dans ServiceNow : ${error.message}`,
        ));
```

`patchIncident` retrouve l'incident par son `id` local, qui ne change pas :
seul le `number` affiché est remplacé.

---

## 3. `checkout` — panier → `sc_request` + `sc_req_item`

Remplace la fin de la fonction (à partir de `setRequests(...)`) par :

```js
    const localIds = records.map((record) => record.id);

    setRequests((prev) => [...records.reverse(), ...prev]);
    setCart([]);
    setScreen(null);
    setCreated({
      number: numbers[0],
      summary: numbers.length > 1
        ? `${numbers.length} ${lang === 'en' ? 'items ordered' : lang === 'ar' ? 'عناصر مطلوبة' : 'articles commandés'}`
        : records[0].summary,
    });

    pushRequest(cart)
      .then((sn) => {
        setRequests((prev) =>
          prev.map((record) => {
            if (!localIds.includes(record.id)) return record;
            const match = sn.items.find((item) => item.key === record.item?.key);
            return {
              ...record,
              number: match?.number || sn.number,
              sys_id: match?.sys_id,
              request_number: sn.number,
            };
          }));
        setCreated((prev) => (prev ? { ...prev, number: sn.number } : prev));
      })
      .catch((error) =>
        setCreated((prev) => (prev ? { ...prev, error: error.message } : prev)));
```

Attention : `records.reverse()` modifie le tableau en place, d'où le
`localIds` calculé **avant**.

---

## 4. `handleSubmit` — commande directe, Change et Problem

À la fin de la fonction, après `setCreated({ number, summary });` :

```js
    const sync = submittedItem
      ? pushRequest([{ item: submittedItem, values, quantity: values.quantity || 1 }])
      : module?.key === 'change'
        ? pushRecord('change_request', values)
        : module?.key === 'problem'
          ? pushRecord('problem', values)
          : null;

    if (sync) {
      sync
        .then((sn) => {
          const snNumber = sn.items?.[0]?.number || sn.number;
          setRequests((prev) =>
            prev.map((record) =>
              record.id === number
                ? { ...record, number: snNumber, sys_id: sn.sys_id }
                : record));
          setCreated((prev) =>
            (prev && prev.number === number ? { ...prev, number: snNumber } : prev));
        })
        .catch((error) =>
          setCreated((prev) => (prev ? { ...prev, error: error.message } : prev)));
    }
```

---

## 5. (Facultatif) Afficher l'erreur de synchronisation

Dans le bloc `if (created)`, sous `<p className="portal-sub">{created.summary}</p>` :

```jsx
              {created.error && (
                <p className="inc-error" role="alert">
                  Non synchronisé avec ServiceNow : {created.error}
                </p>
              )}
```
