import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BrowserFrame from "../../components/BrowserFrame/BrowserFrame";
import CtaButton from "../../components/CtaButton/CtaButton";
import Capture from "../../components/Capture/Capture";
import { hasCapture } from "../../utils/captures";
import NotFound from "../NotFound/NotFound";
import data from "../../data/projects.json";

/* ============================================================
   Fiche projet — /portfolio/:slug
   Générique, pilotée par data/projects.json (charte 21/10) :
   une seule page, six fiches. Toutes les cotes et décisions
   visuelles sont relevées dans la charte du 6/11 (Figma fait foi)
   et implémentées dans le SCSS colocalisé — ce JSX ne porte
   aucune décision de style, seulement la structure.

   Structure (relevé 6/11) :
   - Fil d'Ariane (parent cliquable .pill-link, courante accent)
   - Cadre navigateur (BrowserFrame lg) + capture adaptative
     16:10 / 3:4 / 9:16 — Capture réelle si le rôle `preview`
     existe pour le projet (chantier captures 10/11), placeholder
     sinon — retrait progressif, projet par projet, comme le
     carousel et la carte. alt="" : le h1 porte le nom, la capture
     est décorative, elle ne répète rien au lecteur d'écran.
   - h1 pleine largeur (title complet du JSON)
   - Grille 2 colonnes desktop / 1 colonne tablette-mobile :
     DOM en ordre mono-colonne (intro → fiche technique → sections),
     le grid replace l'aside en 2e colonne sur toute la hauteur
   - Items : h3 « 01 / » seul (exception 29/10 confirmée 6/11) +
     texte frère — même ligne, même taille, mono ↔ Inter
   - Fiche technique : dl (clé/valeur) — Type ← role, Niveau ←
     level, Année ← year, Approche ← approach
   - Pied : ← Tous les projets (secondaire) + Projet suivant
     (primaire, boucle sur le 1er projet après le dernier)

   A11Y — question OUVERTE (à l'audit WAVE) : un h3 « 01 / » est
   un titre muet pour un lecteur d'écran. Si WAVE le signale,
   ajouter dans le h3 un <span className="visually-hidden">
   informatif (« Fonctionnalité 01 » / « Méthode 01 »), sans
   toucher au visuel. Ne rien changer avant l'audit.
   ============================================================ */

