import { useLocation } from "react-router-dom";
import SmartNavbar from "./SmartNavbar";
import { memo, useEffect, useState } from "react";
import { VALID_PATHS, ValidPath } from "../config/routes";
import { InViewSections } from "../App";
import Logo from "../components/Logo";
// CV — bundled from src/assets so the hashed URL works in dev AND in the
// production build (a root-folder PDF would never ship to dist).
import resumePdf from "../assets/Milad-Vaghef-Front-End-Resume.pdf";

interface AsideProps {
  inViewSections: InViewSections;
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const Aside = ({ inViewSections }: AsideProps) => {
  const location = useLocation();
  const isInvalidPath = !VALID_PATHS.includes(location.pathname as ValidPath);
  const [SmartNavbarTexts, setSmartNavbarTexts] = useState<string[]>([""]);
  const [SmartNavbarLinks, setSmartNavbarLinks] = useState<string[]>([""]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const width = useWindowWidth();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/home" ||
      isInvalidPath
    ) {
      setSmartNavbarTexts(["About", "Projects", "Work History"]);
      setSmartNavbarLinks([
        "#biography",
        "#home-row-projects",
        "#home-work-history",
      ]);
    } else if (location.pathname === "/projects") {
      setSmartNavbarTexts(["WordPress", "Figma", "Front-End"]);
      setSmartNavbarLinks(["#WordPress", "#Figma", "#Front-End"]);
    }
  }, [location.pathname, isInvalidPath]);

  useEffect(() => {
    const validRoutes = ["/", "/home", "/projects"];
    setIsNavbarVisible(
      validRoutes.includes(location.pathname) || isInvalidPath
    );
  }, [location.pathname, isInvalidPath]);

  return (
    <aside className={width < 1025 ? "remove" : "column"}>
      <div>
        <section>
          <h1>Milad Vaghef</h1>
          <h2 className="column">
            <span>Front-End Developer</span>
            <span>UI Designer</span>
          </h2>
          <p>
            I make modern and well-structured websites and friendly user
            interfaces.
          </p>

          {/* CV — opens the PDF in a new tab; the browser's viewer doubles
              as read + download (same convention as the lightbox's
              target="_blank" links). */}
          <a
            className="cv-link"
            href={resumePdf}
            target="_blank"
            rel="noreferrer"
            title="View CV (opens in a new tab)"
            aria-label="View CV (opens in a new tab)"
          >
            {/* File glyph — 24-box / 2 stroke, round joins, inlined like the
                modal's controls (no shared Icon import at this scale);
                color flows via currentColor. */}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 3v5h5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>View CV</span>
          </a>
        </section>

        <div id="smart-navbar" className={isNavbarVisible ? "" : "hide"}>
          <SmartNavbar
            names={SmartNavbarTexts}
            links={SmartNavbarLinks}
            inViewSections={inViewSections}
          />
        </div>
      </div>

      <div id="aside-logo">
        <Logo />
      </div>
    </aside>
  );
};

// Memoized: in-view ratio updates flow through App state — skip re-rendering
// the sidebar unless those ratios actually change.
export default memo(Aside);
