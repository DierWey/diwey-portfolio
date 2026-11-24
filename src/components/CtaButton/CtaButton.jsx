import { Link } from "react-router-dom";

/* ------------------------------------------------------------------
   CtaButton est LE bouton d'action du site. Un seul composant,
   trois rendus possibles. La prop choisit le rendu.

   to reçoit une route interne. Le composant rend alors un Link
   react-router : la navigation se fait sans rechargement.

   href reçoit une adresse externe ou un fichier (démo GitHub
   Pages, CV en PDF). Le composant rend alors une balise a.
   Si l'appelant transmet target="_blank", le composant pose
   automatiquement rel="noreferrer noopener". 
   
   Jamais de target sans rel : c'est le contrat sécurité du composant.
   On pose noreferrer et noopener pour empêcher la page ouverte de
   manipuler la page d'origine, et éviter de lui transmettre le
   Referer. 

   Sans to ni href, le composant rend une balise button avec
   le type demandé : c'est le rendu pour agir dans la page
   (soumettre un formulaire, piloter le carrousel).
   ------------------------------------------------------------------ */

export default function CtaButton({
  to = null,          // route interne : rend un <Link>
  href = null,        // externe ou fichier : rend un <a>
  target = null,      // cf. deuxième rendu
  type = "button",     // submit / reset si <button>
  variant = "primary", // primary (accent/surface) ou secondary (accent-soft/ink)
  size = "lg",         // lg ou sm
  disabled = false,    // transmis au <button> seul : désactive le bouton pendant l'envoi
                       // (le lien n'a pas de soumission, pas d'état à désactiver)
  children,            // libellé et flèche (séparés par un gap de 16 dans le .scss)
  className = "",
}) {
  const classes = ["cta", `cta--${variant}`, `cta--${size}`, className]
    .filter(Boolean)
    .join(" ");

  /* Premier rendu : la prop to a la priorité. La route est interne, on rend un Link
  react-router, sans rechargement. */
  if (to) {
    return <Link to={to} className={classes}>{children}</Link>;
  }

  /* Deuxième rendu : pas de route interne, mais une adresse externe.
  On rend une balise a, et on tient le contrat sécurité : target="_blank" reçu
  impose rel="noreferrer noopener" ; sinon, pas de rel. */
  if (href) {
    const rel = target === "_blank" ? "noreferrer noopener" : undefined;
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }

  /* Troisième rendu : par défaut, il n'y a ni route interne ni adresse externe.
  On rend une balise button du type demandé. C'est le seul des trois rendus qui
  possède disabled : on le transmet. */
  return <button type={type} className={classes} disabled={disabled}>{children}</button>;
}