function ProjectDetail() {
  const { slug } = useParams();
  const { projects } = data;

  // Navigation SPA : une fiche → l'autre ne fait pas de chargement
  // complet, le navigateur ne reset donc pas le scroll tout seul.
  // (Hook AVANT le retour anticipé : règle des hooks.)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const idx = projects.findIndex((project) => project.slug === slug);

  // Slug inconnu → 404 (la route * capte aussi, mais la fiche reste
  // robuste aux liens internes malformés).
  if (idx === -1) {
    return <NotFound />;
  }

  const project = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  // Nom court : même loi que la carte et le fil d'Ariane (31/10) —
  // le title suit le gabarit « Nom — sous-titre », split au tiret
  // long ; sans tiret, split renvoie le title entier (fallback natif).
  const name = project.title.split(" — ")[0];

  return (
    <section className="page project-detail">
      {/* Fil d'Ariane — repère de position : parent cliquable,
          page courante non cliquable (tranché 24/10) */}
      <nav className="project-detail__crumbs" aria-label="Fil d'Ariane">
        <Link to="/portfolio" className="pill-link">
          Portfolio
        </Link>
        <span className="project-detail__crumbs-sep" aria-hidden="true"> / </span>
        <span className="project-detail__crumbs-current">{name}</span>
      </nav>

      {/* Cadre navigateur + capture adaptative (chantier captures
          10/11) : le rôle `preview` sert la vraie image si elle
          existe pour ce projet, le placeholder sinon — pilote
          ohmyfood d'abord, retrait progressif pour les 5 autres. */}
      <div className="project-detail__frame">
        <BrowserFrame slug={project.slug} size="lg">
          {hasCapture(project.slug, "preview") ? (
            <Capture
              slug={project.slug}
              role="preview"
              alt=""
              className="project-detail__image"
            />
          ) : (
            <div className="project-detail__capture">
              <span className="project-detail__capture-placeholder">
                capture — à venir
              </span>
            </div>
          )}
        </BrowserFrame>
      </div>

      <h1 className="project-detail__title">{project.title}</h1>

      <div className="project-detail__grid">
        {/* Bloc 1 : description + badges — les seuls badges de la
            page (charte 21/10), donnée `stack` du JSON */}
        <div className="project-detail__intro">
          <p className="project-detail__desc">{project.desc}</p>
          <ul className="project-detail__badges">
            {project.stack.map((tech) => (
              <li key={tech} className="project-detail__badge">{tech}</li>
            ))}
          </ul>
        </div>

        {/* FICHE TECHNIQUE — aside ; en tablette/mobile, il vit
            dans le flux entre le bloc 1 et Contexte (ordre du DOM) */}
        <aside className="project-detail__sheet">
          {/* h2 (promotion 6/11) : la FICHE TECHNIQUE titre une vraie
              région complémentaire — WAVE avait raison, ce n'est pas
              un label décoratif. Le visuel est inchangé : les règles
              .project-detail__sheet-label écrasent la base h2
              (serif accent 32) — vérifier que famille/graisse/
              couleur restent bien overridées dans le SCSS. */}
          <h2 className="project-detail__sheet-label">Fiche technique</h2>
          <dl className="project-detail__sheet-list">
            <div className="project-detail__sheet-row">
              <dt className="project-detail__sheet-key">Type</dt>
              <dd className="project-detail__sheet-value">{project.role}</dd>
            </div>
            <div className="project-detail__sheet-row">
              <dt className="project-detail__sheet-key">Niveau</dt>
              <dd className="project-detail__sheet-value">{project.level}</dd>
            </div>
            <div className="project-detail__sheet-row">
              <dt className="project-detail__sheet-key">Année</dt>
              <dd className="project-detail__sheet-value">{project.year}</dd>
            </div>
            <div className="project-detail__sheet-row">
              <dt className="project-detail__sheet-key">Approche</dt>
              <dd className="project-detail__sheet-value">{project.approach}</dd>
            </div>
          </dl>
          <div className="project-detail__sheet-actions">
            {project.demo ? (
              <CtaButton href={project.demo} target="_blank" rel="noreferrer" size="sm">
                Voir la démo ↗
              </CtaButton>
            ) : null}
            {project.repo ? (
              <CtaButton
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                size="sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                </svg>
                Code source
              </CtaButton>
            ) : (
              <p className="project-detail__sheet-norepo">
                {"// projet de formation — sur demande"}
              </p>
            )}
          </div>
        </aside>

        {/* Sections — Contexte (paragraphe nu) puis les deux listes
            numérotées ; inter-sections portées par le SCSS */}
        <div className="project-detail__body">
          <section className="project-detail__section">
            <h2 className="project-detail__section-title">Contexte</h2>
            <p className="project-detail__context">{project.context}</p>
          </section>

          <section className="project-detail__section">
            <h2 className="project-detail__section-title">Fonctionnalités</h2>
            <ul className="project-detail__list">
              {project.features.map((feature, index) => (
                <li key={index} className="project-detail__item">
                  <h3 className="project-detail__num">
                    {String(index + 1).padStart(2, "0")} /
                  </h3>
                  <span className="project-detail__item-text">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="project-detail__section">
            <h2 className="project-detail__section-title">Méthode</h2>
            <ul className="project-detail__list">
              {project.method.map((step, index) => (
                <li key={index} className="project-detail__item">
                  <h3 className="project-detail__num">
                    {String(index + 1).padStart(2, "0")} /
                  </h3>
                  <span className="project-detail__item-text">{step}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="project-detail__footer">
        <CtaButton to="/portfolio" variant="secondary">
          ← Tous les projets
        </CtaButton>
        <CtaButton to={`/portfolio/${next.slug}`}>
          Projet suivant : {next.title.split(" — ")[0]} →
        </CtaButton>
      </div>
    </section>
  );
}

export default ProjectDetail;
