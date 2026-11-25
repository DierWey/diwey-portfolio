import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BrowserFrame from "../../components/BrowserFrame/BrowserFrame";
import CtaButton from "../../components/CtaButton/CtaButton";
import Capture from "../../components/Capture/Capture";
import { hasCapture } from "../../utils/captures";
import NotFound from "../NotFound/NotFound";
import data from "../../data/projects.json";

/* ============================================================
Fiche projet. /portfolio/:slug

Générique, pilotée par data/projects.json : une seule
page, six fiches. Ce JSX ne porte aucune décision de
style, seulement la structure ; tout le visuel vit dans
le SCSS colocalisé.

L'arrivée sur la page : 
- La carte cliquée fabrique l'URL /portfolio/{slug}.
- React Router colle l'adresse au gabarit ci-dessus, crée 
params ({ slug : la valeur de l'URL }) et rend ce composant.
- useParams lit params et la déstructuration en déplie la valeur
dans une variable slug.
- findIndex fait la jonction avec le JSON.

Structure :

Le fil d'Ariane : parent cliquable en pilule, page
courante en accent, non cliquable.

Le cadre navigateur (BrowserFrame lg) et sa capture
adaptative : Capture réelle si le rôle `preview` existe
pour le projet, placeholder sinon, même loi de repli
durable que le carrousel et la carte. alt="" : le h1
porte le nom, la capture est décorative, elle ne répète
rien au lecteur d'écran.

Le h1 pleine largeur (title complet du JSON).

La grille deux colonnes en desktop, une seule en
tablette et mobile : le DOM reste en ordre mono-colonne
(intro, fiche technique, sections), la grille replace
l'aside en seconde colonne sur toute la hauteur.

h3 court (01 /) assumé (l'audit n'a rien signalé).

La fiche technique : liste de description dl, des paires
clé/valeur (Type reprend role, Niveau reprend level,
Année reprend year, Approche reprend approach).

Le pied : Tous les projets (bouton secondaire) et Projet
suivant (bouton primaire, qui boucle sur le premier projet
après le dernier).

Fonctionnalités :

Le scroll remis en haut à chaque changement de fiche :
la navigation de fiche en fiche ne recharge pas la
page, le navigateur ne remet donc pas le scroll tout
seul (le Hook vit avant le retour anticipé : règle
des hooks).

Un slug inconnu rend la 404 : la route * capte aussi,
mais la fiche reste robuste aux liens internes
malformés.

Le nom court du fil d'Ariane et du bouton "Projet suivant" suit
le gabarit « Nom — sous-titre », séparé au tiret long,
avec repli natif si le tiret manque.
============================================================ */


