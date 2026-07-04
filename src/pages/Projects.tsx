import ProjectsColumn from "../components/ProjectsColumn.tsx";
import useSwipe from "../hooks/useSwipe";
import PageLayout from "../components/PageLayout";


const Projects = () => {
  const swipeHandlers = useSwipe();

  return (
    <PageLayout>
    <div id="projects" {...swipeHandlers} className="allow-vertical-pan">
      <ProjectsColumn></ProjectsColumn>
    </div>
    </PageLayout>
  );
};

export default Projects;
