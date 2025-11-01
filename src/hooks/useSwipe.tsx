import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";

const useSwipe = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const location = useLocation();
  const { navigateTo } = useNavigation();

  const routes = ["/", "/projects", "/contact-me"];
  const currentIndex = routes.indexOf(location.pathname);

  const minSwipeDistance = 50;
  const maxTouchDuration = 700;
  const maxVerticalDeviation = 100;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 850);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.targetTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;

    const touch = e.changedTouches[0];
    const deltaX = touchStartX - touch.clientX;
    const deltaY = touchStartY - touch.clientY;
    const timeElapsed = Date.now() - touchStartTime;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const isHorizontalSwipe =
      absDeltaX > minSwipeDistance && absDeltaX > absDeltaY;
    const isWithinVerticalLimit = absDeltaY <= maxVerticalDeviation;
    const isQuickEnough = timeElapsed < maxTouchDuration;

    if (!isHorizontalSwipe || !isWithinVerticalLimit || !isQuickEnough) return;

    if (deltaX > 0) {
      const nextIndex = (currentIndex + 1) % routes.length;
      navigateTo(routes[nextIndex], "left");
    } else {
      const prevIndex =
        currentIndex - 1 < 0 ? routes.length - 1 : currentIndex - 1;
      navigateTo(routes[prevIndex], "right");
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

export default useSwipe;
