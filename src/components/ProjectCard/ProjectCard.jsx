import { Link } from "react-router-dom";
import BrowserFrame from "../BrowserFrame/BrowserFrame";
import "./_project-card.scss";

/* ------------------------------------------------------------------
   ProjectCard — carte projet de la grille Portfolio.

   Structure (relevé Figma 31/10, label P3 ajouté 9/11) — deux blocs :
   - Aperçu  : fond accent-soft, padding 24. Le BrowserFrame (sm,
     5 points, chrome 32) y rend la capture — 336×173 desktop /
     276×141 tablette / 279×143 mobile, jamais fixée en code (le
     flux et le ratio de l'image la calculent).
   - Infos   : padding 24, 5 blocs écartés de 16 —
       1. Top    : badges techno (donnée `stack`), pilules
          accent-soft / bord accent 1px / rayon 999 / padding
          4/8 / mono 16 accent
       2. Nom    : libellé du lien-carte — serif bold 24 ink.
          TRANCHÉ 31/10 : le Nom N'EST PAS un titre. La carte ne
          porte AUCUN heading : la hiérarchie vit dans le h1 de la
          page, le Nom est un libellé de lien.
       3. Description : Inter ink 16 CONSTANT tous paliers (31/10)
          — champ `desc` du JSON, PAS `approach` (design, fiche)
       4. CTA « Voir le projet ↗ » (P3, acté 9/11) : ligne propre
          JUSTIFIÉE À DROITE entre Description et Bottom. Réponse
          au « pourquoi cliquable » de Vincent : visible au repos
          (tactile et lecteurs d'écran inclus) et vit DANS le
          lien-carte — son texte enrichit le nom accessible
          (« ohmyfood… Voir le projet »). Pilule-fantôme révélée
          au survol de la carte, fond accent-soft à l'appui (tout
          dans _project-card.scss). Flèche ornementale ↗ en
          aria-hidden — en suspens : à confirmer avec Vincent
          mercredi 11/11 (règle directionnelle du 30/10 — fiche
          interne : ni latérale → ni externe ↗).
       5. Bottom : bordure haute 1px line, padding-top 8, type
          (`role`) + année (`year`) en space-between, mono 12
          ink-muted — DERNIÈRE LIGNE DU FLUX : la carte prend la
          hauteur de son contenu (9/11, inversion de la hauteur
          commune du 31/10 — chaque carte s'arrête où son texte
          s'arrête, l'égalisation est levée partout)

   Geste de survol (revu 9/11, clôture du débat) : bordure accent +
   Nom accent, SANS filet — le ::after scaleX est RETIRÉ (décision
   6/11 : l'argument « la fiche est une section de la page » est
   tombé, le mentor a démontré qu'il ne vivait que dans la tête du
   designer). Le « pourquoi » du clic est porté par le label, le
   « c'est cliquable » par la bordure et le Nom.

   Contrats :
   - La barre chrome de la carte EST le composant BrowserFrame
     (size="sm", slug pour la pilule) — aucun chrome codé en dur.
   - La carte porte SEULE bordure + rayon 12 (constant) et fond
     surface. Le BrowserFrame reste neutre : ni bordure ni rayon.
   - La carte entière est le lien : le CTA est une ligne de texte
     du lien, JAMAIS un lien imbriqué (lien dans lien = HTML
     invalide — la flèche seule est aria-hidden).
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

        {/* Nom — h2 (31/10 soir, corrige l'alerte WAVE « Possible heading ») ; title tronqué au tiret long
          (loi du fil d'Ariane). L'override ink vit dans _project-card.scss : la base h2 (serif bold accent)
          ne doit pas passer ici. Le filet ::after du 3/11 est retiré (9/11). */}
        <h2 className="card__name">{name}</h2>

        {/* Description — champ `desc` du JSON, 16 constant */}
        <p className="card__text">{desc}</p>

        {/* CTA — P3 (9/11) : ligne propre justifiée à droite, entre
            Description et Bottom. Justification dans _project-card.scss
            (align-self: flex-end). Vit DANS le lien-carte : le texte
            « Voir le projet » enrichit automatiquement le nom accessible
            du Link (« ohmyfood… Voir le projet ») — c'est le point a11y
            de la décision 6/11, sans aucun aria additionnel. La flèche
            est décorative : aria-hidden, jamais lue. */}
        <p className="card__cta">
          Voir le projet<span className="card__cta-arrow" aria-hidden="true">↗</span>
        </p>

        {/* Bottom — type (`role`) + année : dernière ligne du flux
            (hauteur auto de la carte, 9/11 — plus poussée en bas) */}
        <div className="card__footer">
          <span className="card__meta">{role}</span>
          <span className="card__meta">{year}</span>
        </div>
      </div>
    </Link>
  );
}
