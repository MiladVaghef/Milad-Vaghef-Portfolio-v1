// Import react-router-dom
import { NavLink, useLocation } from "react-router-dom";
// Import Icons
import Icon from "./Icon";
// Import logo
import Logo from "./Logo";

const Footer = () => {
  // This const is used to check the url
  const location = useLocation();
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
              to={"/home"}
              // Check if the navlink is active or the URL is on the root, Ff one of these conditions is true return "footer-navbar-active" class to the element, If none of conditions is true remove the class.
              className={({ isActive }) => {
                const checkPath = location.pathname === "/" || "*";
                return isActive || checkPath ? "footer-navbar-active" : "";
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/projects"}
              // Check if the navlink is active, If the navlink is active return "footer-navbar-active" class to the element, Else remove it
              className={({ isActive }) =>
                isActive ? "footer-navbar-active" : ""
              }
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/contact-me"}
              // Check if the navlink is active, If the navlink is active return "footer-navbar-active" class to the element, Else remove it
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
