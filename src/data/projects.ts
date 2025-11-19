import customadeLanding from "../assets/images/projects/customade-landing.png";
import bushehrKhormaLanding from "../assets/images/projects/bushehr-khorma-landing.png";
import cyberWorldLanding from "../assets/images/projects/cyber-world-landing.png";
import netflixLoginPage from "../assets/images/projects/netflix-login-page.png";
import bmwI8magazine from "../assets/images/projects/bmw-i8-magazine.png";
export interface Project {
  isPractice: boolean;
  showWide: boolean;
  category: string;
  activeLink: boolean;
  image: string;
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
    link: "#",
    image: bmwI8magazine,
    alt: "Customade Landing",
    title: "Customade - Selling Custom Shoes",
    desc: "Commerce websites are my main source of works. Customade is a modern website for selling customized shoes.",
    tech: ["Figma", "Adobe Ilustrator"],
  },
];
