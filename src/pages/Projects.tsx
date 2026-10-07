import ProjectsColumn from "../components/ProjectsColumn.tsx";
import PageLayout from "../components/PageLayout";
import useAppReady from "../hooks/useAppReady";

const Projects = () => {
  useAppReady();

  return (
    <PageLayout>
    <div id="projects" className="allow-vertical-pan">
      <ProjectsColumn></ProjectsColumn>
    </div>
    </PageLayout>
  );
};

export default Projects;
