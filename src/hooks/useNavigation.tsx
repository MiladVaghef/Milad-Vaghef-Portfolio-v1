import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationContext, type Direction } from "./navigationContext";

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [direction, setDirection] =
    useState<Direction>("left");

  const navigateTo = useCallback(
    (path: string, dir: Direction) => {
      if (location.pathname === path) return;

      setDirection(dir);
      navigate(path);
    },
    [navigate, location.pathname],
  );

  // Stable identity: memoized consumers (PathRoutes) must not re-render just
  // because this provider re-renders — only real navigation state changes
  // should propagate through context.
  const value = useMemo(
    () => ({
      direction,
      setDirection,
      navigateTo,
    }),
    [direction, navigateTo],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};