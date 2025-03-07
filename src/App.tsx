import { BrowserRouter as Router } from "react-router-dom";
import { PathRoutes } from "./PathRoutes";

const App = () => {
  return (
    <Router>
      <div id="container" className="row">
        <PathRoutes></PathRoutes>
      </div>
    </Router>
  );
};

export default App;
