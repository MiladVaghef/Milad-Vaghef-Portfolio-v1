import { useLocation } from "react-router-dom";
import SmartNavbar from "./SmartNavbar";
import { useEffect, useState } from "react";
import { VALID_PATHS, ValidPath } from "../config/routes";
import { InViewSections } from "../App";

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
      setSmartNavbarTexts(["Wordpress", "Figma", "Front-End"]);
      setSmartNavbarLinks(["#Wordpress", "#Figma", "#Front-End"]);
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
      </section>

      <div id="smart-navbar" className={isNavbarVisible ? "" : "hide"}>
        <SmartNavbar
          names={SmartNavbarTexts}
          links={SmartNavbarLinks}
          inViewSections={inViewSections}
        />
      </div>
    </aside>
  );
};

export default Aside;
