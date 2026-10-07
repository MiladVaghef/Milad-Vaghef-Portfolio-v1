import { useCallback, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { PathRoutes } from "./PathRoutes";
import Aside from "./components/Aside";
import LoadingScreen from "./components/LoadingScreen";
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

  const [isLoading, setIsLoading] = useState(true);

  // Stable identity so LoadingScreen's reveal timers aren't reset every time
  // App re-renders (setInViewSections fires while the loader is still up).
  const handleLoadingFinish = useCallback(() => setIsLoading(false), []);

  return (
    <Router>
      <NavigationProvider>
        <ScrollToTop />

        {isLoading && <LoadingScreen onFinish={handleLoadingFinish} />}

        <div id="container">
          <Aside inViewSections={inViewSections} />
          <PathRoutes setInViewSections={setInViewSections} />
        </div>
      </NavigationProvider>
    </Router>
  );
};

export default App;