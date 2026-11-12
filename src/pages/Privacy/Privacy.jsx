/* ============================================================
   Page Confidentialité — /confidentialite
   Contenus : brouillon validé du canvas « pages-legales » (7/11),
   clos le 12/11 (chapeau sobre, ligne « Dernière mise à jour »
   gardée, texte 16 littéral tous paliers).
   Adresse e-mail assemblée à l'exécution — même mécanisme que
   la page Contact et la page Mentions légales : une seule loi
   anti-bots pour un seul site (12/11).
   Gabarit : h1 ↔ 48 ↔ chapeau, sections h2 + filet, colonne de
   lecture étroite (SCSS colocalisé — ce JSX ne porte aucun style).
   ============================================================ */

/* Anti-bots : l'adresse est assemblée à l'exécution — ni le href
   ni le texte n'existent en clair dans le DOM servi. */
const MAIL_USER = 'contact';
const MAIL_TLD = 'diwey.dev';
const MAIL_TO = `${MAIL_USER}@${MAIL_TLD}`;

export default function Privacy() {
  return (
    <section className="page privacy">
      <h1 className="privacy__title">Confidentialité</h1>

      <p className="privacy__updated">Dernière mise à jour : novembre 2026</p>

      <p className="privacy__intro">
        Cette page explique, en clair, ce qu'il advient des informations que
        vous confiez à ce site.
      </p>

      <section className="privacy__section">
        <h2 className="privacy__section-title">Données collectées</h2>
        <p className="privacy__text">
          Le formulaire de contact collecte trois informations saisies
          volontairement : nom, adresse e-mail, message. Elles servent
          uniquement à vous répondre. Aucune donnée n'est collectée
          ailleurs sur le site.
        </p>
      </section>

      <section className="privacy__section">
        <h2 className="privacy__section-title">Le parcours de votre message</h2>
        <p className="privacy__text">
          Votre message transite par Formgong (prestataire de formulaires,
          Union européenne), qui le transmet sur mon adresse de contact
          hébergée chez OVH (France). Les messages sont conservés 30 jours
          par le prestataire, puis supprimés automatiquement.
        </p>
      </section>

      <section className="privacy__section">
        <h2 className="privacy__section-title">Cookies et traceurs</h2>
        <p className="privacy__text">
          Ce site ne dépose aucun cookie et n'utilise aucun traceur, aucune
          statistique, aucune régie publicitaire. Il fonctionne sans script
          tiers.
        </p>
      </section>

      <section className="privacy__section">
        <h2 className="privacy__section-title">Vos droits</h2>
        <p className="privacy__text">
          Vous disposez d'un droit d'accès, de rectification et de
          suppression des informations vous concernant. Pour l'exercer,
          écrivez-moi à <a href={`mailto:${MAIL_TO}`}>{MAIL_TO}</a> — je
          réponds sous 48 heures.
        </p>
        <p className="privacy__text">
          Vous pouvez également introduire une réclamation auprès de la
          CNIL (cnil.fr).
        </p>
      </section>
    </section>
  );
}
