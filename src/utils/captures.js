/* ------------------------------------------------------------------
   captures.js — résolution des fichiers de capture d'un projet.

   Convention de nommage (le dossier est la seule source de vérité) :
   - dossier par projet : src/assets/pictures/{slug}/
   - nommage : {role}-{palier}.webp + {role}-{palier}@2x.webp
   - rôles : carousel / card / preview —la même vue du projet,
     cadrée différemment pour son consommateur ;
   - paliers : desktop / tablet / mobile (mêmes frontières que les
     breakpoints : ≥1024 / 768-1023 / <768).

   Résolution par import.meta.glob, eager + query: '?url' : chaque
   module ne livre que son URL d'asset hashé par Vite, AUCUN octet
   d'image dans le bundle. Le slug du JSON reste la clé de jointure :
   le composant qui consomme n'invente jamais de chemin, il demande.

   RÉSILIENCE — le résolveur ne casse JAMAIS : il sert ce qui existe.
   - densité manquante : le @2x sert de repli au @1x (le navigateur
     réduit — un peu plus lourd, jamais cassé) ;
   - palier manquant : repli sur le palier le plus proche ;
   - rôle absent : hasCapture() répond false, le consommateur garde
     son placeholder (repli durable, volontaire : un projet entré au
     JSON sans captures s'affiche proprement pendant leur production).
   ------------------------------------------------------------------ */

const PICTURES = import.meta.glob("/src/assets/pictures/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

/* index est la bibliothèque des captures. Elle range les URL dans cet ordre : projet, puis role, puis palier, puis densité (1x ou 2x). 
La boucle construit cette bibliothèque à partir de PICTURES.
Pour chaque fichier, l'expression régulière lit son nom. Un nom mal formé ne respecte pas la convention. La boucle l'ignore et passe au fichier suivant.
Une image mal nommée ne doit pas casser la résolution des autres. */
const index = {};
for (const [path, url] of Object.entries(PICTURES)) {
  const m = path.match(
    /\/pictures\/([^/]+)\/(carousel|card|preview)-(desktop|tablet|mobile)(@2x)?\.webp$/
  );
  if (!m) continue;
  const [, slug, role, palier, is2x] = m;
  index[slug] ??= {};
  index[slug][role] ??= {};
  index[slug][role][palier] ??= {};
  index[slug][role][palier][is2x ? "2x" : "1x"] = url;
}

/* Ordres de repli entre paliers. 
   Pour chaque palier demandé (desktop, tablet ou mobile), FALLBACK donne
   la liste des paliers à essayer, dans l'ordre : d'abord le palier demandé,
   puis les autres.
   Une capture manquante est donc servie par le palier le plus proche,
   et le rendu d'un projet incomplet reste propre. */
const FALLBACK = {
  desktop: ["desktop", "tablet", "mobile"],
  tablet: ["tablet", "desktop", "mobile"],
  mobile: ["mobile", "tablet", "desktop"],
};

/* getCapture est la fonction de consultation du module.
   Elle reçoit le slug du projet, le rôle et le palier demandés,
   et rend toujours un objet à deux clés : "1x" et "2x".
   Si la capture existe, chaque clé vaut l'URL hachée ; sinon, chaque clé vaut "".
   Le composant qui l'appelle peut donc construire son srcSet sans jamais
   vérifier l'existence de la capture demandée : les cas manquants sont déjà gérés ici. */
export function getCapture(slug, role, palier) {
  const roleIndex = index[slug]?.[role];
  if (!roleIndex) return { "1x": "", "2x": "" };
  for (const p of FALLBACK[palier] || FALLBACK.desktop) {
    if (roleIndex[p]) {
      return { "1x": roleIndex[p]["1x"] || "", "2x": roleIndex[p]["2x"] || "" };
    }
  }
  return { "1x": "", "2x": "" };
}

/* hasCapture vérifie si un role donné (carousel, preview ou card) existe pour un projet donné.
Si c'est le cas, la réponse est true. Si ce n'est pas le cas, la réponse est false.
Carousel.jsx, ProjectCard.jsx et ProjectDetail.jsx font appel à cette fonction pour gérer 
les placeholders */
export function hasCapture(slug, role) {
  return Boolean(index[slug]?.[role]);
}
