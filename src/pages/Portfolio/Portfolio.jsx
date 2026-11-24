import data from '../../data/projects.json';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

/* ------------------------------------------------------------------
Page Portfolio : la grille des six cartes projet.

Fonctionnalités :
La page est le propriétaire des données : elle importe le
JSON (wrapper { projects: [...] }) et injecte chaque fiche
dans ProjectCard via props. La carte, elle, ne connaît ni le
JSON ni le fichier d'où elle vient : un composant, une
responsabilité.

Structure : 
h1 « Portfolio » (centré et accent via la base), 48, chapeau
(816px maximum en desktop, règle des chapeaux), 48, grille.
------------------------------------------------------------------ */

export default function Portfolio() {
  const { projects } = data;

  return (
    <main className="page portfolio">
      <h1 className="portfolio__title">Portfolio</h1>

      <p className="portfolio__lede">
        Six réalisations — cinq projets de formation et ce portfolio —
        conçues et développées avec la même exigence : chaque pixel a une
        raison d'être.
      </p>

      {/* Le JSON est importé et déplié en tableau au chargement (import data et 
      const { projects } = data) ; le map transforme chaque fiche en un élément ProjectCard ;
      le JSX rend le tableau d'éléments résultant : la liste de cartes. Chaque carte a sa key
      (slug) unique et stable : React identifie chaque carte par projet, jamais par position. */} 
      <div className="portfolio__grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </main>
  );
}
