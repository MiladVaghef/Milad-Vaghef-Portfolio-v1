// src/contexts/NavigationContext.tsx
import { createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Direction = "left" | "right" | null;

interface NavigationContextType {
  direction: Direction;
  navigateTo: (path: string, dir: Direction) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [direction, setDirection] = useState<Direction>(null);
  const navigate = useNavigate();

  const navigateTo = (path: string, dir: Direction) => {
    setDirection(dir);
    navigate(path);
  };

  return (
    <NavigationContext.Provider value={{ direction, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
