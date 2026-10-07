import { useEffect } from "react";

/**
 * Signals the LoadingScreen that the routed page content has mounted and
 * painted (one frame after mount). This makes the loader wait for the real
 * UI before the curtain reveal — progress never shows 100% prematurely.
 */
const useAppReady = () => {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("app:rendered"));
    });

    return () => cancelAnimationFrame(raf);
  }, []);
};

export default useAppReady;