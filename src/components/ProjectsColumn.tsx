import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { projectsData } from "../data/projects";
import Icon, { type IconType } from "./Icon";

// Swiper
import Swiper from "swiper";
import type SwiperCore from "swiper";
import { Navigation } from "swiper/modules";

export interface Project {
  title: string;
  category: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  desc: string;
  tech: string[];
  link?: string;
  activeLink: boolean;
  showWide?: boolean;
  isPractice?: boolean;
}

const categories: { label: string; icon: IconType }[] = [
  { label: "WordPress", icon: "wordpress" },
  { label: "Figma", icon: "figma" },
  { label: "Front-End", icon: "front-end" },
  { label: "Graphic Design", icon: "graphic-design" },
];

const ProjectsColumn = () => {
  const location = useLocation();
  const swiperRef = useRef<HTMLDivElement | null>(null);
  const swiperInstance = useRef<SwiperCore | null>(null);

  const [activeTab, setActiveTab] = useState(categories[0].label);

  // Sync URL hash → swiper
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.replace("#", ""));
    const index = categories.findIndex((c) => c.label === hash);
    if (index !== -1 && swiperInstance.current) {
      swiperInstance.current.slideTo(index);
    }
  }, [location.hash]);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperInstance.current = new Swiper(swiperRef.current, {
      modules: [Navigation],
      slidesPerView: "auto",
      centeredSlides: true,
      grabCursor: true,
      spaceBetween: 0,
      navigation: {
        nextEl: ".projects-next",
        prevEl: ".projects-prev",
      },
      on: {
        slideChange(swiper) {
          const category = categories[swiper.activeIndex];
          if (!category) return;
          setActiveTab(category.label);
          window.history.replaceState(
            null,
            "",
            `#${encodeURIComponent(category.label)}`
          );
        },
      },
    });

    return () => {
      swiperInstance.current?.destroy(true, true);
      swiperInstance.current = null;
    };
  }, []);

  const filteredProjects = projectsData.filter(
    (project) => project.category === activeTab
  );

  return (
    <div className="column projects-column-container">
      <div className="category-slider-wrapper">
        <div ref={swiperRef} className="swiper projects-column-category">
          <div className="swiper-wrapper">
            {categories.map(({ label, icon }) => (
              <div key={label} className="swiper-slide">
                <div
                  className={`category-slide row ${
                    activeTab === label ? "category-active" : ""
                  }`}
                >
                  <Icon name={icon} />
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="projects-prev swiper-button-prev" />
        <div className="projects-next swiper-button-next" />
      </div>

      <div className="projects-column-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.title}
            className={`projects-column column ${
              project.showWide ? "wide-project" : ""
            }`}
          >
            {project.activeLink ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="fit-content"
              >
                <ProjectContent project={project} />
              </a>
            ) : (
              <ProjectContent project={project} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectContent = ({ project }: { project: Project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // calculate aspect ratio
  const aspectRatio = project.height / project.width;

  return (
    <>
      <div
        className={`image-wrapper ${imageLoaded ? "loaded" : ""}`}
        style={{ "--aspect-ratio": aspectRatio } as React.CSSProperties}
      >
        <img
          src={project.image}
          alt={project.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="projects-column-title row">
        <span className="medium">{project.title}</span>
        {project.activeLink && <Icon name="path-link" />}
      </div>

      <p className="light">{project.desc}</p>

      <ul className="row">
        {project.tech.map((tech) => (
          <li key={tech} className="tech">
            {tech}
          </li>
        ))}
        {project.isPractice && <li className="concept-tag">Concept</li>}
      </ul>
    </>
  );
};

export default ProjectsColumn;
