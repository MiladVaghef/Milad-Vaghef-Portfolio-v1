// useSwipe.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Direction = "left" | "right" | null;

const useSwipe = () => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 850);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const routes = ["/", "/projects", "/contact-me"];
  const currentIndex = routes.indexOf(location.pathname);

  const minSwipeDistance = 150;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      const nextIndex = (currentIndex + 1) % routes.length;
      setDirection("left");
      navigate(routes[nextIndex]);
    }
    if (isRightSwipe) {
      const nextIndex =
        currentIndex - 1 < 0 ? routes.length - 1 : currentIndex - 1;
      setDirection("right");
      navigate(routes[nextIndex]);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    direction,
  };
};

export default useSwipe;
