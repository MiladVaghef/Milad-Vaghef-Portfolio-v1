import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { PathRoutes } from "./PathRoutes";
import Aside from "./components/Aside";
import { NavigationProvider } from "./hooks/useNavigation";
import "./styles/main.scss";

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
        <ScrollToTop />

        <div id="container">
          <Aside inViewSections={inViewSections} />
          <PathRoutes setInViewSections={setInViewSections} />
        </div>
      </NavigationProvider>
    </Router>
  );
};

export default App;