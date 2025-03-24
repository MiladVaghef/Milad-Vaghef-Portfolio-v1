import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { InViewSections } from "./App";

interface PathRoutesProps {
  setInViewSections: React.Dispatch<React.SetStateAction<InViewSections>>;
}

export const PathRoutes = ({ setInViewSections }: PathRoutesProps) => {
  return (
    <main className="column">
      <Routes>
        <Route
          path="/"
          element={<Home setInViewSections={setInViewSections} />}
        />
        <Route
          path="/home"
          element={<Home setInViewSections={setInViewSections} />}
        />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact-me" element={<Contact />} />
        <Route
          path="*"
          element={<Home setInViewSections={setInViewSections} />}
        />
      </Routes>
    </main>
  );
};
