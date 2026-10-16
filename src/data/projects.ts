// Customade
import customadeLanding from "../assets/images/projects/customade-landing.png";
import customadeAndroid from "../assets/images/projects/customade-android-1.png";
import customadeAndroid2 from "../assets/images/projects/customade-android-2.png";

// Bushehr Khorma
import bushehrKhormaLanding from "../assets/images/projects/bushehr-khorma-landing.png";

// Netflix login concept
import netflixLoginPage from "../assets/images/projects/netflix-login-page.png";
import netflixLoginPageAndroid from "../assets/images/projects/netflix-login-concept-android.png";

// Bmw i8 Magazine
import bmwI8magazine1 from "../assets/images/projects/bmw-i8-magazine-1.png";
import bmwI8magazine2 from "../assets/images/projects/bmw-i8-magazine-2.png";
import bmwI8magazine3 from "../assets/images/projects/bmw-i8-magazine-3.png";
import bmwI8magazine4 from "../assets/images/projects/bmw-i8-magazine-4.png";
import bmwI8magazine5 from "../assets/images/projects/bmw-i8-magazine-5.png";
import bmwI8magazine6 from "../assets/images/projects/bmw-i8-magazine-6.png";
import bmwI8magazine7 from "../assets/images/projects/bmw-i8-magazine-7.png";

// Swiper.js Experiment
import swiperJsExperiment from "../assets/images/projects/swiper-js-experiment.png";
import swiperJsExperiment2 from "../assets/images/projects/swiper-js-experiment-2.png";
import swiperJsExperiment3 from "../assets/images/projects/swiper-js-experiment-3.png";

// Shapi
import shapiHomeFull from "../assets/images/projects/shapi-home-full.png";
import shapiSearchResult from "../assets/images/projects/shapi-search-result.png";
import shapiSearchResultPhone from "../assets/images/projects/shapi-search-result-phone.png";
import shapiHireAdsCategory from "../assets/images/projects/shapi-hire-ads-category.png";
import shapiCreateShop from "../assets/images/projects/shapi-create-shop.png";
import shapiShopProfile from "../assets/images/projects/shapi-shop-profile.png";
import shapiShopsPhone from "../assets/images/projects/shapi-shops-phone.png";
import shapiDashboard from "../assets/images/projects/shapi-dashboard.png";
import shapiCart from "../assets/images/projects/shapi-cart.png";
import shapiProducts from "../assets/images/projects/shapi-products.png";
import shapiSells from "../assets/images/projects/shapi-sells.png";
import shapiWallet from "../assets/images/projects/shapi-wallet.png";
import shapiNotifications from "../assets/images/projects/shapi-notifications.png";
import shapiChatList from "../assets/images/projects/shapi-chat-list.png";
import shapiChat from "../assets/images/projects/shapi-chat.png";
import shapiChatPhone from "../assets/images/projects/shapi-chat-phone.png";
import shapiComments from "../assets/images/projects/shapi-comments.png";
import shapiSupport from "../assets/images/projects/shapi-support.png";
import shapiEditProfile from "../assets/images/projects/shapi-edit-profile.png";
import shapiHomePhone from "../assets/images/projects/shapi-home-phone.png";
import shapiJobsPhone from "../assets/images/projects/shapi-jobs-phone.png";
import shapiTourPhone from "../assets/images/projects/shapi-tour-phone.png";
import shapiShopResults from "../assets/images/projects/shapi-shop-results.png";

// Milad Vaghef Portfolio Old Version
import miladVaghefPortfolioOld from "../assets/images/projects/miladvaghef-porfolio-old-version-home.png";
import miladVaghefPortfolioOld2 from "../assets/images/projects/miladvaghef-porfolio-old-version-projects.png";
import miladVaghefPortfolioOld3 from "../assets/images/projects/miladvaghef-porfolio-old-version-plans.png";
import miladVaghefPortfolioOld4 from "../assets/images/projects/miladvaghef-porfolio-old-version-contact.png";

// Zerva
import zervaHomeDesktop from "../assets/images/projects/zerva-home-desktop.png";
import zervaHomeMobile from "../assets/images/projects/zerva-home-mobile.png";
import zervaAboutDesktop from "../assets/images/projects/zerva-about-desktop.png";
import zervaAboutMobile from "../assets/images/projects/zerva-about-mobile.png";
import zervaProjectsTablet from "../assets/images/projects/zerva-projects-tablet.png";
import zervaProjectsMobile from "../assets/images/projects/zerva-projects-mobile.png";
import zervaContactDesktop from "../assets/images/projects/zerva-contact-desktop.png";
import zervaContactMobile from "../assets/images/projects/zerva-contact-mobile.png";

