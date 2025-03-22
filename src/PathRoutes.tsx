// Import needed functions for router
import { Routes, Route } from "react-router-dom";
// Import home component
import Home from "./pages/Home";
// Import pages component
import Projects from "./pages/Projects";
// Import contact component
import Contact from "./pages/Contact";

export const PathRoutes = () => {
  return (
    <main className="column">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="/contact-me" element={<Contact />}></Route>
        <Route path="*" element={<Home />}></Route>
      </Routes>
    </main>
  );
};
