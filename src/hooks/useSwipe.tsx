import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../hooks/navigationContext";

const useSwipe = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  const location = useLocation();

  const { navigateTo } = useNavigation();

  const touchStartXRef = useRef(0);

  const touchStartYRef = useRef(0);

  const touchStartTimeRef = useRef(0);

  const ignoreSwipeRef = useRef(false);

  // Scroll snapshot from touchstart — if anything scrolled while the finger
  // was down, the gesture was a scroll that drifted sideways, never a page
  // swipe, no matter how it happened to end.
  const scrollStartRef = useRef<{
    el: HTMLElement | null;
    top: number;
    win: number;
  }>({ el: null, top: 0, win: 0 });

  const routes = ["/home", "/projects", "/contact-me"];

  const currentPath = location.pathname === "/" ? "/home" : location.pathname;

  const currentIndex = routes.indexOf(currentPath);

  // Tightened for touch: a page swipe must be clearly horizontal (≥2:1) and
  // cover real distance, so ordinary scrolling flicks can't navigate.
  const minSwipeDistance = 70;

  const maxTouchDuration = 700;

  const maxVerticalDeviation = 60;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Nearest ancestor that can actually scroll vertically — used to detect
  // gestures that overlap a native scroll.
  const findScrollableAncestor = (start: EventTarget | null) => {
    let node = start as HTMLElement | null;

    while (node && node !== document.body) {
      if (node.scrollHeight > node.clientHeight + 1) {
        const { overflowY } = window.getComputedStyle(node);

        if (overflowY === "auto" || overflowY === "scroll") return node;
      }

      node = node.parentElement;
    }

    return null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;

    const target = e.target as HTMLElement;

    if (target.closest("[data-no-swipe]")) {
      ignoreSwipeRef.current = true;

      return;
    }

    ignoreSwipeRef.current = false;

    const scroller = findScrollableAncestor(e.target);

    scrollStartRef.current = {
      el: scroller,
      top: scroller?.scrollTop ?? 0,
      win: window.scrollY,
    };

    const touch = e.targetTouches[0];

    touchStartXRef.current = touch.clientX;

    touchStartYRef.current = touch.clientY;

    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || ignoreSwipeRef.current) {
      return;
    }

    if (currentIndex === -1) {
      return;
    }

    // If anything actually scrolled while the finger was down, this was a
    // scroll gesture (possibly carrying momentum), not a page swipe.
    const { el: scroller, top: startTop, win: startWin } =
      scrollStartRef.current;

    if (window.scrollY !== startWin) return;

    if (scroller && scroller.scrollTop !== startTop) return;

    const touch = e.changedTouches[0];

    const deltaX = touchStartXRef.current - touch.clientX;

    const deltaY = touchStartYRef.current - touch.clientY;

    const timeElapsed = Date.now() - touchStartTimeRef.current;

    const absDeltaX = Math.abs(deltaX);

    const absDeltaY = Math.abs(deltaY);

    // Clearly horizontal: at least minSwipeDistance AND twice the vertical
    // travel — diagonal scroll flicks no longer qualify.
    const isHorizontalSwipe =
      absDeltaX > minSwipeDistance && absDeltaX > absDeltaY * 2;

    const isWithinVerticalLimit = absDeltaY <= maxVerticalDeviation;

    const isQuickEnough = timeElapsed < maxTouchDuration;

    if (!isHorizontalSwipe || !isWithinVerticalLimit || !isQuickEnough) {
      return;
    }

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