export interface Project {
  /**
   * Practice/experiment project — shows the outlined "Experiment" pill next
   * to the tech chips (home rows, grid cards, and the lightbox).
   */
  isPractice: boolean;
  /**
   * Concept project (design/idea exercise rather than shipped client work) —
   * shows the outlined "Concept" pill. Independent of `isPractice`, so a
   * project can carry either tag, both, or neither.
   */
  isConcept: boolean;
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
   * When the project was made, as an ISO year-month string ("YYYY-MM") or —
   * when the exact day matters — year-month-day ("YYYY-MM-DD"). Slash
   * separators ("2025/04/12") are accepted too.
   *
   * Shown everywhere as a relative age ("2 years ago") via
   * `formatProjectAge`: month-only dates label at month granularity (they
   * can't claim day precision), while day-qualified dates count "just now"
   * (added today) → "N days ago" before the month labels take over.
   */
  date: string;
  /**
   * Optional attention note shown as a highlighted amber callout inside the
   * project lightbox (below the description) — a caveat the visitor should
   * notice, e.g. a live site whose design has since changed. Deliberately
   * modal-only: cards and home rows don't render it.
   */
  note?: string;
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
  // Zerva Ui
  {
    isPractice: false,
    isConcept: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 2510,
    height: 1536,
    link: "#",
    image: zervaHomeDesktop,
    alt: "Zerva architecture studio website UI design",
    title: "Zerva — Architecture Studio",
    desc: "Designed a multi-page website UI for an architecture studio as part of the Civiko team, covering the homepage, about, projects, and contact pages. Created responsive layouts for desktop, tablet, and mobile. Mohammad Gharibi led the UI design process. The studio's original name, imagery, and content have been replaced with fictional assets for portfolio presentation and confidentiality.",
    tech: ["Figma"],
    date: "2026-09",
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
  // Shapi - Growth Platform
  {
    isPractice: false,
    isConcept: false,
    showWide: false,
    category: "Front-End",
    activeLink: false,
    width: 1624,
    height: 9377,
    link: "#",
    image: shapiHomeFull,
    alt: "Shapi business growth platform frontend",
    title: "Shapi — Growth Platform",
    desc: "Developed the complete front-end of a business growth platform, building 30+ responsive pages with reusable components, interactive features, and modern user experiences while collaborating with the back-end team.",
    tech: ["SCSS", "JavaScript", "Swiper.js"],
    date: "2026-05",
    // Phone shots (≈445px-wide captures) are forced fit-to-frame — their
    // portrait ratio would otherwise auto-detect as "tall" and render
    // blown-up and auto-scrolled (see TALL_RATIO in ProjectModal).
    gallery: [
      shapiHomeFull,
      { src: shapiHomePhone, tall: false },
      { src: shapiTourPhone, tall: false },
      { src: shapiSearchResult, tall: false },
      { src: shapiSearchResultPhone, tall: false },
      shapiShopProfile,
      shapiHireAdsCategory,
      { src: shapiJobsPhone, tall: false },
      { src: shapiShopResults, tall: false },
      { src: shapiShopsPhone, tall: false },
      shapiDashboard,
      shapiCart,
      shapiProducts,
      shapiSells,
      shapiWallet,
      shapiNotifications,
      shapiChatList,
      shapiChat,
      { src: shapiChatPhone, tall: false },
      shapiComments,
      shapiEditProfile,
      shapiCreateShop,
      shapiSupport,
    ],
  },
  // Customade - WordPress
  {
    isPractice: false,
    isConcept: false,
    showWide: false,
    category: "WordPress",
    activeLink: true,
    width: 1280,
    height: 2626,
    link: "https://customade.ir",
    image: customadeLanding,
    alt: "Customade Landing",
    title: "Customade — Custom Shoe E-Commerce Website",
    desc: "Developed a fully functional e-commerce website for a custom shoe brand, converting the UI design into a responsive WordPress experience using Elementor, WooCommerce, and JetEngine.",
    note: "The live website has since been modified by a subsequent development team; the gallery shows my original implementation.",
    tech: ["WordPress", "WooCommerce", "Elementor", "JetEngine"],
    gallery: [
      customadeLanding,
      { src: customadeAndroid, tall: false },
      { src: customadeAndroid2, tall: false },
    ],
    date: "2023-02",
  },
  // Swiper.js Experiment
  {
    isPractice: true,
    isConcept: false,
    showWide: false,
    category: "Front-End",
    activeLink: true,
    width: 1481,
    height: 833,
    link: "https://miladvaghef.github.io/Swiper-Js-Experiment/",
    image: swiperJsExperiment,
    alt: "Swiper.js Experiment Landing",
    title: "Swiper.js Experiment",
    desc: "Built a small frontend project to explore Swiper.js and implement different slider and carousel configurations with responsive behavior.",
    tech: ["Swiper.js", "JavaScript"],
    gallery: [swiperJsExperiment, swiperJsExperiment2, swiperJsExperiment3],
    date: "2025-12",
  },
  // Netflix Login Concept
  {
    isPractice: false,
    isConcept: true,
    showWide: false,
    category: "Front-End",
    activeLink: true,
    width: 1355,
    height: 762,
    link: "https://github.com/MiladVaghef/Netflix-Login-Concept",
    image: netflixLoginPage,
    alt: "Netflix Login Page",
    title: "Netflix — Login Page Concept",
    desc: "Implemented a Netflix login page using HTML and CSS based on a design provided by Nima Khastar, focusing on accurately recreating the original interface and its responsive layout.",
    tech: ["JavaScript", "Css"],
    gallery: [netflixLoginPage, { src: netflixLoginPageAndroid, tall: false }],
    date: "2024-06",
  },
  // Customade - Figma
  {
    isPractice: false,
    isConcept: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1280,
    height: 2626,
    link: "#",
    image: customadeLanding,
    alt: "Customade Landing",
    title: "Customade — Selling Custom Shoes",
    desc: "Designed the complete UI for a custom shoe e-commerce platform in Figma, defining its layouts, visual styling, and product presentation. The design was subsequently implemented as a WordPress website using Elementor and JetEngine.",
    tech: ["Figma", "Auto Layout"],
    gallery: [
      customadeLanding,
      { src: customadeAndroid, tall: false },
      { src: customadeAndroid2, tall: false },
    ],
    date: "2023-01",
  },
  // MiladVaghef Portfolio
  {
    isPractice: false,
    isConcept: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1920,
    height: 1080,
    link: "#",
    image: miladVaghefPortfolioOld,
    alt: "Initial Milad Vaghef portfolio UI design",
    title: "Milad Vaghef Portfolio — Initial UI Design",
    desc: "Designed the original UI concept for my personal portfolio in Figma, creating responsive layouts for desktop, laptop, tablet, and mobile. Developed a reusable component system to maintain consistency across screen sizes. This early design established the foundation for the portfolio's subsequent development and redesign.",
    tech: ["Figma", "Responsive Design", "Components"],
    gallery: [
      miladVaghefPortfolioOld,
      miladVaghefPortfolioOld2,
      miladVaghefPortfolioOld3,
      miladVaghefPortfolioOld4,
    ],
    date: "2025-03",
  },
  // Bushehr Khorma
  {
    isPractice: false,
    isConcept: false,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 1282,
    height: 6493,
    link: "#",
    image: bushehrKhormaLanding,
    alt: "Bushehr Khorma Landing",
    title: "Bushehr Khorma — E-Commerce Homepage UI",
    desc: "Designed the homepage UI for a dates e-commerce website as part of the Codiva team. Independently created the interface in Figma, which was approved by the client. The project did not proceed to development due to the client's personal decision.",
    tech: ["Figma"],
    date: "2023-03",
  },
  // BMW i8 magazine concept
  {
    isPractice: false,
    isConcept: true,
    showWide: false,
    category: "Figma",
    activeLink: false,
    width: 2541,
    height: 3596,
    link: "#",
    image: bmwI8magazine1,
    alt: "BMW i8 Magazine",
    title: "BMW i8 — Super Cars Magazine Concept",
    desc: "Created an automotive magazine concept featuring the BMW i8 for a college assignment, exploring editorial layout, typography, and visual storytelling.",
    tech: ["Figma", "Adobe Illustrator"],
    date: "2025-11",
    gallery: [
      // Fit-to-frame first: the pages open showing the WHOLE spread, not the
      // zoomed auto-scroll view — the slide's zoom button still dives into
      // 1:1 detail on demand.
      { src: bmwI8magazine1, tall: false },
      { src: bmwI8magazine2, tall: false },
      { src: bmwI8magazine3, tall: false },
      { src: bmwI8magazine4, tall: false },
      { src: bmwI8magazine5, tall: false },
      // Double-page landscape spreads — below the tall ratio already, so they
      // fit the frame natively and need no override.
      bmwI8magazine7,
      bmwI8magazine6,
    ],
  },
];
