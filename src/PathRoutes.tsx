import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { InViewSections } from "./App";
import useSwipe from "./hooks/useSwipe";
import { useNavigation } from "./hooks/useNavigation";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

interface PathRoutesProps {
  setInViewSections: React.Dispatch<React.SetStateAction<InViewSections>>;
}

export const PathRoutes = ({ setInViewSections }: PathRoutesProps) => {
  const location = useLocation();
  const { direction } = useNavigation();
  const swipeHandlers = useSwipe();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);
  const hasMounted = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 850);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageVariants = isMobile
    ? {
        initial: (dir: string) =>
          hasMounted.current
            ? { x: dir === "left" ? "100%" : "-100%", opacity: 0 }
            : { x: 0, opacity: 1 },
        animate: {
          x: 0,
          opacity: 1,
          transition: { duration: 0.15 },
        },
        exit: (dir: string) => ({
          x: dir === "left" ? "-100%" : "100%",
          opacity: 0,
          transition: { duration: 0.15 },
        }),
      }
    : {
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 0, opacity: 1 },
      };

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return (
    <main className="column" {...(isMobile ? swipeHandlers : {})}>
      <AnimatePresence mode="wait" custom={direction}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                <Home setInViewSections={setInViewSections} />
              </motion.div>
            }
          />
          <Route
            path="/home"
            element={
              <motion.div
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                <Home setInViewSections={setInViewSections} />
              </motion.div>
            }
          />
          <Route
            path="/projects"
            element={
              <motion.div
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                <Projects />
              </motion.div>
            }
          />
          <Route
            path="/contact-me"
            element={
              <motion.div
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                <Contact />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </main>
  );
};
