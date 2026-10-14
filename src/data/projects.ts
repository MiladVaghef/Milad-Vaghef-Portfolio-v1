import customadeLanding from "../assets/images/projects/customade-landing.png";
import bushehrKhormaLanding from "../assets/images/projects/bushehr-khorma-landing.png";
import netflixLoginPage from "../assets/images/projects/netflix-login-page.png";
import bmwI8magazine from "../assets/images/projects/bmw-i8-magazine.png";
import swiperJsExperiment from "../assets/images/projects/swiper-js-experiment.png";
import chakodHome from "../assets/images/projects/chakod-home.png";

// Zerva test/mock project — design screenshots.
import zervaHomeDesktop from "../assets/images/projects/zerva-home-desktop.png";
import zervaHomeMobile from "../assets/images/projects/zerva-home-mobile.png";
import zervaAboutDesktop from "../assets/images/projects/zerva-about-desktop.png";
import zervaAboutMobile from "../assets/images/projects/zerva-about-mobile.png";
import zervaProjectsTablet from "../assets/images/projects/zerva-projects-tablet.png";
import zervaProjectsMobile from "../assets/images/projects/zerva-projects-mobile.png";
import zervaContactDesktop from "../assets/images/projects/zerva-contact-desktop.png";
import zervaContactMobile from "../assets/images/projects/zerva-contact-mobile.png";

export interface Project {
  isPractice: boolean;
  showWide: boolean;
  category: string;
  activeLink: boolean;
  image: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  link: string;
  desc: string;
  tech: string[];
  /**
   * When the project was made, as an ISO year-month string ("YYYY-MM").
   * Shown everywhere as a relative age ("2 years ago") via
   * `formatProjectAge` — month granularity keeps the label stable (it only
   * flips when the project's month comes around, not mid-month).
   */
  date: string;
  /**
   * Extra images/pages shown in the popup lightbox slider. When present with
   * 2+ items the card shows a "N pages" badge and clicking opens the slider.
   * Projects without it fall back to their single cover `image`.
   *
   * Each entry is either a plain image URL (no zoom) or an object carrying
   * per-image options — e.g. zoom THIS image only:
   *   gallery: [
   *     desktopShot,
   *     { src: phoneShot, zoom: true },
   *     anotherShot,
   *   ]
   */
  gallery?: GalleryImage[];
  /**
   * Project-wide DEFAULT for the modal presentation: show this project's
   * lightbox images ZOOMED — at their native 1:1 pixel size, never shrunk to
   * fit — inside a fixed-height viewport that can be panned by hand in both
   * axes. Use it for screenshots whose fine detail gets lost in the default
   * fit-to-frame view. Optional (off by default).
   *
   * Gallery entries written as objects can override this per image via their
   * own `zoom` flag (see `GalleryImage`), so a project can mix zoomed and
   * fit-to-frame images.
   */
  zoomImages?: boolean;
}

/**
 * One lightbox image: a plain URL (no zoom), or an object with per-image
 * options. `zoom` and `tall` on the object override the project-wide
 * `zoomImages` default / the aspect-ratio auto-detection for that single image.
 */
export type GalleryImage =
  | string
  | {
      src: string;
      /**
       * Show THIS image zoomed — native 1:1 pixels in a pannable window.
       * Falls back to the project's `zoomImages` flag when omitted.
       */
      zoom?: boolean;
      /**
       * Override the "tall" auto-detection (ratio ≥ 0.9 → scrollable full-
       * width window). `tall: false` forces fit-to-frame so the whole image
       * stays visible at once (e.g. narrow phone screenshots that would
       * otherwise be blown up and auto-scrolled); `tall: true` forces the
       * tall treatment. Omit to auto-detect from the image's aspect ratio.
       */
      tall?: boolean;
    };

