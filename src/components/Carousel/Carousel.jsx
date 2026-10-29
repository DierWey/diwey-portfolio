import { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../../data/projects.json';

const projects = data.projects;

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const current = projects[index];
  const total = projects.length;

  const previous = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const numero = String(index + 1).padStart(2, '0');

  return (
    <div className="carousel" aria-roledescription="carrousel" aria-label="Projets sélectionnés">
      <div className="carousel__frame">
        <div className="carousel__chrome" aria-hidden="true">
          <span className="carousel__dot" />
          <span className="carousel__dot" />
          <span className="carousel__dot" />
        </div>
        <Link
          className="carousel__slide"
          to={`/portfolio/${current.slug}`}
          aria-label={`Voir le projet ${current.title}`}
        >
          {/* Placeholder en attendant les captures — remplacé par <img> à la brique assets */}
          <div className="carousel__capture">
            <span>Capture — {current.title}</span>
          </div>
        </Link>
      </div>

      <div className="carousel__bar">
        <button
          type="button"
          className="carousel__arrow"
          onClick={previous}
          aria-label="Projet précédent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <p className="carousel__index">
          <span className="carousel__index-num">{numero} /</span> {current.title}
        </p>
        <button
          type="button"
          className="carousel__arrow"
          onClick={next}
          aria-label="Projet suivant"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}