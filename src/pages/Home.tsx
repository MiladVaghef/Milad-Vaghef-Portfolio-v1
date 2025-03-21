import { lazy, Suspense } from "react";
import { projectsData } from "../data/projects";
import { workHistoryData } from "../data/workHistory";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";

const ProjectsRow = lazy(() => import("../components/ProjectsRow"));
const WorkHistory = lazy(() => import("../components/WorkHistory"));

const Home = () => {
  return (
    <div id="home" className="column">
      <div id="biography" className="column">
        <p>
          I'm a<span className="blue-text semi-bold"> 19-year-old </span>
          passionate <span className="blue-text semi-bold">
            {" "}
            front-end{" "}
          </span>{" "}
          web designer with a keen eye for creating clean and visually
          compelling{" "}
          <span className="blue-text semi-bold">user interfaces</span>.
          Currently pursuing a degree in photography and having completed a year
          of training at a web design academy, I bring both technical expertise
          and a strong creative vision to my work.
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
          beautiful but user-friendly. I believe great design is about striking
          the perfect balance between form and function, creating websites that
          resonate with users and elevate brands.
        </p>

        <p>
          Based in Iran, I've had the opportunity to work on a diverse range of
          projects, each one allowing me to refine my craft and push creative
          boundaries. Whether I'm collaborating on a new concept or bringing a
          vision to life from start to finish, I'm dedicated to delivering
          high-quality, innovative designs that exceed client expectations.
        </p>
      </div>
      <div id="home-row-projects" className="column">
        {projectsData.map((project, index) => (
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsRow key={index} {...project} />{" "}
          </Suspense>
        ))}
        <div id="all-projects-link" className="row semi-bold">
          <NavLink to={"/projects"}>View Full Project</NavLink>
          <Icon name="right-arrow"></Icon>
        </div>
      </div>
      <div id="home-work-history" className="column-reverse">
        {workHistoryData.map((workData, index) => (
          <Suspense fallback={<div>Loading...</div>}>
            <WorkHistory key={index} {...workData} />{" "}
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Home;
