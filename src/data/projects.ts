import customadeLanding from "../assets/images/projects/customade-landing.png";
import bushehrKhormaLanding from "../assets/images/projects/bushehr-khorma-landing.png";
import cyberWorldLanding from "../assets/images/projects/cyber-world-landing.png";
import netflixLoginPage from "../assets/images/projects/netflix-login-page.png";
import bmwI8magazine from "../assets/images/projects/bmw-i8-magazine.png";
import bloodPressurePoster from "../assets/images/projects/erfankala-blood-pressure-poster.png";
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
    width: 1481,
    height: 833,
    link: "https://customade.ir",
    image: customadeLanding,
    alt: "Customade Landing",
    title: "Customade - Selling Custom Shoes",
    desc: "Commerce websites are my main source of works. Customade is a modern website for selling customized shoes.",
    tech: ["Wordpress", "Woocommerce", "Elementor"],
  },
  {
    isPractice: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1280,
    height: 720,
    link: "#",
    image: bushehrKhormaLanding,
    alt: "Bushehr Khorma Landing",
    title: "Bushehr Dates - Date sales industry",
    desc: "Having a clean and eye catching user interface keeps your customers happy. You can witness that in Busher Dates.",
    tech: ["Figma"],
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
    width: 1481,
    height: 833,
    link: "#",
    image: customadeLanding,
    alt: "Customade Landing",
    title: "Customade - Selling Custom Shoes",
    desc: "Commerce websites are my main source of works. Customade is a modern website for selling customized shoes.",
    tech: ["Figma", "Auto Layout"],
  },
  {
    isPractice: true,
    showWide: true,
    category: "Graphic Design",
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
    isPractice: false,
    showWide: false,
    category: "Graphic Design",
    activeLink: false,
    width: 512,
    height: 911,
    link: "#",
    image: bloodPressurePoster,
    alt: "ErfanKala Blood Pressure Poster",
    title: "ErfanKala - Blood Pressure Poster",
    desc: "Designed for ErfanKala, this blood pressure device poster was created as a printed advertisement, presenting key product features in a clear layout for wall displays and customer outreach.",
    tech: ["Adobe Ilustrator"],
  },
];
