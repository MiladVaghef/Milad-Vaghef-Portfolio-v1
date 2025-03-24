import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { PathRoutes } from "./PathRoutes";
import Footer from "./components/Footer";
import Aside from "./components/Aside";
import "./styles/main.css";

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
      <div id="container" className="row">
        <Aside inViewSections={inViewSections} />
        <PathRoutes setInViewSections={setInViewSections} />
      </div>
      <Footer />
    </Router>
  );
};

export default App;
