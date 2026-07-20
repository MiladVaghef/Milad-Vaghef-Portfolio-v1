import { lazy, useState, useEffect, useRef, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
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

  const { direction, navigateTo } = useNavigation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const dragX = useRef(0);

  const isDraggingFromNoSwipeZone = useRef(false);

  const [isDragEnabled, setIsDragEnabled] = useState(true);

  const MIN_SWIPE = 100;

  const routes = ["/home", "/projects", "/contact-me"];

  const currentIndex = routes.indexOf(location.pathname);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detect where drag starts
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-no-swipe]")) {
      isDraggingFromNoSwipeZone.current = true;
      setIsDragEnabled(false);
    } else {
      isDraggingFromNoSwipeZone.current = false;
      setIsDragEnabled(true);
    }
  };

  // Track drag
  const handleDrag = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    dragX.current = info.offset.x;
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isMobile) return;

    // 🚫 Slider / no-swipe area
    if (isDraggingFromNoSwipeZone.current) {
      dragX.current = 0;
      setIsDragEnabled(true);
      return;
    }

    const offset = dragX.current;

    // 🚫 Not enough movement
    if (Math.abs(offset) < MIN_SWIPE) {
      dragX.current = 0;
      setIsDragEnabled(true);
      return;
    }

    if (currentIndex === -1) return;

    if (offset > 0) {
      const targetPath = routes[currentIndex - 1] ?? routes[currentIndex];

      navigateTo(targetPath, "right");
    } else {
      const targetPath = routes[currentIndex + 1] ?? routes[currentIndex];

      navigateTo(targetPath, "left");
    }

    dragX.current = 0;
    setIsDragEnabled(true);
  };

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
    drag: isMobile && isDragEnabled ? ("x" as const) : false,

    onPointerDown: handlePointerDown,

    // 🔹 Reduced from 0.18
    dragElastic: 0.1,

    dragConstraints: {
      left: 0,
      right: 0,
    },

    onDrag: handleDrag,

    onDragEnd: handleDragEnd,

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
    <main className="column" {...(isMobile ? swipeHandlers : {})}>
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
