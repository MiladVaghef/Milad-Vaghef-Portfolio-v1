import { InViewSections } from "../App";

interface SmartNavbarProps {
  names: string[];
  links: string[];
  inViewSections: InViewSections;
}

const SmartNavbar = ({ names, links, inViewSections }: SmartNavbarProps) => {
  const VISIBILITY_THRESHOLD = 0.1;
  let maxVisibility = -Infinity;
  let mostVisibleSection = "";

  // Find the section with highest visibility that meets threshold
  links.forEach((link) => {
    const visibility = inViewSections[link as keyof InViewSections] || 0;
    if (visibility >= VISIBILITY_THRESHOLD && visibility > maxVisibility) {
      maxVisibility = visibility;
      mostVisibleSection = link;
    }
  });

  return (
    <ul id="smart-navbar" className="column">
      {names.map((name, index) => (
        <li key={index}>
          <a
            href={links[index]}
            className={
              links[index] === mostVisibleSection ? "aside-nabar-active" : ""
            }
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SmartNavbar;
