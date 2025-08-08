/** Application footer with dynamic year and scroll-to-top action. */
import React from "react";

export const Footer: React.FC = () => {
  /** Current year displayed in the copyright line. */
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">
          © {year} Daniel Rodriguez & Henry Rivera. All rights reserved.
        </p>
        <button
          type="button"
          className="footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      </div>
    </footer>
  );
};
