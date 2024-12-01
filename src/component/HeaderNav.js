import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom

const HeaderNav = () => {
  return (
    <div>
      <header className="header">
        MyIndex
      </header>
      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink
          to="/heatmap"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          MyPortfolio
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Market News
        </NavLink>
      </nav>
    </div>
  );
};

export default HeaderNav;
