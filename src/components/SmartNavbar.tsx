import { useLocation } from "react-router-dom";
import { InViewSections } from "../App";

interface SmartNavbarProps {
  names: string[];
  links: string[];
  inViewSections: InViewSections;
}

const SmartNavbar = ({ names, links, inViewSections }: SmartNavbarProps) => {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/projects";
  const currentHash = location.hash.replace("#", "");
  const VISIBILITY_THRESHOLD = 0.1;

  // Handle default active state for projects page
  const defaultProjectCategory = names[0]; // First category (Wordpress)
  const effectiveHash =
    isProjectsPage && !currentHash ? defaultProjectCategory : currentHash;

  // For home page: Find most visible section
  let mostVisibleSection = "";
  if (!isProjectsPage) {
    let maxVisibility = -Infinity;
    links.forEach((link) => {
      const visibility = inViewSections[link as keyof InViewSections] || 0;
      if (visibility >= VISIBILITY_THRESHOLD && visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleSection = link;
      }
    });
  }

  return (
    <ul id="smart-navbar" className="column">
      {names.map((name, index) => {
        const link = links[index];
        const isActive = isProjectsPage
          ? effectiveHash === link.replace("#", "")
          : link === mostVisibleSection;

        return (
          <li key={index}>
            <a
              href={link}
              className={isActive ? "aside-nabar-active" : ""}
              onClick={(e) => {
                if (isProjectsPage) {
                  e.preventDefault();
                  window.location.hash = link.replace("#", "");
                }
              }}
            >
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SmartNavbar;
