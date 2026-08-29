# Portail RNS

Portail libre-service branché sur une instance ServiceNow : déclaration
d'incidents, catalogue de demandes, suivi des statuts et des commentaires.

---

## Démarrage rapide

Il te faut **Node.js 20 ou plus** (`node --version`) et le fichier **`.env`**
fourni par ton enseignant.

```bash
git clone <URL_DU_DEPOT>
cd RNS
npm install
```

Dépose ensuite le fichier `.env` reçu dans le dossier **`server/`** :

```
RNS/
├── client/
├── server/
│   └── .env      ← ici
└── package.json
```

Puis lance tout :

```bash
npm start
```

Le portail s'ouvre sur **http://localhost:5173**. Le proxy tourne en
parallèle sur le port 3001 ; les deux logs s'affichent dans le même
terminal, préfixés `proxy` et `client`.

Pour arrêter : `Ctrl+C`.

Si le fichier `.env` manque ou qu'une variable est vide, `npm start` te le
dit avant de démarrer, en nommant ce qui manque.

> Le `.env` contient des identifiants réels. Ne le republie pas, ne le
> committe pas, ne le colle pas dans un ticket ou un canal partagé.

---

## Comment c'est construit

L'application est en deux parties :

- **`client/`** — interface React (Vite). Ne connaît que le proxy, jamais ServiceNow.
- **`server/`** — proxy Express. Détient les identifiants et parle à la Table API.

Cette séparation est volontaire : aucun secret ne descend dans le navigateur.

---

## Vérifier que tout fonctionne

```bash
# Le proxy répond et connaît sa configuration
curl -s http://localhost:3001/api/health

# Un jeton est obtenu sans rien créer dans ServiceNow
curl -s http://localhost:3001/api/auth-check
```

`auth-check` doit répondre `{"mode":"oauth","grant":"password","ok":true}`.

En cas d'échec, le message d'erreur est explicite et vient de ServiceNow
lui-même — lisez-le avant de chercher ailleurs.

---

## Routes du proxy

| Méthode | Route | Rôle |
|---|---|---|
| `GET` | `/api/health` | Configuration chargée |
| `GET` | `/api/auth-check` | Obtention d'un jeton, sans écriture |
| `GET` | `/api/incidents` | Incidents du compte de service |
| `POST` | `/api/incidents` | Création d'un incident |
| `POST` | `/api/requests` | Demande + articles demandés |
| `POST` | `/api/records/:table` | Création sur `problem` ou `change_request` |
| `GET` | `/api/records/:table/:sysId` | Relecture d'un enregistrement |
| `PATCH` | `/api/records/:table/:sysId` | Mise à jour — commentaire, statut |
| `GET` | `/api/journal/:sysId` | Fil de commentaires |

`/api/journal/:sysId?elements=all` inclut les notes de travail, masquées par
défaut car destinées aux techniciens.

---

## Problèmes fréquents

**`EADDRINUSE: address already in use :::3001`**
Le proxy tourne déjà. `lsof -ti:3001 | xargs kill` pour l'arrêter.

**Le jeton est obtenu mais la Table API refuse l'appel**
`Scope Restriction` n'est pas sur `Broadly scoped`, ou le proxy détient
encore un jeton émis sous l'ancienne configuration. Redémarrez-le : la portée
est inscrite dans le jeton au moment de son émission, et il reste valide 1800
secondes.

**Un commentaire ajouté dans ServiceNow n'apparaît pas dans le portail**
Il a probablement été posté en *Work note* — barre jaune à gauche dans
l'historique. Cochez **Comments (Customer visible)** avant de publier.

**`Variables absentes de server/.env`**
Le fichier `.env` n'a pas été créé, ou une variable est vide.

---

## Sécurité

Les identifiants ne quittent jamais le processus Node : le navigateur ne
parle qu'au proxy. Trois règles pour que ça reste vrai :

- ne jamais committer `server/.env`
- ne jamais coller un secret dans un terminal partagé ou un ticket
- utiliser un compte de service dédié en production, pas un compte `admin`

Si un secret a fuité, régénérez-le : videz le champ Client Secret sur la
fiche de l'application OAuth et enregistrez — ServiceNow en génère un
nouveau.

---

## Annexe — configurer une instance ServiceNow

Cette section s'adresse à qui met en place l'instance, pas aux étudiants qui
reçoivent un `.env` déjà rempli.

### Créer l'application OAuth

**All > System OAuth > Application Registry > New > Create an OAuth API
endpoint for external clients**

| Champ | Valeur |
|---|---|
| Name | `Portail RNS` |
| Client ID | généré automatiquement — à recopier |
| Client Secret | laisser vide pour génération automatique, puis le recopier |
| Refresh Token Lifespan | `8640000` |
| Access Token Lifespan | `1800` |
| **Scope Restriction** | **`Broadly scoped`** |
| **Enforce Token Restrictions** | **décoché** |

Les deux derniers champs sont critiques. Laissés à leurs valeurs par défaut
(`Securely scoped` avec une liste Auth Scopes vide, et la restriction
activée), le jeton est bien émis — le proxy semble authentifié — mais tous
les appels à la Table API sont refusés. Le symptôme trompe : l'erreur
ressemble à un problème de droits alors que c'est la portée du jeton.

`Redirect URL` peut rester vide : le grant `password` ne l'utilise pas.

### Droits du compte de service

Le compte renseigné dans `SN_USER` doit pouvoir lire et écrire sur
`incident`, `problem`, `change_request`, `sc_request`, `sc_req_item`, et lire
`sys_journal_field` pour les commentaires.

Sur une PDI, le rôle `admin` fait l'affaire. En production, créez un compte
de service dédié avec les seuls rôles nécessaires — le jeton hérite de tous
les droits de cet utilisateur.

### Installation manuelle, sans le script racine

```bash
cd server && npm install && cp .env.example .env   # puis remplir .env
cd ../client && npm install
```

Puis dans deux terminaux : `npm run dev` dans `server/`, et `npm run dev`
dans `client/`.
