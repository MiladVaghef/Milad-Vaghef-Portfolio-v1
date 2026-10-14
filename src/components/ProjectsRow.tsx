import type { Project } from "../data/projects";
import { formatProjectAge } from "../utils/projectDate";
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
          {/* Wrapper makes the cover the positioning context for the date
              pill (bottom-left corner); it carries the image's old 5px
              optical offset so the row's geometry is unchanged. */}
          <div className="projects-row-media">
            <LazyImage className="projects-row-image" src={image} alt={alt} />

            {/* "2 years ago" — glassy pill in the cover's bottom-left corner */}
            <time className="project-image-date" dateTime={project.date}>
              {formatProjectAge(project.date)}
            </time>
          </div>

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
