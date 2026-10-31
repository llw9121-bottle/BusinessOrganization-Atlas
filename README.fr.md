# Atlas des modèles économiques × organisations

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · **Français**

Un atlas interactif qui relie les **choix de modèle économique** aux **formes organisationnelles, aux
forces et aux transitions**. C'est un guide de terrain interprétatif de *Understanding
Organizations...Finally!* d'Henry Mintzberg (Berrett-Koehler, 2023), et non un substitut à l'ouvrage.

Il s'adresse aux fondateurs, dirigeants, consultants et étudiants qui veulent poser de meilleures
questions : pourquoi une organisation fonctionne-t-elle comme elle fonctionne, et que faudrait-il changer
pour qu'un autre modèle lui convienne ?

- **Sans compte, sans backend, sans analytique.** Tous les calculs se font dans votre navigateur.
- **Six langues.** English, 简体中文, 日本語, 한국어, Español et Français se changent instantanément.
- **Sans compilation ni dépendance.** Uniquement HTML, CSS et ES Modules natifs.

## Visite guidée

L'atlas compte dix sections. La première, Passerelle, s'ouvre par défaut.

| Section | Ce que vous pouvez faire |
| --- | --- |
| **01 Passerelle** | Combinez quatre décisions de modèle (client, valeur, économie, frontière) et voyez quelle forme organisationnelle elles favorisent, où elles créent des tensions et quel contrepoids les maintient saines. |
| **02 Canevas** | Parcourez les neuf blocs du modèle économique avec un regard organisationnel. |
| **03 Modèles** | Explorez cinq modèles récurrents : désagrégé, longue traîne, multiface, gratuit et ouvert. |
| **04 Conception** | Partez d'un épicentre de conception et suivez les décisions et questions qui relient modèle et organisation. |
| **05 Cas** | Lisez des exemples d'entreprises réelles et sautez directement au scénario Passerelle correspondant. |
| **06 Atlas** | Placez les quatre formes fondamentales sur une carte en losange et examinez les trois formes secondaires. |
| **07 Formes** | Lisez le profil détaillé des sept formes : moteur de coordination, pouvoir, conditions, risque et exemples. |
| **08 Forces** | Montez les sept forces avec les curseurs ; le studio nomme la forme qu'elles favorisent et le contrepoids qui les contient. |
| **09 Changement** | Suivez les étapes du cycle de vie et les trajectoires de transition courantes. |
| **10 À propos** | Consultez la source, la portée et la méthode de l'interprétation. |

## Démarrage rapide

Il vous faut seulement **Node.js 18+** ou **Python 3** pour servir des fichiers statiques. Rien à
installer ni à compiler.

```bash
# Recommandé : serveur Node inclus, sans dépendance
npm start
```

```bash
# Alternative : serveur statique Python
python -m http.server 8765 --bind 127.0.0.1
```

Ouvrez <http://127.0.0.1:8765/>. Pour arrêter le serveur, appuyez sur `Ctrl+C`.

**Pourquoi un serveur local ?** L'application utilise des ES Modules natifs. Pour des raisons de
sécurité, les navigateurs bloquent les imports de modules depuis les pages `file://` ; ouvrir
`index.html` par double-clic affiche donc une page vide ou cassée. Le servir en HTTP résout le problème
sans modifier le code.

Si le port 8765 est déjà utilisé :

```bash
PORT=9000 npm start
```

Sous Windows PowerShell : `$env:PORT=9000; npm start`.

## Structure du projet

```text
index.html                  Balisage sémantique et unique point d'entrée
package.json                Scripts uniquement ; aucune dépendance d'exécution
styles/                     Une feuille de style par couche ou par vue
  fonts.css                 @font-face de neuf WOFF2 locales
  tokens.css                Variables de couleur, d'espacement et de typographie
  base.css                  Reset, styles par défaut, retour naturel des titres à la ligne
  layout.css                En-tête, navigation, sélecteur de langue, coque des vues
  atlas.css ... overrides.css  Styles par vue, dans l'ordre source
assets/fonts/               Sous-ensembles Inter et Noto Sans SC/JP/KR avec licences
js/
  app.js                    Racine de composition : init, langue, routage par ancre
  core/html.js              Échappement HTML et rendu des diagrammes
  i18n/                     Métadonnées, traductions, t(), libellés localisés
  data/                     Données pures : formes, forces, étapes, routes, règles...
  ui/                       Un module par vue ; possède son état et son rendu
scripts/
  serve.mjs                 Serveur statique local sans dépendance
  audit.mjs                 Audit structurel, sécurité, accessibilité et données
```

## Comment c'est construit

Les modules forment une chaîne de dépendances à sens unique :

```text
data  ->  i18n  ->  ui  ->  app.js
```

- **`js/data/`** sont des modules feuilles. Ils exportent des objets simples et n'importent rien, ce qui
  facilite les tests, les comparaisons et la réutilisation.
- **`js/i18n/`** détient la langue courante. Les clés de traduction sont exactement les chaînes anglaises
  d'origine du balisage et des données : l'anglais n'a donc pas besoin de table de correspondance et une
  traduction manquante retombe proprement sur l'anglais.
