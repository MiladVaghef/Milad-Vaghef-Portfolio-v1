import { NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";

const Footer = () => {
  // This const is used to check the url
  const location = useLocation();

  // Define valid routes
  const validRoutes = ["/", "/home", "/projects", "/contact-me"];

  return (
    <footer className="row">
      {/* Logo section */}
      <div id="footer-logo">
        <Logo></Logo>
      </div>
      {/* Navbar section*/}
      <nav id="footer-navbar">
        <ul className="row">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => {
                // Check if the current path is NOT in the validRoutes array
                const isInvalidPath = !validRoutes.includes(location.pathname);
                return isActive || isInvalidPath ? "footer-navbar-active" : "";
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "footer-navbar-active" : ""
              }
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact-me"
              className={({ isActive }) =>
                isActive ? "footer-navbar-active" : ""
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
      {/* Social media icons section */}
      <div id="footer-social-media">
        <Icon name="instagram"></Icon>
        <Icon name="linkedin"></Icon>
        <Icon name="github"></Icon>
      </div>
    </footer>
  );
};

export default Footer;
