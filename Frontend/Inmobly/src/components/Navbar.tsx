/** Main navigation bar with responsive (mobile toggle) behavior. */
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
  /** Tracks whether the mobile menu is expanded. */
  const [open, setOpen] = useState(false);
  /** Closes the mobile menu (used after navigation). */
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={close}>
          <span className="brand-icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M5.5 10V20h13V10" />
              <path d="M9.5 21h5" />
            </svg>
          </span>
          <span className="brand-text">Inmobly</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <ul className="nav-links" data-open={open}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={close}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={close}
            >
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/new-property"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={close}
            >
              Register Property
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={close}
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={close}
            >
              Sign up
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
