import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const Projects = lazy(() => import("../pages/Projects"));
const Contact = lazy(() => import("../pages/Contact"));

// routes.ts
export const ROUTE_CONFIG = {
  HOME: { path: "/", element: <Home /> },
  ALT_HOME: { path: "/home", element: <Home /> },
  PROJECTS: { path: "/projects", element: <Projects /> },
  CONTACT: { path: "/contact-me", element: <Contact /> },
  NOT_FOUND: { path: "*", element: <Navigate to="/home" replace /> },
} as const;

export type ValidPath =
  (typeof ROUTE_CONFIG)[keyof typeof ROUTE_CONFIG]["path"];
export const VALID_PATHS = Object.values(ROUTE_CONFIG)
  .map((r) => r.path)
  .filter((p) => p !== "*") as ValidPath[];
