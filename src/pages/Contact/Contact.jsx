/* Page Contact. 

Structure : 

Le h1 centré, puis deux sections. 
À gauche, les contacts directs (384) : l'adresse e-mail, le
profil LinkedIn. 
À droite, les échanges (768) : le pitch, puis le formulaire. 
Desktop : 384 + 96 + 768 = 1248. 
Tablette et mobile : empilées, écart 96 en tablette, 48 en mobile.

Fonctionnalités :

Le formulaire envoie vers Formgong, un service de réception de
formulaires retenu pour sa juridiction UE explicite (l'alternative
hébergeait en UE mais restait une société US, donc CLOUD Act).
Le POST part en FormData vers le service, avec l'access_key publique
par design (comme l'URL d'un formulaire hébergé, ce n'est pas un
secret) et _lang=fr pour que les messages serveur arrivent en français.
Aucun script tiers chargé : la page porte ses sécurités elle-même.

Le honeypot « botcheck » : 
Caché aux humains (jamais visible, aria-hidden, tabIndex -1), rempli par un bot.
Deux barrières : côté client, on n'envoie même pas ; 
côté serveur, le service reconnaît le nom et jette.

Validation maison, en français stylable : 
Le navigateur gardait son infobulle native (« Veuillez compléter ce champ »), non stylable. 
noValidate coupe cette UI, checkValidity lit toujours l'état du champ.
La règle e-mail maison (expression régulière) est plus stricte que celle
du navigateur (un « x@y » sans point dans le domaine passerait
le checkValidity ; avec la règle maison, il ne part pas). Cette règle
maison doit être au moins aussi stricte que celle du serveur, sinon le serveur
rejette ce que le client croyait bon.

Les retours : 
Message rouge sur la ligne du label, effacé dès que la personne retape dans le champ.
Le message de statut est role="status", annoncé par les lecteurs d'écran, avec focus
dessus en cas d'échec. 
La couleur (--muted / --accent / --error) est un écho du résultat, jamais le seul
porteur : le texte dit déjà tout.

Anti-bots, contacts directs : 
L'adresse e-mail est assemblée à l'exécution (voir les constantes MAIL), ni le href
ni le texte n'existent en clair dans le DOM servi. 
Contrairement au bouton d'envoi du formulaire, le mailto reste : ouvrir le client
mail du visiteur est le rôle naturel d'une adresse affichée.

Confidentialité : 
Le message transite par un tiers (le service, UE), la mention le dit honnêtement,
et l'adresse n'est pas répétée en clair dans cette ligne puisqu'elle est assemblée
dans la section voisine. */

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

