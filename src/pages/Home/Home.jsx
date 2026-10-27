/* Squelette — page Accueil (Hero, Démarche). Structure spécifiée le 21/10. */
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';

export default function Home() {
  return (
    <main className="page home">
      <section className="home__hero">
        <h1 className="home__title">Didier Wey — Développeur Frontend</h1>

        <div className="home__banner">
          <div className="home__banner-head">
            <p className="home__kicker">Projets sélectionnés</p>
            <Link className="pill-link" to="/portfolio">Tout voir →</Link>
          </div>

          <Carousel />
          <div className="home__carousel-slot">Carrousel — brique suivante</div>
        </div>

        {/* Brique 3 : Accroche + Carte d'identité */}
        {/* Brique 4 : Démarche */}
      </section>
    </main>
  );
}