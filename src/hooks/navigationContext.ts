import { createContext, useContext } from "react";

export type Direction = "left" | "right";

export interface NavigationContextType {
  direction: Direction;
  setDirection: React.Dispatch<React.SetStateAction<Direction>>;
  navigateTo: (path: string, direction: Direction) => void;
}

export const NavigationContext =
  createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigation must be used within NavigationProvider"
    );
  }

  return context;
};