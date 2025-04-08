import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useSwipe = () => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track screen width
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 850;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const routes = ["/", "/projects", "/contact-me"];
  const currentIndex = routes.indexOf(location.pathname);

  const minSwipeDistance = 50;

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

    if (isLeftSwipe && currentIndex < routes.length - 1) {
      navigate(routes[currentIndex + 1]);
    }
    if (isRightSwipe && currentIndex > 0) {
      navigate(routes[currentIndex - 1]);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

export default useSwipe;
