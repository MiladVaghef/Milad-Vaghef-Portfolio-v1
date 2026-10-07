import { useState } from "react";
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

  const navigateTo = (
    path: string,
    dir: Direction
  ) => {
    if (location.pathname === path) return;

    setDirection(dir);
    navigate(path);
  };

  return (
    <NavigationContext.Provider
      value={{
        direction,
        setDirection,
        navigateTo,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};