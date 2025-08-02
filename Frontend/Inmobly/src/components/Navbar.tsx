import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Log in</Link>
      <Link to="/register">Sign up</Link>
      <Link to="/new-property">Register Property</Link>
      <Link to="/explore">Explore Properties</Link>
    </nav>
  );
};
