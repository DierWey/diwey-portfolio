/* ------------------------------------------------------------------
   captures.js — résolution des fichiers de capture d'un projet.

   Convention (charte 30/10) :
   - dossier par projet : src/assets/pictures/{slug}/
   - nommage : {role}-{palier}.webp + {role}-{palier}@2x.webp
   - rôles : carousel / card / preview — la même vue du projet,
     cadrée différemment
   - paliers : desktop / tablet / mobile (mêmes frontières que les
     breakpoints : ≥1024 / 768-1023 / <768)

   TRANCHÉ 9/11 : résolution par import.meta.glob (en suspend depuis
   le 30/10) — eager + query: '?url' : chaque module ne livre que
   son URL d'asset hashé par Vite, AUCUN octet d'image dans le
   bundle. Le slug du JSON reste la clé de jointure : le composant
   qui consomme n'invente jamais de chemin, il demande.

   RÉSILIENCE — chantier en cours (pilote ohmyfood 9/11) : les 108
   fichiers arrivent au fil des découpes. Le résolveur ne casse
   JAMAIS : il sert ce qui existe.
   - densité manquante : le @2x sert de repli au @1x (le navigateur
     réduit — un peu plus lourd, jamais cassé)
   - palier manquant : repli desktop → tablet → mobile
   - rôle absent : hasCapture() répond false, le consommateur garde
     son placeholder (c'est la seule absence visible, volontaire)
   ------------------------------------------------------------------ */

const PICTURES = import.meta.glob("/src/assets/pictures/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

/* index = { [slug]: { [role]: { [palier]: { "1x": url, "2x": url } } } }
   Fichiers hors convention (nom mal formé) : ignorés silencieusement —
   une image mal nommée ne doit pas casser la résolution des autres. */
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

/* Ordre de repli entre paliers : le plus proche du palier demandé.
   desktop manque → tablet ; tablet manque → mobile ; mobile manque
   → tablet. Le rendu d'un projet non encore capturé reste propre. */
const FALLBACK = {
  desktop: ["desktop", "tablet", "mobile"],
  tablet: ["tablet", "desktop", "mobile"],
  mobile: ["mobile", "tablet", "desktop"],
};

/* getCapture(slug, role, palier) → { "1x": url|"", "2x": url|"" }
   Toujours un objet : densités existantes remplies, absentes en "".
   Le consommateur construit son srcSet sans jamais vérifier
   l'existence — les helpers below gèrent les trous. */
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

/* Le rôle existe-t-il pour ce projet ? (au moins un fichier)
   Le placeholder vit tant que la réponse est false — retrait
   progressif, projet par projet, en suivant le chantier. */
export function hasCapture(slug, role) {
  return Boolean(index[slug]?.[role]);
}
