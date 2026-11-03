import { Link } from "react-router-dom";
import BrowserFrame from "../BrowserFrame/BrowserFrame";
import "./_project-card.scss";

/* ------------------------------------------------------------------
   ProjectCard — carte projet de la grille Portfolio.

   Structure (relevé Figma 31/10) — deux blocs :
   - Aperçu  : fond accent-soft, padding 24. Le BrowserFrame (sm,
     5 points, chrome 32) y rend la capture — 336×173 desktop /
     276×141 tablette / 279×143 mobile, jamais fixée en code (le
     flux et le ratio de l'image la calculent).
   - Infos   : padding 24, 4 blocs écartés de 16 —
       1. Top    : badges techno (donnée `stack`), pilules
          accent-soft / bord accent 1px / rayon 999 / padding
          4/8 / mono 16 accent
       2. Nom    : libellé du lien-carte — serif bold 24 ink.
          TRANCHÉ 31/10 : le Nom N'EST PAS un titre. La carte ne
          porte AUCUN heading : la hiérarchie vit dans le h1 de la
          page, le Nom est un libellé de lien.
       3. Description : Inter ink 16 CONSTANT tous paliers (31/10)
          — champ `desc` du JSON, PAS `approach` (design, fiche)
       4. Bottom : bordure haute 1px line, padding-top 8, type
          (`role`) + année (`year`) en space-between, mono 12
          ink-muted — poussé en BAS de la carte (hauteur commune,
          31/10 : les cartes ne dansent pas selon leur texte)

   Contrats :
   - La barre chrome de la carte EST le composant BrowserFrame
     (size="sm", slug pour la pilule) — aucun chrome codé en dur.
   - La carte porte SEULE bordure + rayon 12 (constant) et fond
     surface. Le BrowserFrame reste neutre : ni bordure ni rayon.
   - Survol : contour → accent, 250 ms ease-out, SANS mouvement.
     La carte entière est le lien.
   - La capture est un PLACEHOLDER visible en attendant les .webp
     (chemin futur : assets/pictures/{slug}/card-{palier}.webp).
   ------------------------------------------------------------------ */
export default function ProjectCard({ project }) {
  const { slug, title, stack, role, year, desc } = project;
  /* Nom affiché = partie du title avant « — » (même loi que le fil
     d'Ariane de la fiche projet). Sans tiret long, split renvoie
     le title entier — fallback natif, voulu. */
  const name = title.split(" — ")[0];

  return (
    <Link to={`/portfolio/${slug}`} className="card">
      <div className="card__preview">
        {/* BrowserFrame : la prop est `url` (chaîne complète), pas `slug` —
            la carte construit l'adresse {slug}.diwey.dev elle-même */}
        <BrowserFrame size="sm" url={`${slug}.diwey.dev`}>
          {/* Placeholder capture — remplacer par <picture>/<img>
              (336×173 / 276×141 / 279×143) + srcset 1x/2x */}
          <div className="card__capture">
            <span className="card__placeholder">card.webp — {name}</span>
          </div>
        </BrowserFrame>
      </div>

      <div className="card__info">
        {/* Top — badges techno */}
        <ul className="card__badges">
          {stack.map((tech) => (
            <li key={tech} className="card__badge">{tech}</li>
          ))}
        </ul>

        {/* Nom — title tronqué au tiret long (loi du fil d'Ariane),
            libellé de lien, PAS un titre (31/10) */}
        <p className="card__name">{name}</p>

        {/* Description — champ `desc` du JSON, 16 constant */}
        <p className="card__text">{desc}</p>

        {/* Bottom — type (`role`) + année, collé au bas de la carte */}
        <div className="card__footer">
          <span className="card__meta">{role}</span>
          <span className="card__meta">{year}</span>
        </div>
      </div>
    </Link>
  );
}
