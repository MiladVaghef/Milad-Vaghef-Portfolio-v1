import ProjectsColumn from "../components/ProjectsColumn.tsx";
import useSwipe from "../hooks/useSwipe";

const Projects = () => {
  const swipeHandlers = useSwipe();

  return (
    <div id="projects" {...swipeHandlers} className="allow-vertical-pan">
      <ProjectsColumn></ProjectsColumn>
    </div>
  );
};

export default Projects;