/* La règle e-mail maison : au moins un caractère de chaque
   côté de l'arobase, un point dans le domaine, pas d'espace
   (le contrat complet vit dans l'en-tête du fichier). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  /* Machine à états : idle, sending, puis success ou error.
     En cas d'échec, le focus part sur le message de retour (useEffect) :
     le clavier et le lecteur d'écran le trouvent sans chercher
     (idée reprise de la doc du service, dont l'a11y était
     solide). */
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

    /* Validation maison : valueMissing pour les champs vides,
       la règle EMAIL_RE pour l'e-mail ; le focus va au premier
       champ en erreur, il remplace le geste natif perdu avec
       noValidate (le contrat complet vit dans l'en-tête). */
    
    /* objet vide qui servira de relevé d'erreur: une clé par champ fautif,
    la clé étant le name du champ, la valeur étant le message à afficher. */
    const next = {};
    /* La boucle passe dans chaque champ du formulaire, dans l'ordre du JSX :
    botcheck (le honeypot), nom, email, message. Un champ sans attribut name
    est ignoré (continue saute au suivant) */ 
    for (const field of form.elements) {
      if (!field.name) continue;
      /* Premier test : le champ est-il vide alors qu'il est requis ? */
      if (field.validity.valueMissing) {
        next[field.name] = 'Complétez ce champ';
      /* Deuxième test, seulement si le premier est faux (le champ est rempli) : 
      si c'est le champ e-mail et que sa valeur ne passe pas la regex maison,
      le relevé prend « Adresse e-mail invalide » */
      } else if (field.name === 'email' && !EMAIL_RE.test(field.value.trim())) {
        next[field.name] = 'Adresse e-mail invalide';
      }
    }
    // Si le relevé d'erreurs contient quelque chose
    if (Object.keys(next).length) {
      setErrors(next); // le relevé part dans l'état React, ce qui rend visibles les phrases rouges
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus(); //Le focus va sur le premier champ fautif
      return; // on s'arrête là, le formulaire ne part pas
    }
    setErrors({}); // Si le relevé d'erreurs vide, tout est bon

    setBusy(true); // bouton d'envoi n'est plus cliquaable tant que l'envoi est en cours
    setFailed(false); 
    setStatus('Envoi en cours…');

    // Envoi du formulaire
    try {
      // Le colis : tous les champs nommés du formulaire
      const body = new FormData(form);
      body.set('access_key', FORM_ACCESS_KEY);
      body.set('_lang', 'fr');
      // Envoi du colis vers l'url du service (de diwey.dev vers formgong.com)
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      // le verdict : réponse du service (succés ou échec) qui conditionne le message affiché
      const result = await response.json();
      setFailed(!result.success);
      setStatus(
        result.success
          ? 'Message envoyé — merci ! Réponse sous 48 heures.'
          : result.message || 'Échec de l’envoi. Veuillez réessayer.'
      );
      if (result.success) form.reset();
    } catch {
      /* On attrape l'absence de réponse (réseau coupé, serveur injoignable : même échec,
         autre message. */
      setFailed(true);
      setStatus('Connexion impossible. Veuillez réessayer.');
    } finally {
      setBusy(false);
    }
  }

  /* Efface l'erreur du champ dès que la personne retape dedans :
     le message est un rappel, pas une punition */
  function handleFieldChange(event) {
    const { name } = event.target;
    if (name && errors[name]) setErrors({ ...errors, [name]: '' });
  }

  return (
    <main className="page contact">
      <h1>Me contacter</h1>

      <div className="contact__infos-form">
        {/* ---------- SECTION INFORMATIONS (384px) ---------- */}
        <section className="contact__informations">
          <div className="contact__head">
            <h2>Contacts directs</h2>
            <span className="contact__rule" aria-hidden="true"></span>
          </div>

          {/* Bloc mail : libellé puis valeur cliquable, le mailto
              ouvre le client mail du visiteur. */}
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

          {/* Bloc LinkedIn */}
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

        {/* ---------- SECTION ÉCHANGES (768 px) ---------- */}
        <section className="contact__echanges">
          <div className="contact__head">
            <h2>Échanges</h2>
            <span className="contact__rule" aria-hidden="true"></span>
          </div>

          <p className="contact__pitch">
            Un projet, une mission, un entretien ? Écrivez-moi directement
            via le formulaire — je réponds sous 48 heures.
          </p>

          {/* noValidate coupe l'UI native du navigateur ; onChange
              efface l'erreur du champ retapé dès la frappe. */}
          <form className="contact__form" onSubmit={handleSubmit}
                noValidate onChange={handleFieldChange} aria-busy={busy}>
            {/* Honeypot anti-bots : jamais visible, jamais rempli
                par un humain. Les lecteurs d'écran l'ignorent
                (aria-hidden), le clavier aussi (tabIndex -1).
                « botcheck » est le nom que le service reconnaît
                côté serveur (son canal anti-spam). */}
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

            {/* Confidentialité : la mention honnête du transit, sans
                adresse en clair ni icône (le texte se suffit) ; le
                contrat complet vit dans l'en-tête du fichier.  */}
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

            {/* Retour d'envoi : role="status" annonce le message aux
                lecteurs d'écran, avec focus en cas d'échec (voir
                useEffect). Trois teintes : muted pendant l'envoi,
                accent au succès, error à l'échec. La couleur est un
                écho du résultat, jamais le seul porteur : le texte
                dit déjà tout. */}
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
