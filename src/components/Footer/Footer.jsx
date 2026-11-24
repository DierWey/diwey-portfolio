import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------
Footer : le pied de page du site, sur fond accent-soft.
Quatre blocs dans un seul div de mise en page.

Le copyright : « © 2026 Diwey.dev - Le détail compte », en mono.

Les liens externes : 
GitHub et LinkedIn sont de vraies balises a avec target="_blank" et rel="noreferrer" ; le site
ne gère pas ces pages, elles s'ouvrent dans un autre onglet.
L'e-mail, en mailto, est sans target ni rel : rien à ouvrir dans un onglet, le mailto
réveille le logiciel de messagerie du visiteur.

L'ancre : « Retour en haut » pointe vers #top et reste dans la page courante.

Les pages légales : Mentions légales et Confidentialité, en Link react-router (navigation
interne).

Les liens externes et les pages du site  ne relèvent pas du même type de navigation : 
ils vivent dans deux nav séparés, chacun avec son aria-label. Un lecteur d'écran annonce deux
régions distinctes, au lieu d'une seule liste où tous les liens se suivent sans distinction.
------------------------------------------------------------------ */

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copyright">© 2026 Diwey.dev - Le détail compte</p>

        <nav className="footer__nav" aria-label="Liens externes">
          <a className="footer__link" href="https://github.com/DierWey" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            GitHub
          </a>
          <a className="footer__link" href="https://www.linkedin.com/in/didier-wey" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a className="footer__link" href="mailto:contact@diwey.dev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            E-mail
          </a>
        </nav>

        <a className="footer__link footer__link--top" href="#top">
          Retour en haut
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
        </a>

        <nav className="footer__legal" aria-label="Informations légales">
          <Link className="footer__legal-link" to="/mentions-legales">
            Mentions légales
          </Link>
          <Link className="footer__legal-link" to="/confidentialite">
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
