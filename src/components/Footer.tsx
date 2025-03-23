import { NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { VALID_PATHS, ValidPath } from "../config/routes";

const Footer = () => {
  // This const is used to check the url
  const location = useLocation();
  const isInvalidPath = !VALID_PATHS.includes(location.pathname as ValidPath);

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
              className={
                ["/", "/home"].includes(location.pathname) || isInvalidPath
                  ? "footer-navbar-active"
                  : ""
              }
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
