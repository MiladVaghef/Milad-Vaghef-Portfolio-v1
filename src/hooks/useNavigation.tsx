import {
  createContext,
  useContext,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type Direction = "left" | "right";

interface NavigationContextType {
  direction: Direction;
  setDirection: React.Dispatch<
    React.SetStateAction<Direction>
  >;
  navigateTo: (path: string, direction: Direction) => void;
}

const NavigationContext =
  createContext<NavigationContextType | null>(null);

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

export const useNavigation = () => {
  const context =
    useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigation must be used within NavigationProvider"
    );
  }

  return context;
};