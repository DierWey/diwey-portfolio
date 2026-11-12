/* Page Contact — structure Figma (30/10) :
   h1 centré ↔ 48 ↔ infos-form ;
   desktop 384 (informations) + 96 + 768 (échanges) = 1248 ;
   tablette/mobile : empilés, écart 96 tablette / 48 mobile.

   OPTION B BASCULÉE (6/11) — FORMGONG, récepteur UE.
   Décisions (charte, 6/11) : pas de récepteur français existant ;
   Formgong retenu pour juridiction UE explicite (vs Formcarry :
   data centers UE mais société US → CLOUD Act), 1000 envois/mois
   gratuits, honeypot + heuristiques de base sur toute soumission.
   Réglages posés côté Formgong : Turnstile DÉSACTIVÉ (pas de
   script Cloudflare sur le site), « signaux du navigateur »
   DÉSACTIVÉS (notre fetch maison ne passerait pas leurs filtres),
   conservation 30 jours, notifications e-mail immédiates vers
   contact@diwey.dev, vérifications serveur : nom (texte,
   obligatoire), email (format e-mail), message (texte,
   obligatoire) — les attributs name du JSX restent français.

   Le POST part en FormData vers https://formgong.com/submit avec
   l'access_key (PUBLIQUE par design, comme l'URL d'un formulaire
   Formspree — ce n'est pas un secret) et _lang=fr pour que les
   messages serveur arrivent en français. Honeypot : le champ
   « botcheck » (le nom reconnu par Formgong), gardé AUSSI côté
   client — rempli = bot = silence radio, on n'envoie même pas.

   Zéro script tiers chargé : pas de fg.js (analytics e-commerce,
   inutile ici), pas de Turnstile. Le JS assemblé de l'adresse
   e-mail (section Informations) reste en place : le mailto
   disparaît du FORMULAIRE, pas de la page. */
import { useEffect, useRef, useState } from 'react';
import CtaButton from '../../components/CtaButton/CtaButton';

/* Anti-bots : l'adresse est assemblée à l'exécution — ni le href
   ni le texte n'existent en clair dans le DOM servi. */
const MAIL_USER = 'contact';
const MAIL_TLD = 'diwey.dev';
const MAIL_TO = `${MAIL_USER}@${MAIL_TLD}`;

/* Formgong — endpoint générique + access_key publique. */
const FORM_ENDPOINT = 'https://formgong.com/submit';
const FORM_ACCESS_KEY = 'fk_wGF7WJufhE4AUSZdkboRzFkT';

