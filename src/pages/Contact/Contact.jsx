/* Page Contact — structure Figma (30/10) :
   h1 centré ↔ 48 ↔ infos-form ;
   desktop 384 (informations) + 96 + 768 (échanges) = 1248 ;
   tablette/mobile : empilés, écart 96 tablette / 48 mobile.

   Section échanges (30/10) — OPTION A : mailto pré-rempli.
   Le formulaire valide les champs, puis ouvre le client mail du
   visiteur avec objet et corps remplis. Zéro dépendance, zéro RGPD
   (les données ne transitent jamais par le site).

   BASCULE VERS L'OPTION B (Formspree, évoquée avec le mentor
   mercredi) : remplacer le corps de handleSubmit par un fetch vers
   l'endpoint, ajouter les états (envoi, succès, erreur) et une
   ligne RGPD sous le bouton. Le JSX et les styles ne bougent pas. */
import CtaButton from '../../components/CtaButton/CtaButton';

/* Anti-bots : l'adresse est assemblée à l'exécution — ni le href
   ni le texte n'existent en clair dans le DOM servi. */
const MAIL_USER = 'contact';
const MAIL_TLD = 'diwey.dev';
const MAIL_TO = `${MAIL_USER}@${MAIL_TLD}`;

/* Option A : validation native (required, type=email) puis mailto
   pré-rempli. Le honeypot filtre les bots : le champ caché ne doit
   jamais être rempli par un humain — s'il l'est, silence radio. */
function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);

  if (data.get('entreprise')) return; // honeypot rempli → bot : on ne fait rien

  const nom = data.get('nom');
  const email = data.get('email');
  const message = data.get('message');

  const sujet = `Contact depuis diwey.dev — ${nom}`;
  const corps = `Message de ${nom} (${email}) :\n\n${message}`;

  window.location.href =
    `mailto:${MAIL_TO}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}

export default function Contact() {
  return (
    <main className="page contact">
      <h1>Me contacter</h1>

      <div className="contact__infos-form">
        {/* ---------- SECTION INFORMATIONS (384) ---------- */}
        <section className="contact__informations">
          <div className="contact__head">
            <h2>Contacts directs</h2>
            <span className="contact__rule" aria-hidden="true"></span>
          </div>

          {/* Bloc mail — libellé puis valeur cliquable */}
          <div className="contact__mail">
            <div className="contact__label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="contact__label-text">Adresse e-mail&nbsp;:</span>
            </div>
            <a className="contact__value" href={`mailto:${MAIL_TO}`}>{MAIL_TO}</a>
          </div>

          {/* Bloc LinkedIn — profil créé/à venir (30/10) : URL posée sur
              linkedin.com/in/didier-wey, à corriger si l'identifiant diffère. */}
          <div className="contact__linkedin">
            <div className="contact__label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"
                   aria-hidden="true">
                <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5z" />
              </svg>
              <span className="contact__label-text">LinkedIn&nbsp;:</span>
            </div>
            <a className="contact__value contact__value--external"
               href="https://www.linkedin.com/in/didier-wey"
               target="_blank" rel="noreferrer">
              Didier Wey
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </section>

        {/* ---------- SECTION ÉCHANGES (768) ---------- */}
        <section className="contact__echanges">
          <div className="contact__head">
            <h2>Échanges</h2>
            <span className="contact__rule" aria-hidden="true"></span>
          </div>

          <p className="contact__pitch">
            Un projet, une mission, un entretien ? Écrivez-moi directement
            via le formulaire — je réponds sous 48 heures.
          </p>

          <form className="contact__form" onSubmit={handleSubmit} noValidate={false}>
            {/* Honeypot anti-bots — jamais visible, jamais rempli par un humain.
                Les lecteurs d'écran l'ignorent (aria-hidden), le clavier aussi (tabIndex -1). */}
            <div className="contact__honeypot" aria-hidden="true">
              <label htmlFor="entreprise">Ne pas remplir ce champ</label>
              <input id="entreprise" name="entreprise" type="text"
                     tabIndex={-1} autoComplete="off" />
            </div>

            <div className="contact__field">
              <label htmlFor="nom">Votre nom</label>
              <input className="contact__input" id="nom" name="nom" type="text"
                     placeholder="Comment vous appelez-vous ?"
                     required autoComplete="name" />
            </div>

            <div className="contact__field">
              <label htmlFor="email">Votre e-mail</label>
              <input className="contact__input" id="email" name="email" type="email"
                     placeholder="vous@exemple.fr"
                     required autoComplete="email" />
            </div>

            <div className="contact__field">
              <label htmlFor="message">Votre message</label>
              <textarea className="contact__input contact__input--area"
                        id="message" name="message" required rows={5}
                        placeholder="Votre idée, vos besoins, vos questions…" />
            </div>

            {/* Confidentialité — ironique en Option A (mailto : rien ne
                transite), mais vraie dès la bascule Option B (Formspree). */}
            <div className="contact__privacy">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Vos informations servent uniquement à vous répondre.</span>
            </div>

            <CtaButton type="submit" variant="primary" size="lg">
              Envoyer le message
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true"
                   className="contact__send-arrow">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </CtaButton>
          </form>
        </section>
      </div>
    </main>
  );
}
