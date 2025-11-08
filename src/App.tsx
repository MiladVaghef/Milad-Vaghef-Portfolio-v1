import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { PathRoutes } from "./PathRoutes";
import Footer from "./components/Footer";
import Aside from "./components/Aside";
import "./styles/main.scss";
import { NavigationProvider } from "./contexts/NavigationContext"; // Added

export type InViewSections = {
  "#biography": number;
  "#home-row-projects": number;
  "#home-work-history": number;
};

const App = () => {
  const [inViewSections, setInViewSections] = useState<InViewSections>({
    "#biography": 0,
    "#home-row-projects": 0,
    "#home-work-history": 0,
  });

  return (
    <Router>
      <NavigationProvider>
        {" "}
        {/* Added provider */}
        <ScrollToTop />
        <div id="container">
          <Aside inViewSections={inViewSections} />
          <PathRoutes setInViewSections={setInViewSections} />
        </div>
        <Footer />
      </NavigationProvider>
    </Router>
  );
};

export default App;
