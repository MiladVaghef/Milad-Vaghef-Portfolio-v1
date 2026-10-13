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

  // The scroll container and the sticky category bar inside it — the bar's
  // blur veil only turns on once cards actually scroll under it.
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

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


  // Keep the bar's veil in sync with the scroll, and start every tab at the
  // top: a stale scroll offset would mount the remounted cards clipped above
  // the viewport, where their reveal observers never fire (a whole column
  // reads as empty).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bar = barRef.current;

    if (!wrapper || !bar) return;

    wrapper.scrollTop = 0;

    const sync = () => {
      bar.classList.toggle("scrolled", wrapper.scrollTop > 0);
    };

    wrapper.addEventListener("scroll", sync, { passive: true });
    sync();

    return () => wrapper.removeEventListener("scroll", sync);
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

      <div ref={wrapperRef} className="projects-column-grid-wrapper">

      <div ref={barRef} className="category-slider-wrapper" data-no-swipe>

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



        {/* Remounting on tab change gives every category fresh reveal
            observers; the scroll reset itself lives on the scroll wrapper. */}
        <div key={activeTab} className="projects-column-grid">


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

    // Reveal slides the card up the first time it enters the viewport. A
    // low amount keeps tall cards (which can never show 20% of themselves
    // in a single fold) from staying stuck at opacity 0.
    <Reveal amount={0.05}>

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