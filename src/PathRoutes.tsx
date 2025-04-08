import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { InViewSections } from "./App";
import useSwipe from "./hooks/useSwipe";

interface PathRoutesProps {
  setInViewSections: React.Dispatch<React.SetStateAction<InViewSections>>;
}

export const PathRoutes = ({ setInViewSections }: PathRoutesProps) => {
  const location = useLocation();
  const { onTouchStart, onTouchMove, onTouchEnd, direction } = useSwipe();

  // Determine if screen width is under 850px
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 850);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conditionally define animation variants based on isMobile
  const pageVariants = isMobile
    ? {
        initial: (dir: string) => ({
          x: dir === "left" ? "100%" : "-100%",
          opacity: 0,
        }),
        animate: {
          x: 0,
          opacity: 1,
          transition: { duration: 0.2 },
        },
        exit: (dir: string) => ({
          x: dir === "left" ? "-100%" : "100%",
          opacity: 0,
          transition: { duration: 0.2 },
        }),
      }
    : {
        // When not mobile, disable animations:
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 0, opacity: 1 },
      };

  return (
    <main
      className="column"
      // Only attach swipe events when mobile:
      {...(isMobile ? { onTouchStart, onTouchMove, onTouchEnd } : {})}
    >
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
