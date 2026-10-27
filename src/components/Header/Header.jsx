import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header id="top" className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__name">Diwey.dev</span>
          <span className="header__baseline">Le détail compte.</span>
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