/** Landing page: introductory content plus a subset of popular properties. */
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "../features/properties/api";
import type { ApiProperty } from "../features/properties/types";
import { PropertyCard } from "../components/PropertyCard";
import { Footer } from "../components/Footer";

export const Home = () => {
  /** Popular properties (first N entries from full list). */
  const [popular, setPopular] = useState<ApiProperty[]>([]);
  /** Loading flag for initial fetch. */
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /** Fetch properties once and retain first six as "popular". */
    fetchProperties()
      .then((data) => setPopular(data.slice(0, 6)))
      .catch(() => setPopular([]))
      .finally(() => setLoading(false));
  }, []);
  /** Navigate with operation=BUY pre-filter. */
  const goBuy = () => navigate("/explore?operation=BUY");
  /** Navigate with operation=LEASE pre-filter. */
  const goRent = () => navigate("/explore?operation=LEASE");
  /** Navigate to property registration form. */
  const goSell = () => navigate("/new-property");

  return (
    <main>
      <Navbar />
      <div className="home-container">
        <section className="home-hero">
          <h1 className="home-title">Inmobly</h1>
          <p className="home-lead">
            Inmobly is a modern platform in Colombia where you can buy, rent and
            sell properties. Discover listings, apply filters, and manage your
            own real estate opportunities.
          </p>
        </section>

        <section className="focus-section">
          <h2 className="section-title">Our Main Focus</h2>
          <div className="focus-grid">
            <button className="focus-card" onClick={goBuy}>
              <div className="focus-icon">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 11.5L12 4l9 7.5" />
                  <path d="M5 10v10h14V10" />
                </svg>
              </div>
              <h3 className="focus-title">Buy a Property</h3>
              <p className="focus-text">
                Browse properties for sale and find a place you will love to
                call home.
              </p>
              <span className="focus-link">Find a property →</span>
            </button>

            <button className="focus-card" onClick={goRent}>
              <div className="focus-icon">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 12l8-7 8 7" />
                  <path d="M6 10v10h12V10" />
                  <path d="M9 21h6" />
                </svg>
              </div>
              <h3 className="focus-title">Rent a Property</h3>
              <p className="focus-text">
                Explore rentals available now and move into your next space
                sooner.
              </p>
              <span className="focus-link">Find a Property →</span>
            </button>

            <button className="focus-card" onClick={goSell}>
              <div className="focus-icon">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3l9 7-3 2v8H6v-8L3 10z" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </div>
              <h3 className="focus-title">Sell / Lease a Property</h3>
              <p className="focus-text">
                List your property easily and reach potential buyers across
                Colombia.
              </p>
              <span className="focus-link">List a Property →</span>
            </button>
          </div>
        </section>

        <section className="popular-section">
          <h2 className="section-title">Popular Properties</h2>
          {loading ? (
            <p className="popular-status">Loading properties...</p>
          ) : popular.length === 0 ? (
            <p className="popular-status">No properties available.</p>
          ) : (
            <div className="popular-grid">
              {popular.map((p) => (
                <PropertyCard
                  key={p.registryNumber}
                  property={p}
                  onClick={() =>
                    navigate(`/property/${p.registryNumber}`, {
                      state: { property: p },
                    })
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
};
