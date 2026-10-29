/* Page Accueil — Hero (h1, bannière, carrousel, accroche, identité) + Démarche.
   Structure spécifiée le 21/10. */
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import CtaButton from '../../components/CtaButton/CtaButton';
import logo from '../../assets/pictures/logo_DiD.webp';

export default function Home() {
  return (
    <main className="page home">
      {/* ---------- HERO ---------- */}
      <section className="home__hero">
        <h1 className="home__title">Didier Wey — Développeur Frontend</h1>

        <div className="home__banner">
          <div className="home__banner-head">
            <p className="home__kicker">Projets sélectionnés</p>
            <Link className="pill-link" to="/portfolio">Tout voir →</Link>
          </div>

          <Carousel />
        </div>

        {/* Accroche + Carte d'identité */}
        <div className="home__about">
          {/* --- Accroche --- */}
          <div className="pitch">
            <p className="pitch__promise">Chaque pixel a une raison d'être.</p>
            <div className="pitch__text">
              <p>
                J'ai découvert le web au début des années 2000, puis mon parcours m'a mené
                des bibliothèques à la co-gérance d'une société d'informatique, où j'ai
                conçu l'identité de l'entreprise et supervisé la création de son site.
              </p>
              <p>
                C'est ce fil rouge — organiser l'information pour la rendre claire et
                utilisable — qui m'a ramené au développement.
              </p>
              <p>
                En formation Intégrateur Web chez OpenClassrooms (2025-2026), j'ai consolidé
                HTML, CSS, JavaScript et React, avec une appétence pour l'accessibilité et
                la performance.
              </p>
              <p>
                Aujourd'hui, je cherche un poste en entreprise ou en agence, au sein d'une
                équipe où chaque détail compte.
              </p>
            </div>
            <div className="pitch__actions">
              <CtaButton to="/portfolio" variant="primary" size="lg">
                Voir mes projets
              </CtaButton>
              <CtaButton to="/contact" variant="secondary" size="lg">
                Me contacter
              </CtaButton>
            </div>
          </div>

          {/* --- Carte d'identité --- */}
          <aside className="id-card">
            <div className="id-card__identity">
              <img src={logo} alt="" className="id-card__mark" />
              <div className="id-card__names">
                <p className="id-card__name">
                  Diwey<span className="id-card__tld">.dev</span>
                </p>
                <p className="id-card__role">Développeur Frontend</p>
              </div>
            </div>

            <dl className="id-card__meta">
              <div className="id-card__row">
                <dt>Spécialité</dt>
                <dd>Interfaces web</dd>
              </div>
              <div className="id-card__row">
                <dt>Formation</dt>
                <dd>Intégrateur Web (OpenClassrooms)</dd>
              </div>
              <div className="id-card__row">
                <dt>Stack</dt>
                <dd>SASS - JavaScript - React - Vite</dd>
              </div>
              <div className="id-card__row">
                <dt>Approche</dt>
                <dd>Pixel-perfect - Accessible - Responsive</dd>
              </div>
            </dl>

            <div className="id-card__availability">
              <p className="id-card__status">
                <span className="id-card__dot" aria-hidden="true"></span>
                Disponible - 2026
              </p>
              <a className="id-card__cv" href="/cv.pdf" download>
                Télécharger le CV
                <svg className="id-card__cv-icon" viewBox="0 0 24 24" width="16"
                     height="16" fill="none" stroke="currentColor"
                     stroke-width="2.5" stroke-linecap="round"
                     stroke-linejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- DÉMARCHE — section 2 (écart 96 porté par elle) ---------- */}
      <section className="home__approach">
        {/* Brique 4 : h2 « Ma démarche » + filet + 3 principes */}
      </section>
    </main>
  );
}