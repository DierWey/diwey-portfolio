import { Link } from "react-router-dom";
import BrowserFrame from "../BrowserFrame/BrowserFrame";
import Capture from "../Capture/Capture";
import { hasCapture } from "../../utils/captures";
import "./_project-card.scss";

/* ------------------------------------------------------------------
ProjectCard : la carte projet de la grille Portfolio. Un seul objet, 
la carte entière, et deux blocs dedans.

Le premier bloc, l'aperçu : fond accent-soft, padding 24, le BrowserFrame
en taille sm y rend la capture. Sa taille n'est jamais fixée en code : 
le flux et le ratio porté par la zone capture la calculent.

Le second bloc, les infos : padding 24, cinq lignes écartées de 16.
Les badges techno (la donnée stack du JSON,pilules accent-soft à bord accent en mono 16).
Le nom (h2 sémantique, dont le style est neutralisé dans _project-card.scss : ink au repos,
l'interactivité se signale au survol seul).
La description (champ desc du JSON, Inter ink 16 constant à tous les paliers).
La ligne CTA « Voir le projet », justifiée à droite : elle dit pourquoi la carte est
cliquable, visible au repos, donc aussi au tactile et pour les lecteurs d'écran,
le survol n'existant pas au tactile. 
Et le bottom, filet haut : role et year en space-between, mono 12 ink-muted,
collé en bas de carte.

Contrat de lien : la carte entière est un Link, et le CTA est une ligne de texte de ce lien,
jamais un lien imbriqué (un lien dans un lien est du HTML invalide, et la flèche seule est
en aria-hidden). Le texte « Voir le projet » enrichit automatiquement le nom accessible du
lien (« ohmyfood… Voir le projet »), sans aria ajouté.

Le fil conducteur des captures : la barre de navigateur simulée est le composant BrowserFrame,
la prop est url (une chaîne complète) et pas slug, la carte construit l'adresse 
{slug}.diwey.dev elle-même. Capture réelle si le rôle card existe pour le projet, placeholder
sinon : repli de résilience, jamais de trou. L'image porte alt="" : le nom accessible vit dans
les textes (nom et CTA), la capture ne répète rien au lecteur d'écran.

Le nom affiché : la partie du title avant « — », même loi que le fil d'Ariane de la fiche projet ;
sans tiret long, le split rend le title entier, repli natif voulu.

Survol : la bordure passe accent, le nom passe accent, la pilule du CTA se révèle (trois signaux),
sans filet ni mouvement ; le pourquoi du clic est porté par le label, pas par un geste. Le style
vit dans _project-card.scss.
------------------------------------------------------------------ */

export default function ProjectCard({ project }) {
  const { slug, title, stack, role, year, desc } = project;
  /* Nom affiché : la partie du "title" du json avant le tiret long
  même loi que le fil d'Ariane de la fiche projet). */
  const name = title.split(" — ")[0];

  return (
    <Link to={`/portfolio/${slug}`} className="card">
      <div className="card__preview">
        {/* BrowserFrame : la prop reçoit l'adresse complète,
        la carte la construit à partir de slug. */}
        <BrowserFrame size="sm" url={`${slug}.diwey.dev`}>
          {/* Capture réelle si le rôle card existe,
              placeholder sinon : repli de résilience. */}
          {hasCapture(slug, "card") ? (
            <Capture slug={slug} role="card" alt="" className="card__image" />
          ) : (
            <div className="card__capture">
              <span className="card__placeholder">card.webp — {name}</span>
            </div>
          )}
        </BrowserFrame>
      </div>

      <div className="card__info">
        {/* Badges techno : la donnée stack du JSON */}
        <ul className="card__badges">
          {stack.map((tech) => (
            <li key={tech} className="card__badge">{tech}</li>
          ))}
        </ul>

        {/* Nom : h2 sémantique, chaque carte est une mini-section (titre
        + description + visuel), le lecteur d'écran en fait une entrée de
        plan ; l'override ink vit dans _project-card.scss. */}
        <h2 className="card__name">{name}</h2>

        {/* Description : champ desc du JSON, 16 constant */}
        <p className="card__text">{desc}</p>

        {/* CTA : ligne justifiée à droite, entre description et bottom.
        Il vit dans le lien-carte, son texte enrichit le nom accessible
        du lien sans aria additionnel. La flèche est ornementale :
        aria-hidden, jamais lue. */}
        <p className="card__cta">
          <span>Voir le projet</span>
          <svg className="card__cta-arrow" viewBox="0 0 24 24" width="16"
                height="16" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </p>

        {/* Bottom : le type ("role" du json) et l'année, collés au bas de la carte */}
        <div className="card__footer">
          <span className="card__meta">{role}</span>
          <span className="card__meta">{year}</span>
        </div>
      </div>
    </Link>
  );
}
