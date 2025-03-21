import { useLocation } from "react-router-dom";
import SmartNavbar from "./SmartNavbar.tsx";
import { useEffect, useState } from "react"; // Add useState

const Aside = () => {
  // Get the current URL path using the useLocation hook
  const location = useLocation();

  // Initialize state to hold the navigation items for the SmartNavbar
  const [SmartNavbarTexts, setSmartNavbarTexts] = useState<string[]>([""]);
  const [SmartNavbarLinks, setSmartNavbarLinks] = useState<string[]>([""]);

  useEffect(() => {
    switch (location.pathname) {
      case "/":
      case "/home":
        setSmartNavbarTexts(["About", "Projects", "Work History"]);
        setSmartNavbarLinks(["#", "#", "#"]);
        break;
      case "/projects":
        setSmartNavbarTexts(["Front-End", "Wordpress", "User Interfaces"]);
        setSmartNavbarLinks(["#", "#", "#"]);
        break;
      default:
        // Handle unmatched routes (like "*")
        setSmartNavbarTexts(["About", "Projects", "Work History"]);
        setSmartNavbarLinks(["#", "#", "#"]);
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    const navbarElement = document.getElementById("smart-navbar");

    // Check if the element exists
    if (navbarElement) {
      // Define the valid routes
      const validRoutes = ["/", "/home", "/projects"];

      // If the current path is "/", "/home", "/projects", or an unmatched route, remove the "hide" class
      if (
        validRoutes.includes(location.pathname) || // Matches "/", "/home", "/projects"
        !validRoutes.includes(location.pathname) // Matches unmatched routes (like "*")
      ) {
        navbarElement.classList.remove("hide");
      } else {
        // For all other paths, add the "hide" class
        navbarElement.classList.add("hide");
      }

      // If the class list is empty, remove the class attribute entirely
      if (navbarElement.classList.length === 0) {
        navbarElement.removeAttribute("class");
      }
    }
  }, [location.pathname]);

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
      <div id="smart-navbar">
        <SmartNavbar
          names={SmartNavbarTexts}
          links={SmartNavbarLinks}
        ></SmartNavbar>
      </div>
    </aside>
  );
};

// Export the Aside component as the default export
export default Aside;
