import { lazy, useState, useEffect, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { InViewSections } from "./App";
import useSwipe from "./hooks/useSwipe";
import { useNavigation } from "./hooks/useNavigation";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

interface PathRoutesProps {
  setInViewSections: React.Dispatch<React.SetStateAction<InViewSections>>;
}

export const PathRoutes = ({ setInViewSections }: PathRoutesProps) => {
  const location = useLocation();
  const swipeHandlers = useSwipe();

  const { direction } = useNavigation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Page animations
  const pageVariants = useMemo(
    () =>
      isMobile
        ? {
            initial: (dir: "left" | "right") => ({
              x: dir === "left" ? "100%" : "-100%",
              opacity: 0,
            }),

            animate: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              },
            },

            exit: (dir: "left" | "right") => ({
              x: dir === "left" ? "-100%" : "100%",
              opacity: 0,
              transition: {
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              },
            }),
          }
        : {
            initial: {
              x: 0,
              opacity: 1,
            },
            animate: {
              x: 0,
              opacity: 1,
            },
            exit: {
              x: 0,
              opacity: 1,
            },
          },
    [isMobile],
  );

  const pageProps = {
    style: {
      height: "100%",
      width: "100%",
    },

    custom: direction,

    variants: pageVariants,

    initial: "initial" as const,

    animate: "animate" as const,

    exit: "exit" as const,
  };

  return (
    <main
      className="column"
      style={isMobile ? { touchAction: "pan-x pan-y" } : undefined}
      {...(isMobile ? swipeHandlers : {})}
    >
      <div className="page-slider">
        <AnimatePresence
          initial={false}
          mode={isMobile ? "wait" : "sync"}
          custom={direction}
        >
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div {...pageProps}>
                  <Home setInViewSections={setInViewSections} />
                </motion.div>
              }
            />

            <Route
              path="/home"
              element={
                <motion.div {...pageProps}>
                  <Home setInViewSections={setInViewSections} />
                </motion.div>
              }
            />

            <Route
              path="/projects"
              element={
                <motion.div {...pageProps}>
                  <Projects />
                </motion.div>
              }
            />

            <Route
              path="/contact-me"
              element={
                <motion.div {...pageProps}>
                  <Contact />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
};
