import { getCapture, hasCapture } from "../../utils/captures";

/* ------------------------------------------------------------------
   Capture — le <picture> commun aux trois rôles.

   Un seul composant pour carousel / card / preview : la logique
   (paliers, densités, replis) vit dans utils/captures.js, le
   balisage vit ici, le consommateur ne garde que le contexte
   (conteneur, ratio, texte alternatif).

   Paliers = breakpoints de la charte (media mobile-first) :
   - desktop  : (min-width: 1024px)
   - tablette : (min-width: 768px)
   - mobile   : source par défaut (le <img>)
   Chaque <source> porte son srcSet 1x/2x — le navigateur choisit
   le fichier selon sa largeur ET sa densité. Art direction : la
   version mobile n'est pas un rognage du desktop, c'est une
   capture à part (convention 30/10).

   Rôles du composant :
   - hasCapture false → null : le consommateur affiche son
     placeholder (retrait progressif du vieux par le neuf)
   - <img> : src = mobile 1x (repli @2x si le 1x manque — le
     navigateur réduit), srcSet mobile complet, loading lazy,
     decoding async — une capture de carroucel n'est jamais
     prioritaire sur le texte de la page
   - AUCUN style ici : le ratio et la taille vivent dans le
     conteneur (aspect-ratio du consommateur) — le composant
     livre une image qui remplit, il ne décide pas de la forme
   ------------------------------------------------------------------ */
export default function Capture({ slug, role, alt = "", className }) {
  if (!hasCapture(slug, role)) return null;

  /* srcSet d'un palier, sans trou : 1x seul, 2x seul, ou les deux */
  const srcSetOf = (palier) => {
    const cap = getCapture(slug, role, palier);
    if (cap["1x"] && cap["2x"]) return `${cap["1x"]} 1x, ${cap["2x"]} 2x`;
    return cap["1x"] ? `${cap["1x"]} 1x` : `${cap["2x"]} 2x`;
  };

  const def = getCapture(slug, role, "mobile");
  const src = def["1x"] || def["2x"];

  return (
    <picture className={className}>
      <source media="(min-width: 1024px)" srcSet={srcSetOf("desktop")} />
      <source media="(min-width: 768px)" srcSet={srcSetOf("tablet")} />
      <img
        src={src}
        srcSet={srcSetOf("mobile")}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
