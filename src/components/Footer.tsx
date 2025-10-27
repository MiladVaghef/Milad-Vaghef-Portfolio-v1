import { useLocation } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationContext";
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
  // Define your routes and labels here
  const routeLabels: Record<string, string> = {
    "/": "Home",
    "/projects": "Projects",
    "/contact-me": "Contact",
  };

  const routes = Object.keys(routeLabels);

  const getDirection = (targetPath: string): "left" | "right" | null => {
    const currentIndex = routes.indexOf(location.pathname);
    const targetIndex = routes.indexOf(targetPath);

    if (targetIndex > currentIndex) return "left";
    if (targetIndex < currentIndex) return "right";
    return null;
  };

  const routeIcons: Record<string, IconType> = {
    "/": "home",
    "/projects": "grid",
    "/contact-me": "contact",
  };

  return (
    <footer className="row">
      <div id="footer-logo">
        <Logo />
      </div>
      <div id="footer-navbar">
        <ul>
          {routes.map((path) => (
            <li key={path}>
              {isMobile ? (
                // 🔹 Mobile version (icon only)
                <button
                  className={`footer-link-mobile ${
                    location.pathname === path ? "active-mobile" : ""
                  }`}
                  onClick={() => navigateTo(path, getDirection(path))}
                >
                  <Icon name={routeIcons[path]} />
                </button>
              ) : (
                // 🔹 Desktop version (text)
                <button
                  className={`footer-link ${
                    location.pathname === path ? "active" : ""
                  }`}
                  onClick={() => navigateTo(path, getDirection(path))}
                >
                  {routeLabels[path]}
                </button>
              )}
            </li>
          ))}
        </ul>
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
