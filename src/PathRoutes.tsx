import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Plans from "./pages/Plans";
import Contact from "./pages/Contact";

export const PathRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/projects" element={<Projects />}></Route>
      <Route path="/plans" element={<Plans />}></Route>
      <Route path="/contact-me" element={<Contact />}></Route>
      <Route path="*" element={<Home />}></Route>
    </Routes>
  );
};
