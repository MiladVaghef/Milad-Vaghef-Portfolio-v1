import { lazy, Suspense } from "react";
import Icon from "../components/Icon";
import { InViewSections } from "../App";
import { NavLink } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { projectsData } from "../data/projects";
import { workHistoryData } from "../data/workHistory";
import useSwipe from "../hooks/useSwipe";

const ProjectsRow = lazy(() => import("../components/ProjectsRow"));
const WorkHistory = lazy(() => import("../components/WorkHistory"));

interface HomeProps {
  setInViewSections?: React.Dispatch<React.SetStateAction<InViewSections>>;
}

const Home = ({ setInViewSections }: HomeProps) => {
  const swipeHandlers = useSwipe();
  const limitedProjects = projectsData.slice(0, 4);
  const thresholdSteps = Array.from({ length: 100 }, (_, i) => i * 0.01);

  // Biography Section
  const { ref: bioRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      setInViewSections?.((prev) => ({
        ...prev,
        "#biography": entry.intersectionRatio,
      }));
    },
  });

  // Projects Section
  const { ref: projectsRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      setInViewSections?.((prev) => ({
        ...prev,
        "#home-row-projects": entry.intersectionRatio,
      }));
    },
  });

  // Work History Section
  const { ref: workRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      setInViewSections?.((prev) => ({
        ...prev,
        "#home-work-history": entry.intersectionRatio,
      }));
    },
  });

  return (
    <div id="home" {...swipeHandlers} className="allow-vertical-pan">
      <div id="home-holder" className="column">
        <div id="biography" className="column" ref={bioRef}>
          <p>
            I'm a<span className="blue-text semi-bold"> 19-year-old </span>
            passionate <span className="blue-text semi-bold">
              {" "}
              front-end{" "}
            </span>{" "}
            web designer with a keen eye for creating clean and visually
            compelling{" "}
            <span className="blue-text semi-bold">user interfaces</span>.
            Currently pursuing a degree in photography and having completed a
            year of training at a web design academy, I bring both technical
            expertise and a strong creative vision to my work.
          </p>
          <p>
            My education has equipped me with a solid foundation in web design,
            and I'm proud to hold a
            <span className="blue-text semi-bold">
              {" "}
              web designing certificate{" "}
            </span>
            that validates my skills in this field.
          </p>
          <p>
            Drawing inspiration from my photography studies, I merge aesthetics
            with functionality to craft web experiences that are not only
            beautiful but user-friendly. I believe great design is about
            striking the perfect balance between form and function, creating
            websites that resonate with users and elevate brands.
          </p>
          <p>
            Based in Iran, I've had the opportunity to work on a diverse range
            of projects, each one allowing me to refine my craft and push
            creative boundaries. Whether I'm collaborating on a new concept or
            bringing a vision to life from start to finish, I'm dedicated to
            delivering high-quality, innovative designs that exceed client
            expectations.
          </p>{" "}
        </div>

        <div id="home-row-projects" className="column" ref={projectsRef}>
          {limitedProjects.map((project, rowprojectslazy) => (
            <Suspense
              key={rowprojectslazy}
              fallback={
                <div className="row-projects-lazy row">
                  <div className="lazy-animation"></div>
                  <span className="lazy-animation"></span>
                </div>
              }
            >
              <ProjectsRow {...project} />
            </Suspense>
          ))}

          <div id="all-projects-link" className="row semi-bold">
            <NavLink to={"/projects"}>View Full Project</NavLink>
            <Icon name="right-arrow"></Icon>
          </div>
        </div>

        <div id="home-work-history" className="column-reverse" ref={workRef}>
          {workHistoryData.map((workData, index) => (
            <Suspense
              key={index}
              fallback={
                <div className="work-history-lazy">
                  <div className="lazy-animation"></div>
                  <span className="lazy-animation"></span>
                </div>
              }
            >
              <WorkHistory {...workData} />
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
