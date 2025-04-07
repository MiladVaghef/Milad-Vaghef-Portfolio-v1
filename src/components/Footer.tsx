import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { VALID_PATHS, ValidPath } from "../config/routes";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const Footer = () => {
  const width = useWindowWidth();
  const location = useLocation();
  const isInvalidPath = !VALID_PATHS.includes(location.pathname as ValidPath);
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show footer when scrolling down, hide when scrolling up
      if (currentScrollY > lastScrollY.current + 2) {
        // Scrolling down
        setShowFooter(true);
      } else if (currentScrollY < lastScrollY.current - 2) {
        // Scrolling up
        setShowFooter(false);
      }

      // Always update last scroll position
      lastScrollY.current = currentScrollY;

      // Ensure footer is hidden at the very top
      if (currentScrollY === 0) {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className={`row${showFooter && width < 851 ? " slide-down" : ""}`}>
      <div id="footer-logo">
        <Logo />
      </div>
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
      <div id="footer-social-media">
        <a href="http://instagram.com/_u/miladvaghef" target="_blank">
          <Icon name="instagram" />
        </a>
        <a href="https://github.com/MiladVaghef" target="_blank">
          <Icon name="github" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