function ProjectDetail() {

  const { slug } = useParams();  // const slug = useParams().slug;
  const { projects } = data;     // const projects = data.projects;

  /* Navigation SPA : de fiche en fiche, pas de chargement complet, le
  navigateur ne remet pas le scroll en haut tout seul.
  Ce repositionnement du scroll à chaque nouveau projet détaillé est un
  effet de bord. On le fait donc vivre dans un `useEffect`, exécuté après
  le rendu, au rythme du tableau de dépendances `[slug]` : à chaque nouvelle
  fiche (ou à l'arrivée), React affiche d'abord le contenu, puis remet la 
  fenêtre en haut. */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  /* Retrouver et stocker (dans idx) la position (l'index) du projet affiché dans le tableau
  projects, en comparant chaque fiche au slug de l'URL. */
  const idx = projects.findIndex((project) => project.slug === slug);
  
  /* Lorsque le slug de l'URL ne correspond à aucun projet du JSON, findIndex rend -1 et
  la page rend la page NotFound (404 maison) plutôt qu'une fiche vide. 
  La route * capte aussi les URLs inconnues, mais cette garde rend la fiche robuste même
  servie avec un slug défectueux (un lien interne malformé) : elle n'affiche jamais une
  fiche cassée. */
  if (idx === -1) {
    return <NotFound />;
  }

  // project = la fiche entière se trouvant à la position idx dans le tableau projects
  const project = projects[idx];  
  /* next = la fiche suivante dans l'ordre du JSON. Mais le modulo (%) fait boucler la navigation
   afin que la dernière fiche ramène à la première, sans jamais déborder du tableau. */
  const next = projects[(idx + 1) % projects.length];

  /* Nom court du projet. Dans le JSON, le title se lit « Nom — sous-titre ».
  split découpe la chaîne au niveau du tiret long et [0] garde la première partie
  (le nom seul).
  Sans tiret dans le title, split rend la chaîne entière dans une seule part.
  [0] garde alors le title entier. */
  const name = project.title.split(" — ")[0];

  return (
    <section className="page project-detail">
      {/* Le fil d'Ariane montre d'où l'on vient : le parent Portfolio
      est cliquable, la page courante ne l'est pas. */}
      <nav className="project-detail__crumbs" aria-label="Fil d'Ariane">
        <Link to="/portfolio" className="pill-link">
          Portfolio
        </Link>
        <span className="project-detail__crumbs-sep" aria-hidden="true"> / </span>
        <span className="project-detail__crumbs-current">{name}</span>
      </nav>

      {/* Cadre navigateur et capture adaptative. Si une image avec le rôle preview
      existe pour ce projet, on sert la vraie capture. Sinon, on sert le placeholder.
      C'est la même règle de repli que pour le carrousel et la carte. */}
      <div className="project-detail__frame">
        <BrowserFrame url={`${project.slug}.diwey.dev`} size="lg">
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
        {/* Bloc 1 de la grille : la description du projet puis ses badges.
        Ces derniers viennent de la propriété stack du JSON. */}
        <div className="project-detail__intro">
          <p className="project-detail__desc">{project.desc}</p>
          <ul className="project-detail__badges">
            {project.stack.map((tech) => (
              <li key={tech} className="project-detail__badge">{tech}</li>
            ))}
          </ul>
        </div>

        {/* La fiche technique vit dans un aside, une région complémentaire du contenu.
        Sur grand écran, la grille la place en seconde colonne. 
        En tablette et mobile, elle revient dans le flux de la page, entre le Bloc 1 et
        la section Contexte. C'est l'ordre du DOM qui décide. */}
        <aside className="project-detail__sheet">
          {/* Un vrai h2 qui titre une région complémentaire pour les lecteurs d'écran.
          Le SCSS lui donne le visuel sobre d'un label via .project-detail__sheet-label. */}
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
              <dd className="project-detail__sheet-value">
                {/* Approche est la seule clé à valeur multiple. Chaque point de
                project.approach devient un paragraphe .project-detail__approach-item.
                Le tiret d'introduction ne vit pas ici : il est ajouté par le SCSS. */}
                {project.approach.map((point, i) => (
                  <p key={i} className="project-detail__approach-item">
                    {point}
                  </p>
                ))}
              </dd>
            </div>
          </dl>
          <div className="project-detail__sheet-actions">
            {/* Les boutons vivent ou meurent selon les données du projet.
            "Voir la démo" n'apparaît que si project.demo existe : sans démo, rien.
            "Code source" suit la même règle, mais son absence laisse une mention à la
            place : "// projet de formation — sur demande" (son style vit dans la
            classe .project-detail__sheet-norepo du SCSS). */}
            {project.demo ? (
              <CtaButton href={project.demo} target="_blank" rel="noreferrer" size="sm">
                <span>Voir la démo</span>
                <svg className="id-card__cv-icon" viewBox="0 0 24 24" width="16"
                     height="16" fill="none" stroke="currentColor"
                     strokeWidth="2.5" strokeLinecap="round"
                     strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
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

        {/* Le corps de la fiche. L'espacement entre ses sections est porté par le SCSS. */}
        <div className="project-detail__body">

          {/* Section Contexte : un titre (h2) et un paragraphe simple. */}
          <section className="project-detail__section">
            <div className="project-detail__section-head">
              <h2>Contexte</h2>
              <span className="project-detail__rule" aria-hidden="true"></span>
            </div>
            <p className="project-detail__context">{project.context}</p>
          </section>

          {/* Section Fonctionnalités : un titre (h2) et la liste des fonctionnalités
          issues de la propriété features du JSON. */}
          <section className="project-detail__section">
            <div className="project-detail__section-head">
              <h2>Fonctionnalités</h2>
              <span className="project-detail__rule" aria-hidden="true"></span>
            </div>
            <ul className="project-detail__list">
              {project.features.map((feature, index) => (
                <li key={index} className="project-detail__item">
                  {/* Titre h3 court, appliqué au groupe "numérotation + /" 
                  La numérotation est déterminée par la position de la fonctionnalité
                  dans la liste (index + 1), transformée en numérotation à deux chiffres
                  par padStart (1 devient 01). */}
                  <h3 className="project-detail__num">
                    {String(index + 1).padStart(2, "0")} /
                  </h3>
                  <span className="project-detail__item-text">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section Méthode : un titre (h2) et la liste des étapes issues de la
          propriété method du JSON. */}
          <section className="project-detail__section">
            <div className="project-detail__section-head">
              <h2>Méthode</h2>
              <span className="project-detail__rule" aria-hidden="true"></span>
            </div>
            <ul className="project-detail__list">
              {project.method.map((step, index) => (
                <li key={index} className="project-detail__item">
                  {/* Titre h3 court, appliqué au groupe "numérotation + /" 
                  La numérotation est déterminée par la position de l'étape dans la liste
                  (index + 1), transformée en numérotation à deux chiffres par padStart
                  (1 devient 01). */}
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
      
      {/* Le pied de la page propose deux boutons de navigation. 
      "Tous les projets" ramène à la grille.
      "Projet suivant" mène à next, la fiche calculée plus haut par le modulo
      (dernière fiche ramenée à la première). */}
      <div className="project-detail__footer">
        <CtaButton to="/portfolio" variant="secondary">
          <svg className="project-detail__footer-arrow project-detail__footer-arrow--left"
               viewBox="0 0 24 24" width="16" height="16" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
               strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
          </svg>
          Tous les projets
        </CtaButton>
        <CtaButton to={`/portfolio/${next.slug}`}>
          Projet suivant : {next.title.split(" — ")[0]}
          <svg className="project-detail__footer-arrow project-detail__footer-arrow--right"
               viewBox="0 0 24 24" width="16" height="16" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
               strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </CtaButton>
      </div>
    </section>
  );
}

export default ProjectDetail;