- **`js/ui/`** contient un module par vue. Chacun possède son état et exporte `renderXView()` et
  `initXView()`. Les actions entre vues passent par une API étroite : par exemple, les autres vues
  appellent `applyBridgePreset()` au lieu de modifier directement l'état de Passerelle.
- **`js/app.js`** est la racine de composition : elle assemble les modules, rend dans un ordre fixe,
  gère le sélecteur de langue et résout les liens profonds comme `#bridge` ou `#atlas`.

Notes d'implémentation :

- Les feuilles CSS sont chargées dans leur ordre de cascade d'origine. `responsive.css` et
  `overrides.css` doivent rester en dernier.
- La seule valeur persistée est la langue dans `localStorage` (`organization-atlas-language`). Les
  échecs de lecture et d'écriture sont gérés.
- La navigation utilise `history.replaceState` : changer d'onglet n'accumule pas d'historique.
- Les titres reviennent naturellement à la ligne selon la langue et la largeur. Les préférences de réduction des animations sont respectées.
- L’atelier propose un exemple guidé Google Search, des blocs Canvas liés, une comparaison de scénarios et de deux formes organisationnelles. Ces états ne sont conservés que pendant la visite courante.

## Tâches courantes

**Modifier un texte ou des données métier.** Éditez le fichier concerné dans `js/data/` ou le texte de
`index.html`. Les données sont des objets simples, sans étape de compilation.

**Ajouter ou corriger une traduction.** Trouvez la chaîne anglaise d'origine (la clé) et ajoutez-la à la
langue correspondante dans `js/i18n/translations.js`. Pour un ajout ponctuel, reprenez le motif existant
`Object.assign(translations.<langue>.strings, { ... })` en bas du fichier.

**Ajouter une langue.** Ajoutez une entrée dans `js/i18n/languages.js`, ajoutez ou affectez un objet
`translations.<langue>`, puis ajoutez une `<option>` à `#language-select` dans `index.html`.

**Ajouter une forme ou une force.** Mettez à jour le module de données correspondant, ajoutez les
contrôles dans le balisage et étendez les données de passerelle et de profils de modèle. Lancez ensuite
l'audit : il vérifie les clés étrangères entre tous ces fichiers.

## Contrôles qualité

```bash
npm run audit
```

L'audit est sans dépendance et vérifie :

- Que chaque module JavaScript s'analyse, n'importe que des chemins relatifs et que le graphe d'imports
  est acyclique.
- Que la page possède exactement un script module externe, aucun script ni style en ligne, et aucun
  gestionnaire d'événement ni attribut `style` en ligne.
- Que la CSP est en refus par défaut et ne contient ni `unsafe-inline` ni `unsafe-eval`.
- Que les feuilles de style se chargent dans l'ordre attendu, et que chaque `url()` CSS et chaque police
  WOFF2 existe et est valide.
- Que les ID d'éléments sont uniques, que chaque ancre, lien local et lien HTTPS externe est sûr, et que
  les liens externes utilisent `noopener noreferrer`.
- Que chaque ID de DOM référencé depuis JavaScript existe dans le balisage.
- Que les clés étrangères des données sont cohérentes : formes, profils, diagrammes, forces, préréglages,
  groupes et préréglages de passerelle, règles de tension, modèles, étapes, routes, blocs de canevas et
  épicentres de conception.
- Que la palette de texte principale respecte le contraste WCAG AA (4.5:1) sur les trois fonds.
- Que les six versions du README existent.

## Sécurité et confidentialité

- La page **n'effectue aucune requête réseau** et n'a ni backend, ni analytique, ni cookies, ni
  formulaires, ni iframes, ni ingestion de contenu utilisateur.
- La seule valeur persistée est la langue choisie dans `localStorage`.
- Les liens externes de cas et de licences ne s'ouvrent qu'après un clic explicite et utilisent
  `rel="noopener noreferrer"`.
- Les modèles HTML dynamiques échappent le texte traduit. Les corps SVG structurels restent des données
  sources statiques de confiance.
- La CSP bloque les ressources distantes et toutes les connexions de données. Pour un service public,
  ajoutez une CSP en en-tête de réponse et `frame-ancestors 'none'` sur le serveur web ou le CDN.

## Polices et licences

La page embarque des sous-ensembles WOFF2 locaux d'**Inter** et de **Noto Sans SC / JP / KR**. Ces
polices sont sous SIL Open Font License 1.1. Attribution complète et texte de licence :

- [`assets/fonts/FONT-LICENSES.txt`](assets/fonts/FONT-LICENSES.txt)

Aucune police n'est chargée depuis un serveur tiers.

## Source et portée

Cette interface condense les chapitres 2 à 21 d'*Understanding Organizations...Finally!: Structure in
Sevens* d'Henry Mintzberg (Berrett-Koehler, 2023). C'est un aperçu interprétatif indépendant. Elle ne
reproduit pas l'ouvrage et n'est pas un instrument de diagnostic validé. Traitez chaque résultat comme
une hypothèse à confronter au travail réel, aux incitations, au pouvoir, à l'histoire et aux preuves
clients.

## Navigateurs pris en charge

Versions actuelles de Chrome, Edge, Firefox et Safari. L'application nécessite les ES Modules,
`localStorage` et un CSS moderne ; elle fonctionne hors ligne une fois chargée.
