import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { projectsData, type Project } from "../data/projects";
import Icon, { type IconType } from "./Icon";
import LazyImage from "./LazyImage";
import Reveal from "./Reveal";
import ProjectModal from "./ProjectModal";

// Swiper
import Swiper from "swiper";
import type SwiperCore from "swiper";
import { Navigation } from "swiper/modules";

const categories: { label: string; icon: IconType }[] = [
  { label: "Front-End", icon: "front-end" },
  { label: "WordPress", icon: "wordpress" },
  { label: "Figma", icon: "figma" },
];

const ProjectsColumn = () => {
  const location = useLocation();

  // Which project's lightbox is currently open (null = closed).
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const swiperRef = useRef<HTMLDivElement | null>(null);
  const swiperInstance = useRef<SwiperCore | null>(null);

  // Scroll container behind the sticky category bar + the bar itself — used to
  // fade the bar's blur veil in only once cards actually scroll under it.
  const gridWrapperRef = useRef<HTMLDivElement | null>(null);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);

  const currentHash = decodeURIComponent(location.hash.replace("#", ""));

  const activeTab =
    categories.find((c) => c.label === currentHash)?.label ||
    categories[0].label;


  useEffect(() => {
    const index = categories.findIndex(
      (category) => category.label === activeTab
    );

    if (index !== -1 && swiperInstance.current) {
      swiperInstance.current.slideTo(index);
    }
  }, [activeTab]);


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

          window.location.hash = encodeURIComponent(category.label);
        },
      },
    });


    return () => {
      swiperInstance.current?.destroy(true, true);
      swiperInstance.current = null;
    };

  }, []);


  // The bar's blur veil (its ::before layer) only makes sense once cards are
  // actually scrolling underneath it. At rest — before any scroll — the sticky
  // bar sits directly over the FIRST card's top edge, so an always-on veil
  // smears a white blurred band across the image for no reason. Toggle a
  // class instead of state: the scroll event fires often and re-rendering the
  // whole grid for it would be wasteful (React never rewrites this className,
  // so the DOM-toggled class survives re-renders).
  useEffect(() => {
    const grid = gridWrapperRef.current;
    const bar = categoryBarRef.current;

    if (!grid || !bar) return;

    const sync = () => {
      bar.classList.toggle("scrolled", grid.scrollTop > 0);
    };

    grid.addEventListener("scroll", sync, { passive: true });
    sync();

    // Re-sync after tab switches: the grid's content (and scroll height)
    // changes, which can clamp scrollTop back to 0.
    return () => grid.removeEventListener("scroll", sync);
  }, [activeTab]);


  const filteredProjects = projectsData.filter(
    (project) => project.category === activeTab
  );


  // Masonry column calculation
  const columns: Project[][] = [[], []];

  const columnHeights = [0, 0];


  filteredProjects.forEach((project) => {
    const imageRatio = project.height / project.width;


    // Estimate image height based on column width.
    // 500 is approximate width of the card.
    // You can adjust this if needed.
    const estimatedHeight = imageRatio * 500;


    const shortestColumn = columnHeights.indexOf(
      Math.min(...columnHeights)
    );


    columns[shortestColumn].push(project);

    columnHeights[shortestColumn] += estimatedHeight;
  });



  return (
    <div className="column projects-column-container">

      <div ref={gridWrapperRef} className="projects-column-grid-wrapper">

      <div
        ref={categoryBarRef}
        className="category-slider-wrapper"
        data-no-swipe
      >

        <div
          ref={swiperRef}
          className="swiper projects-column-category"
        >

          <div className="swiper-wrapper">

            {categories.map(({ label, icon }) => (

              <div
                key={label}
                className="swiper-slide"
              >

                <div
                  className={`category-slide row ${
                    activeTab === label
                      ? "category-active"
                      : ""
                  }`}

                  onClick={() => {

                    const index = categories.findIndex(
                      (category) =>
                        category.label === label
                    );

                    swiperInstance.current?.slideTo(index);

                  }}
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


          <div className="projects-column-grid-column">

            {columns[0].map((project) => (

              <ProjectCard
                key={project.title}
                project={project}
                onOpen={setActiveProject}
              />

            ))}

          </div>



          <div className="projects-column-grid-column">

            {columns[1].map((project) => (

              <ProjectCard
                key={project.title}
                project={project}
                onOpen={setActiveProject}
              />

            ))}

          </div>


        </div>

      </div>


      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

    </div>
  );
};



const ProjectCard = ({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) => {

  return (

    // Reveal slides the card up the first time it enters the viewport.
    <Reveal>

      <div className="projects-column">

        <button
          type="button"
          className="projects-column-open"
          onClick={() => onOpen(project)}
          aria-label={`Open ${project.title}`}
        >

          <ProjectContent project={project} />

        </button>

      </div>

    </Reveal>

  );

};



const ProjectContent = ({
  project,
}: {
  project: Project;
}) => {

  const aspectRatio =
    project.height / project.width;


  return (

    <>

      <div className="projects-column-media">

        <LazyImage

          className="image-wrapper"

          src={project.image}

          alt={project.alt}

          style={{

            "--aspect-ratio": aspectRatio,

          } as React.CSSProperties}

        />


        {/* "N pages" badge — only for multi-image projects */}
        {project.gallery && project.gallery.length > 1 && (

          <span className="projects-column-badge">

            <Icon name="grid" />

            {project.gallery.length} pages

          </span>

        )}

      </div>



      <div className="details column">

        <div className="projects-column-title row">

          <span className="medium">
            {project.title}
          </span>


          {project.activeLink && (
            <Icon name="path-link" />
          )}

        </div>


        <p className="light">
          {project.desc}
        </p>



        <ul className="row">

          {project.tech.map((tech) => (

            <li
              key={tech}
              className="tech"
            >
              {tech}
            </li>

          ))}


          {project.isPractice && (
            <li className="concept-tag">
              Concept
            </li>
          )}

        </ul>


      </div>

    </>

  );
};


export default ProjectsColumn;