import customadeLanding from "../assets/images/projects/customade-landing.png";
import bushehrKhormaLanding from "../assets/images/projects/bushehr-khorma-landing.png";
import cyberWorldLanding from "../assets/images/projects/cyber-world-landing.png";
import netflixLoginPage from "../assets/images/projects/netflix-login-page.png";
import bmwI8magazine from "../assets/images/projects/bmw-i8-magazine.png";
import swiperJsExperiment from "../assets/images/projects/swiper-js-experiment.png";
import tvTimeClone from "../assets/images/projects/tv-time-clone.png";
import chakodHome from "../assets/images/projects/chakod-home.png";

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
}

export const projectsData: Project[] = [
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
  },
  {
    isPractice: true,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 935,
    height: 1530,
    link: "#",
    image: tvTimeClone,
    alt: "Netflix Login Page",
    title: "Netflix - Login Page",
    desc: "A very clean and easy to use Netflix login page. As simple as it sounds.",
    tech: ["JavaScript", "Css"],
  },
  {
    isPractice: true,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1920,
    height: 1080,
    link: "#",
    image: cyberWorldLanding,
    alt: "Milad Vaghef Landing",
    title: "Cyber World - Characters Showcase",
    desc: "My designs are not limited to website boundaries. I can design user interfaces for any device and application, regardless of the concept.",
    tech: ["Figma", "Auto Layout"],
  },
];
