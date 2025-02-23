import { BrowserRouter as Router } from "react-router-dom";
import { PathRoutes } from "./PathRoutes";

const App = () => {
  return (
    <Router>
      <PathRoutes></PathRoutes>
    </Router>
  );
};

export default App;
