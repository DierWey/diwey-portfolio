import data from '../../data/projects.json';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

/* ------------------------------------------------------------------
   Page Portfolio — la grille des six cartes projet.

   La page EST le propriétaire des données : elle importe le JSON
   (wrapper { projects: [...] }) et injecte chaque fiche dans
   ProjectCard via props. La carte, elle, ne connaît ni le JSON ni
   le fichier d'où elle vient — un composant, une responsabilité.

   Structure : h1 « Portfolio » (centré, accent — via la base) → 48
   → chapeau (max 816 desktop, règle des chapeaux du 24/10) → 64
   (relevé prototype, à confirmer contre le Figma) → grille.
   ------------------------------------------------------------------ */
export default function Portfolio() {
  const { projects } = data;

  return (
    <main className="page portfolio">
      <h1 className="portfolio__title">Portfolio</h1>

      <p className="portfolio__lede">
        Six réalisations — cinq projets de formation et ce portfolio même —
        conçues et développées avec la même exigence : chaque pixel a une
        raison d'être.
      </p>

      <div className="portfolio__grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </main>
  );
}
