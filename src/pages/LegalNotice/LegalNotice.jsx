/* ============================================================
   Page Mentions légales — /mentions-legales
   Contenus : brouillon validé du canvas « pages-legales » (7/11).
   Décisions closes (12/11) : adresse postale NON publiée
   (déménagement en cours — et protection de l'adresse
   personnelle), « Directeur de la publication » conservé
   (LCEN), crédits corrigés — la mono du site est JetBrains
   Mono (tokens), pas IBM Plex Mono comme dans le brouillon.
   Gabarit identique à Privacy : h1 ↔ ligne de mise à jour,
   sections h2 + filet, colonne étroite (SCSS colocalisé).
   ============================================================ */

/* Anti-bots : l'adresse est assemblée à l'exécution — ni le href
   ni le texte n'existent en clair dans le DOM servi. Même
   mécanisme que la page Contact (une seule loi pour un seul
   site). */
const MAIL_USER = 'contact';
const MAIL_TLD = 'diwey.dev';
const MAIL_TO = `${MAIL_USER}@${MAIL_TLD}`;

export default function LegalNotice() {
  return (
    <section className="page legal-notice">
      <h1 className="legal-notice__title">Mentions légales</h1>

      <p className="legal-notice__updated">Dernière mise à jour : novembre 2026</p>

      <section className="legal-notice__section">
        <h2 className="legal-notice__section-title">Éditeur du site</h2>
        <p className="legal-notice__text">
          Ce site est édité par Didier Wey, exerçant sous le pseudonyme
          Diwey. Contact : <a href={`mailto:${MAIL_TO}`}>{MAIL_TO}</a>.
        </p>
        <p className="legal-notice__text">
          Directeur de la publication : Didier Wey.
        </p>
      </section>

      <section className="legal-notice__section">
        <h2 className="legal-notice__section-title">Hébergement</h2>
        <p className="legal-notice__text">
          Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix,
          France — www.ovh.com. Les adresses e-mail du domaine diwey.dev
          sont également gérées par OVH.
        </p>
      </section>

      <section className="legal-notice__section">
        <h2 className="legal-notice__section-title">Propriété intellectuelle</h2>
        <p className="legal-notice__text">
          Les textes, le design et le code de ce site sont l'œuvre de son
          éditeur. Les projets présentés dans la section Portfolio ont été
          réalisés dans le cadre de la formation Intégrateur Web
          d'OpenClassrooms ; leurs captures d'écran sont utilisées à titre
          d'illustration de travaux personnels.
        </p>
        <p className="legal-notice__text">
          Toute reproduction des contenus sans autorisation est interdite.
        </p>
      </section>

      <section className="legal-notice__section">
        <h2 className="legal-notice__section-title">Crédits</h2>
        <p className="legal-notice__text">
          Icônes : Lucide (lucide.dev). Typographies : IBM Plex Serif,
          Inter, JetBrains Mono.
        </p>
      </section>
    </section>
  );
}
