import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/pictures/logo_DiD.webp';

/* ------------------------------------------------------------------
Header : le bandeau de toutes les pages, composé de deux pièces : le logo et le menu de
navigation principale (Accueil, Portfolio, Contact).

Le logo : 
C'est un lien (Link) vers l'accueil dont le CSS dessine une pilule --surface à bordure --accent,
qui porte le monogramme et le nom.
L'image porte alt="" parce que le texte Diwey.dev est écrit à côté en vrai texte : 
l'image ne répète rien. Le .dev vit dans son propre span pour prendre l'accent sans couper
le nom. Et id="top" sur le header est la cible de l'ancre « Retour en haut » du footer.

Le menu de navigation : 
Composé de trois boutons-fantômes en mono dans un nav aria-labelisé
« Navigation principale ».
Il utilise NavLink et pas Link. La nav a besoin de connaître la route courante.
React-router fournit isActive, le code compose la classe 
header__link--active à partir de ce booléen, le CSS fait le reste.
La prop end sur l'accueil : sans elle, "/" est préfixe de toutes les 
routes et le lien Accueil resterait actif partout. Il ne l'est que sur
la page d'accueil, et il n'y a jamais deux liens actifs à la fois.
L'état actif vit dans la classe, pas dans aria-current : choix de charte,
le repère visuel est l'essentiel, le lecteur d'écran sait déjà où il est
par le href courant.
------------------------------------------------------------------------ */

export default function Header() {
  return (
    <header id="top" className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <div className="header__logo-mark">
            <img src={logo} alt="" />
          </div>
          <span className="header__texts">
            <span className="header__name">Diwey<span className="header__tld">.dev</span></span>
            <span className="header__baseline">Le détail compte.</span>
          </span>
        </Link>
        <nav className="header__nav" aria-label="Navigation principale">
          <NavLink to="/" end className={({ isActive }) => 'header__link' + (isActive ? ' header__link--active' : '')}>
            Accueil
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => 'header__link' + (isActive ? ' header__link--active' : '')}>
            Portfolio
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => 'header__link' + (isActive ? ' header__link--active' : '')}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
