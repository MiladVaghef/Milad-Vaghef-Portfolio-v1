import { BrowserRouter as Router } from "react-router-dom";
import { PathRoutes } from "./PathRoutes";
import Footer from "./components/Footer";
import "./styles/main.css";

const App = () => {
  return (
    <Router>
      <div id="container" className="row">
        <PathRoutes></PathRoutes>
      </div>
      <Footer></Footer>
    </Router>
  );
};

export default App;
