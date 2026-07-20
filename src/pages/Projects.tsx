import ProjectsColumn from "../components/ProjectsColumn.tsx";
import PageLayout from "../components/PageLayout";

const Projects = () => {
  return (
    <PageLayout>
    <div id="projects" className="allow-vertical-pan">
      <ProjectsColumn></ProjectsColumn>
    </div>
    </PageLayout>
  );
};

export default Projects;
