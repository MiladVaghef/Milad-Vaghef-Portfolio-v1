import Icon from "./Icon";

interface DataProps {
  isPractice: boolean;
  activeLink: boolean;
  link: string;
  image: string;
  alt: string;
  title: string;
  desc: string;
  tech: string[];
}

const ProjectsRow = ({
  isPractice,
  activeLink,
  link,
  image,
  alt,
  title,
  desc,
  tech,
}: DataProps) => {
  const content = (
    <div className="projects-row">
      <img src={image} alt={alt} />
      <div className="column">
        <div className="projects-row-title row">
          <span>{title}</span>
          {activeLink && <Icon name="path-link" />}
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
  );

  return activeLink ? (
    <a
      href={link}
      className="fit-content"
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    content
  );
};

export default ProjectsRow;
