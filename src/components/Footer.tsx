import { useLocation } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";
import Logo from "../components/Logo";
import Icon from "./Icon";
import { useState, useEffect } from "react";
import type { IconType } from "./Icon";

// 🔹 Reusable hook
function useResponsive(maxWidth: number) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= maxWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth]);

  return isMobile;
}

const Footer = () => {
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const isMobile = useResponsive(668);

  const routeLabels: Record<string, string> = {
    "/home": "Home",
    "/projects": "Projects",
    "/contact-me": "Contact",
  };

  const routes = Object.keys(routeLabels);

  // ✅ Always returns valid direction (no null)
  const getDirection = (targetPath: string): "left" | "right" => {
    const currentIndex = routes.indexOf(location.pathname);
    const targetIndex = routes.indexOf(targetPath);

    return targetIndex > currentIndex ? "left" : "right";
  };

  const routeIcons: Record<string, IconType> = {
    "/home": "home",
    "/projects": "grid",
    "/contact-me": "contact",
  };

  return (
    <footer className="row">
      <div id="footer-logo">
        <Logo />
      </div>

      <div id="footer-navbar">
        <nav>
          <ul>
            {routes.map((path) => (
              <li key={path}>
                {isMobile ? (
                  // 🔹 Mobile
                  <button
                    className={`footer-link-mobile column ${
                      location.pathname === path ? "active-mobile" : ""
                    }`}
                    onClick={() => {
                      if (location.pathname === path) return; // 🚫 prevent same-route bug
                      navigateTo(path, getDirection(path));
                    }}
                  >
                    <Icon name={routeIcons[path]} />
                    <span>{routeLabels[path]}</span>
                  </button>
                ) : (
                  // 🔹 Desktop
                  <button
                    className={`footer-link ${
                      location.pathname === path ? "active" : ""
                    }`}
                    onClick={() => {
                      if (location.pathname === path) return; // 🚫 prevent same-route bug
                      navigateTo(path, getDirection(path));
                    }}
                  >
                    {routeLabels[path]}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

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
