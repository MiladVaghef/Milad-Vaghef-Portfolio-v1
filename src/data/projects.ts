import customadeLanding from "../assets/images/projects/customade-landing.png";
import bushehrKhormaLanding from "../assets/images/projects/bushehr-khorma-landing.png";
import miladVaghefLanding from "../assets/images/projects/milad-vaghef-landing.png";
import cyberWorldLanding from "../assets/images/projects/cyber-world-landing.png";
import netflixLoginPage from "../assets/images/projects/netflix-login-page.png";

export interface Project {
  isPractice: boolean;
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
    category: "Wordpress",
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
    category: "Front-End",
    activeLink: true,
    link: "https://github.com/MiladVaghef/Milad-Vaghef-Portfolio-v1/",
    image: miladVaghefLanding,
    alt: "Milad Vaghef Landing",
    title: "Milad Vaghef - Portfolio",
    desc: "Well there’s not much to say, I like minimal designs for portfolio. I can design similar websites for your need.",
    tech: ["JavaScript", "TypeScript", "React", "Scss"],
  },
  {
    isPractice: false,
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
    isPractice: false,
    category: "Figma",
    activeLink: false,
    link: "#",
    image: miladVaghefLanding,
    alt: "Milad Vaghef Landing",
    title: "Milad Vaghef - Portfolio",
    desc: "Well there’s not much to say, I like minimal designs for portfolio. I can design similar websites for your need.",
    tech: ["Figma", "Components", "Auto Layout", "Responsive"],
  },
];