export default function Contact() {
  /* Machine à états : idle → sending → (success | error).
     Le message de retour prend le focus en cas d'échec —
     retour clavier/lecteur d'écran, emprunté au snippet
     officiel Formgong (leur a11y était bonne, on la garde). */
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const feedback = useRef(null);

  useEffect(() => {
    if (failed && status) feedback.current?.focus();
  }, [failed, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return; // double-clic pendant l'envoi → rien

    const form = event.currentTarget;
    const data = new FormData(form);

    /* Honeypot côté client : un humain ne voit ni n'atteint ce
       champ (aria-hidden + tabIndex -1). Rempli = bot → on
       n'envoie rien, silence radio. */
    if (data.get('botcheck')) return;

    /* Validation maison (6/11) — noValidate côté JSX : plus
       d'infobulle native (« Veuillez compléter ce champ », non
       stylable, elle appartient au navigateur). checkValidity()
       fonctionne toujours sans l'UI native : valueMissing (champ
       vide) et typeMismatch (e-mail mal formé) sont lus depuis
       ValidityState, rien à réinventer. Message : rouge 12 sur la
       ligne du label, justifié à droite (voir _contact.scss).
       Focus sur le premier champ en erreur : remplace le
       comportement natif perdu avec noValidate (a11y). */
    const next = {};
    for (const field of form.elements) {
      if (!field.name) continue;
      if (field.validity.valueMissing) {
        next[field.name] = 'Complétez ce champ';
      } else if (field.name === 'email' && field.validity.typeMismatch) {
        next[field.name] = 'Adresse e-mail invalide';
      }
    }
    if (Object.keys(next).length) {
      setErrors(next);
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});

    setBusy(true);
    setFailed(false);
    setStatus('Envoi en cours…');

    try {
      const body = new FormData(form);
      body.set('access_key', FORM_ACCESS_KEY);
      body.set('_lang', 'fr');

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });
      const result = await response.json();

      setFailed(!result.success);
      setStatus(
        result.success
          ? 'Message envoyé — merci ! Réponse sous 48 heures.'
          : result.message || 'Échec de l’envoi. Veuillez réessayer.'
      );
      if (result.success) form.reset();
    } catch {
      /* Réseau coupé, serveur injoignable… */
      setFailed(true);
      setStatus('Connexion impossible. Veuillez réessayer.');
    } finally {
      setBusy(false);
    }
  }

  /* Efface l'erreur du champ dès que la personne retape dedans :
     le message est un rappel, pas une punition :p */
  function handleFieldChange(event) {
    const { name } = event.target;
    if (name && errors[name]) setErrors({ ...errors, [name]: '' });
  }

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

          {/* Bloc mail — libellé puis valeur cliquable. Le mailto
              reste ici : ouvrir le client mail du visiteur est le
              rôle naturel d'une adresse affichée. */}
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

          {/* noValidate : l'infobulle native est remplacée par nos
              messages rouges sur la ligne des labels (6/11).
              onChange : efface l'erreur du champ retapé. */}
          <form className="contact__form" onSubmit={handleSubmit}
                noValidate onChange={handleFieldChange} aria-busy={busy}>
            {/* Honeypot anti-bots — jamais visible, jamais rempli par un
                humain. Les lecteurs d'écran l'ignorent (aria-hidden), le
                clavier aussi (tabIndex -1). « botcheck » est le nom que
                Formgong reconnaît côté serveur (leur pipeline anti-spam). */}
            <div className="contact__honeypot" aria-hidden="true">
              <label htmlFor="botcheck">Ne pas remplir ce champ</label>
              <input id="botcheck" name="botcheck" type="text"
                     tabIndex={-1} autoComplete="off" />
            </div>

            <div className="contact__field">
              <div className="contact__field-head">
                <label htmlFor="nom">Votre nom</label>
                {errors.nom && (
                  <span className="contact__field-error" id="nom-error">{errors.nom}</span>
                )}
              </div>
              <input className="contact__input" id="nom" name="nom" type="text"
                     placeholder="Comment vous appelez-vous ?"
                     required autoComplete="name"
                     aria-invalid={errors.nom ? 'true' : undefined}
                     aria-describedby={errors.nom ? 'nom-error' : undefined} />
            </div>

            <div className="contact__field">
              <div className="contact__field-head">
                <label htmlFor="email">Votre e-mail</label>
                {errors.email && (
                  <span className="contact__field-error" id="email-error">{errors.email}</span>
                )}
              </div>
              <input className="contact__input" id="email" name="email" type="email"
                     placeholder="vous@exemple.fr"
                     required autoComplete="email"
                     aria-invalid={errors.email ? 'true' : undefined}
                     aria-describedby={errors.email ? 'email-error' : undefined} />
            </div>

            <div className="contact__field">
              <div className="contact__field-head">
                <label htmlFor="message">Votre message</label>
                {errors.message && (
                  <span className="contact__field-error" id="message-error">{errors.message}</span>
                )}
              </div>
              <textarea className="contact__input contact__input--area"
                        id="message" name="message" required rows={5}
                        placeholder="Votre idée, vos besoins, vos questions…"
                        aria-invalid={errors.message ? 'true' : undefined}
                        aria-describedby={errors.message ? 'message-error' : undefined} />
            </div>

            {/* Confidentialité — VRAIE depuis la bascule (6/11) : le message
                transite par un tiers (Formgong, UE), la mention le dit
                honnêtement. Pas d'adresse en clair ici : elle est assemblée
                à l'exécution dans Contacts directs, cette ligne ne la répète
                pas dans le DOM servi. Pas d'icône : le cadenas apportait
                peu (16px, muted), le texte se suffit (6/11). */}
            <div className="contact__privacy">
              <span>
                Votre message transite par Formgong (Union européenne) et me
                parvient sur mon email de contact. Il sert uniquement à vous répondre.
              </span>
            </div>

            <CtaButton type="submit" variant="primary" size="lg" disabled={busy}>
              {busy ? 'Envoi en cours…' : 'Envoyer le message'}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </CtaButton>

            {/* Retour d'envoi — role="status" : annoncé par les lecteurs
                d'écran. Focus en cas d'échec (voir useEffect).
                Trois teintes (7/11) : neutre pendant l'envoi (--muted),
                vert au succès (--accent), rouge (--error) à l'échec. La
                couleur est un écho du résultat, pas le seul porteur :
                le texte dit déjà tout (daltoniens, lecteurs d'écran). */}
            <p
              className={`contact__status${
                failed
                  ? ' contact__status--error'
                  : !busy && status
                    ? ' contact__status--success'
                    : ''
              }`}
              ref={feedback}
              role="status"
              tabIndex={-1}
            >
              {status}
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