export const projectsData: Project[] = [
  {
    isPractice: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 2510,
    height: 1536,
    link: "#",
    image: zervaHomeDesktop,
    alt: "Zerva website UI design",
    title: "Zerva — Architecture Studio ",
    desc: "Designed a complete website UI for an architecture studio, including the homepage, about, projects, and contact pages, with responsive layouts for desktop, tablet, and mobile. The original studio name, images, and content have been replaced with fictional branding and assets for portfolio presentation and confidentiality purposes.",
    tech: ["Figma"],
    date: "2026-10",
    gallery: [
      zervaHomeDesktop,
      { src: zervaHomeMobile, tall: false },
      zervaAboutDesktop,
      { src: zervaAboutMobile, tall: false },
      zervaProjectsTablet,
      { src: zervaProjectsMobile, tall: false },
      zervaContactDesktop,
      { src: zervaContactMobile, tall: false },
    ],
  },
  {
    isPractice: false,
    showWide: false,
    category: "Front-End",
    activeLink: false,
    width: 1624,
    height: 9377,
    link: "#",
    image: chakodHome,
    alt: "Chakod Business Growth Platform",
    title: "Chakod - Growth Platform",
    desc: "Developed the complete front-end of a business growth platform, building 30+ responsive pages with reusable components, interactive features, and modern user experiences while collaborating with the back-end team.",
    tech: ["SCSS", "JavaScript", "Swiper.js"],
    date: "2026-07",
  },
  {
    isPractice: false,
    showWide: false,
    category: "WordPress",
    activeLink: true,
    width: 1280,
    height: 2626,
    link: "https://customade.ir",
    image: customadeLanding,
    alt: "Customade Landing",
    title: "Customade - Custom Shoe E-Commerce Website",
    desc: "Developed a fully functional e-commerce website for a custom shoe brand, converting the UI design into a responsive WordPress experience using Elementor, WooCommerce, and JetEngine.",
    tech: ["WordPress", "WooCommerce", "Elementor", "JetEngine"],
    date: "2025-03",
  },
  {
    isPractice: true,
    showWide: false,
    category: "Front-End",
    activeLink: true,
    width: 1481,
    height: 833,
    link: "https://miladvaghef.github.io/Swiper-Js-Experiment/",
    image: swiperJsExperiment,
    alt: "Swiper.js Experiment Landing",
    title: "Swiper.js Experiment",
    desc: "This project was built to practice creating responsive sliders and exploring different slider types using the Swiper.js library.",
    tech: ["Swiper.js", "Javascript"],
    date: "2026-07",
  },
  {
    isPractice: true,
    showWide: false,
    category: "Front-End",
    activeLink: true,
    width: 1355,
    height: 762,
    link: "https://github.com/MiladVaghef/Netflix-Login-Concept",
    image: netflixLoginPage,
    alt: "Netflix Login Page",
    title: "Netflix - Login Page",
    desc: "A very clean and easy to use Netflix login page. As simple as it sounds.",
    tech: ["JavaScript", "Css"],
    date: "2025-04",
  },
  {
    isPractice: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1280,
    height: 2626,
    link: "#",
    image: customadeLanding,
    alt: "Customade Landing",
    title: "Customade - Selling Custom Shoes",
    desc: "Created the complete UI design for a custom shoe e-commerce platform, focusing on a clean shopping experience and modern visual identity. The design was then transformed into a fully functional WordPress website using Elementor and JetEngine.",
    tech: ["Figma", "Auto Layout"],
    date: "2025-03",
  },
  {
    isPractice: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1282,
    height: 6493,
    link: "#",
    image: bushehrKhormaLanding,
    alt: "Bushehr Khorma Landing",
    title: "Bushehr Dates - Date sales industry",
    desc: "Solely developed the front-end of a 30+ page business growth platform, architecting a custom SCSS utility framework, building reusable UI components, and delivering responsive, interactive user experiences while collaborating with the back-end team.",
    tech: ["Figma"],
    date: "2025-03",
  },
  {
    isPractice: true,
    showWide: true,
    category: "Figma",
    activeLink: false,
    width: 3628,
    height: 1711,
    link: "#",
    image: bmwI8magazine,
    alt: "BMW i8 Magazine",
    title: "BMW i8 - Super Cars Magazine",
    desc: "This BMW i8 supercar magazine is a concept created for a college assignment, designed to show my ability to craft clean editorial layouts and present automotive content with a professional, modern style.",
    tech: ["Figma", "Adobe Ilustrator"],
    date: "2025-11",
  },
];
