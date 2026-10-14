import type { Project } from "../data/projects";
import Icon from "./Icon";
import LazyImage from "./LazyImage";
import Reveal from "./Reveal";

interface ProjectsRowProps {
  project: Project;
  onOpen: (project: Project) => void;
}

const ProjectsRow = ({ project, onOpen }: ProjectsRowProps) => {
  const { isPractice, image, alt, title, desc, tech } = project;

  return (
    // Reveal animates the row in the first time it scrolls into view.
    <Reveal>
      {/* Opens the project lightbox — the same interaction as the projects-
          page cards. External links live inside the modal's "Visit Project"
          button, so the row itself always opens the lightbox. */}
      <button
        type="button"
        className="projects-row-open"
        onClick={() => onOpen(project)}
        aria-label={`Open ${title}`}
      >
        <div className="projects-row">
          <LazyImage className="projects-row-image" src={image} alt={alt} />

          <div className="column">
            <div className="projects-row-title row">
              <span>{title}</span>
              {project.activeLink && <Icon name="path-link" />}
            </div>

            <p className="light">{desc}</p>

            <ul className="row">
              {tech.map((tech, index) => (
                <li className="tech" key={index}>
                  {tech}
                </li>
              ))}
              <li className={isPractice ? "concept-tag" : "remove"}>Concept</li>
            </ul>
          </div>
        </div>
      </button>
    </Reveal>
  );
};

export default ProjectsRow;
