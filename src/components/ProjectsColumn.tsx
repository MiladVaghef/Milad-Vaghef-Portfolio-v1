import { useEffect, useRef, useState } from "react";
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
  { label: "Front-End", icon: "front-end" },
  { label: "WordPress", icon: "wordpress" },
  { label: "Figma", icon: "figma" },
];

const ProjectsColumn = () => {
  const location = useLocation();

  const swiperRef = useRef<HTMLDivElement | null>(null);
  const swiperInstance = useRef<SwiperCore | null>(null);

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

      <div className="category-slider-wrapper" data-no-swipe>

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



      <div className="projects-column-grid-wrapper">

        <div className="projects-column-grid">


          <div className="projects-column-grid-column">

            {columns[0].map((project) => (

              <ProjectCard
                key={project.title}
                project={project}
              />

            ))}

          </div>



          <div className="projects-column-grid-column">

            {columns[1].map((project) => (

              <ProjectCard
                key={project.title}
                project={project}
              />

            ))}

          </div>


        </div>

      </div>


    </div>
  );
};



const ProjectCard = ({
  project,
}: {
  project: Project;
}) => {

  return (

    <div className="projects-column">

      {project.activeLink ? (

        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
        >

          <ProjectContent project={project} />

        </a>

      ) : (

        <ProjectContent project={project} />

      )}

    </div>

  );

};



const ProjectContent = ({
  project,
}: {
  project: Project;
}) => {

  const [imageLoaded, setImageLoaded] = useState(false);


  const aspectRatio =
    project.height / project.width;


  return (

    <>

      <div
        className={`image-wrapper ${
          imageLoaded ? "loaded" : ""
        }`}

        style={{
          "--aspect-ratio": aspectRatio,
        } as React.CSSProperties}
      >

        <img
          src={project.image}
          alt={project.alt}
          loading="lazy"
          decoding="async"

          onLoad={() =>
            setImageLoaded(true)
          }
        />

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