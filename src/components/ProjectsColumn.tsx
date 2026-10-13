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

  // The container anchors the custom scrollbar thumb (the wrapper's native
  // scrollbar is hidden — its track spanned the whole page).
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

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


  // Keep the bar's veil in sync with the scroll, start every tab at the
  // top (a stale scroll offset would mount the remounted cards clipped above
  // the viewport, where their reveal observers never fire — a whole column
  // reads as empty), and drive the custom scrollbar thumb: its track starts
  // below the category bar and stops just above the floating footer nav pill
  // (the container itself bleeds 30px past the visible page bottom).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bar = barRef.current;
    const container = containerRef.current;
    const thumb = thumbRef.current;

    if (!wrapper || !bar || !container || !thumb) return;

    wrapper.scrollTop = 0;

    // Px between the bar's bottom edge and the top of the thumb's track.
    const TRACK_TOP_GAP = 8;
    // Px between the container's bottom edge and the end of the track.
    // The container bleeds 30px past the visible page bottom, and the fixed
    // footer nav pill floats ~100px above it (20px offset + ~80px tall) —
    // 145 lands the track's end ~115px above the visible bottom, a touch
    // clear of the pill instead of sliding underneath it.
    const TRACK_BOTTOM_GAP = 145;
    // Smallest thumb so the handle stays visible when content barely
    // overflows.
    const MIN_THUMB = 48;

    const sync = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;

      bar.classList.toggle("scrolled", scrollTop > 0);

      const trackTop = bar.offsetHeight + TRACK_TOP_GAP;
      const trackH = container.offsetHeight - trackTop - TRACK_BOTTOM_GAP;
      const scrollable = scrollHeight - clientHeight;

      if (scrollable <= 1 || trackH < MIN_THUMB) {
        thumb.classList.remove("is-visible");
        return;
      }

      const thumbH = Math.min(
        trackH,
        Math.max(MIN_THUMB, (trackH * clientHeight) / scrollHeight),
      );
      const progress = scrollTop / scrollable;
      const y = trackTop + progress * (trackH - thumbH);

      thumb.style.height = `${Math.round(thumbH)}px`;
      thumb.style.transform = `translateY(${Math.round(y)}px)`;
      thumb.classList.add("is-visible");
    };

    wrapper.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();

    return () => {
      wrapper.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
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
    <div ref={containerRef} className="column projects-column-container">

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

      {/* Custom scrollbar thumb — the wrapper's native scrollbar is hidden
          (its track spanned the whole page); this one starts below the
          category bar and stops above the floating footer nav pill. Positions
          come from the scroll/resize sync effect above. */}
      <div ref={thumbRef} className="projects-scroll-thumb" aria-hidden="true" />

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

    // Reveal slides the card up the first time it enters the viewport. The
    // amount must be tiny: full-page screenshot cards (e.g. Bushehr Khorma,
    // ~5× their width ≈ 3400px tall) can only show a sliver of themselves in
    // one fold — with 5% required, such a card sat INVISIBLE on screen until
    // the user scrolled. 1% reveals every card the moment a real slice of it
    // is on screen, while fully off-screen cards still stay hidden.
    <Reveal amount={0.01}>

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