/* Page 404 — base de lecture : prototype (30/10), traduite dans le
   système réel (titres universalisés, tokens, BEM).

   La route `*` capte aussi les slugs de portfolio inconnus : toute
   URL qui ne correspond à rien atterrit ici, avec deux sorties
   (accueil, portfolio).

   Alignement : le prototype pose la 404 à GAUCHE (dérogation
   explicite au h1 centré par défaut) — à confirmer contre le Figma.
   Le h1 est NU : serif bold INK de la base (le prototype le
   posait en accent — vestige antérieur aux titres universalisés
   du 29/10, corrigé ici). */
import CtaButton from '../../components/CtaButton/CtaButton';

export default function NotFound() {
  return (
    <main className="page not-found">
      <p className="not-found__code">Erreur 404</p>

      <h1 className="not-found__title">Page introuvable.</h1>

      <p className="not-found__text">
        Le contenu que vous cherchez n'existe pas, ou a été déplacé.
        Les pages du site sont toutes accessibles depuis l'accueil.
      </p>

      <div className="not-found__actions">
        <CtaButton to="/" variant="primary" size="lg">
          <span>Retour à l'accueil</span>
          <span aria-hidden="true">↑</span>
        </CtaButton>
        <CtaButton to="/portfolio" variant="secondary" size="lg">
          <span>Voir mes projets</span>
          <span aria-hidden="true">↓</span>
        </CtaButton>
      </div>
    </main>
  );
}
