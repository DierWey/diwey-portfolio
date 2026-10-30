import "./browser-frame.scss";

/**
 * Barre Chrome décorative au-dessus d'une capture d'écran.
 *
 * Usage :
 *   <BrowserFrame url="ohmyfood.diwey.dev" size="lg">
 *     <img ... />
 *   </BrowserFrame>
 *
 * Contrat :
 * - Le composant rend chrome + children, SANS bordure ni rayon :
 *   c'est le conteneur parent (cadre carrousel, carte, bannière fiche)
 *   qui porte border-radius et overflow: hidden.
 * - Le chrome est décoratif : aria-hidden, jamais lu aux lecteurs d'écran.
 *   Seul le contenu (children) reste dans le flux d'accessibilité.
 *
 * Écarts (règle « Le détail compte ») :
 * - bord ↔ groupe de points : 8 CONSTANT (padding du chrome) ;
 * - À L'INTÉRIEUR du groupe de 3 points : écart = taille des points
 *   (8 en lg, 5 en sm — et lg passe à 5 en mobile via media query) ;
 * - groupe de points ↔ pilule : 8 CONSTANT.
 * Le groupe vit dans son propre conteneur (span __dots) : la loi
 * variable s'applique au groupe, la loi constante au chrome.
 *
 * Variantes :
 * - lg : points 8 desktop/tablette (5 en mobile, media query côté SCSS)
 * - sm : points 5 tous paliers (carte Portfolio)
 *
 * Style : ./browser-frame.scss (colocalisé, kebab-case, @use dans main.scss)
 * Tokens consommés : --line, --surface, --ink-muted, --font-mono, --chrome-dot
 */
function BrowserFrame({ url, size = "lg", children }) {
  return (
    <div className={`browser-frame browser-frame--${size}`}>
      <div className="browser-frame__chrome" aria-hidden="true">
        <span className="browser-frame__dots">
          <span className="browser-frame__dot" />
          <span className="browser-frame__dot" />
          <span className="browser-frame__dot" />
        </span>
        <span className="browser-frame__url">{url}</span>
      </div>
      <div className="browser-frame__content">{children}</div>
    </div>
  );
}

export default BrowserFrame;
