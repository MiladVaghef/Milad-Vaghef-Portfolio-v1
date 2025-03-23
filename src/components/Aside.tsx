import { useLocation } from "react-router-dom";
import SmartNavbar from "./SmartNavbar.tsx";
import { useEffect, useState } from "react";
import { VALID_PATHS, ValidPath } from "../config/routes";

const Aside = () => {
  const location = useLocation();
  const isInvalidPath = !VALID_PATHS.includes(location.pathname as ValidPath);

  // Initialize state for SmartNavbar content
  const [SmartNavbarTexts, setSmartNavbarTexts] = useState<string[]>([""]);
  const [SmartNavbarLinks, setSmartNavbarLinks] = useState<string[]>([""]);

  // Initialize state for navbar visibility
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Update SmartNavbar content based on the current path
  useEffect(() => {
        setSmartNavbarLinks(["#", "#", "#"]);
    if (
      location.pathname === "/" ||
      location.pathname === "/home" ||
      isInvalidPath
    ) {
      setSmartNavbarTexts(["About", "Projects", "Work History"]);
    } else if (location.pathname === "/projects") {
      setSmartNavbarTexts(["Front-End", "Wordpress", "User Interfaces"]);
      setSmartNavbarLinks(["#", "#", "#"]);
    }
  }, [location.pathname, isInvalidPath]);

  // Update navbar visibility based on the current path
  useEffect(() => {
    const validRoutes = ["/", "/home", "/projects"];
    setIsNavbarVisible(
      validRoutes.includes(location.pathname) || isInvalidPath
    );
  }, [location.pathname, isInvalidPath]);

  return (
    <aside className="column">
      {/* Profile Section */}
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

      {/* SmartNavbar Section */}
      <div id="smart-navbar" className={isNavbarVisible ? "" : "hide"}>
        <SmartNavbar names={SmartNavbarTexts} links={SmartNavbarLinks} />
      </div>
    </aside>
  );
};

export default Aside;
