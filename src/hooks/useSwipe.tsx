import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";

const useSwipe = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const location = useLocation();
  const { navigateTo } = useNavigation();

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const ignoreSwipeRef = useRef(false);

  const routes = ["/home", "/projects", "/contact-me"];
  const currentIndex = routes.indexOf(location.pathname);

  const minSwipeDistance = 50;
  const maxTouchDuration = 700;
  const maxVerticalDeviation = 100;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 850);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;

    const target = e.target as HTMLElement;

    // ✅ use generic blocker
    if (target.closest("[data-no-swipe]")) {
      ignoreSwipeRef.current = true;
      return;
    }

    ignoreSwipeRef.current = false;

    const touch = e.targetTouches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || ignoreSwipeRef.current) return;
    if (currentIndex === -1) return;

    const touch = e.changedTouches[0];
    const deltaX = touchStartXRef.current - touch.clientX;
    const deltaY = touchStartYRef.current - touch.clientY;
    const timeElapsed = Date.now() - touchStartTimeRef.current;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const isHorizontalSwipe =
      absDeltaX > minSwipeDistance && absDeltaX > absDeltaY;
    const isWithinVerticalLimit = absDeltaY <= maxVerticalDeviation;
    const isQuickEnough = timeElapsed < maxTouchDuration;

    if (!isHorizontalSwipe || !isWithinVerticalLimit || !isQuickEnough) return;

    if (deltaX > 0) {
      const nextIndex =
        currentIndex + 1 >= routes.length ? currentIndex : currentIndex + 1;
      navigateTo(routes[nextIndex], "left");
    } else {
      const prevIndex = currentIndex - 1 < 0 ? currentIndex : currentIndex - 1;
      navigateTo(routes[prevIndex], "right");
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

export default useSwipe;
