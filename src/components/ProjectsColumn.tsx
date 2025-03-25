import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { projectsData } from "../data/projects";
import Icon from "./Icon";

const ProjectsColumn = () => {
  const location = useLocation();
  const categoryOrder = ["Wordpress", "Front-End", "Figma"];
  const [activeTab, setActiveTab] = useState(categoryOrder[0]);

  useEffect(() => {
    const categoryOrder = ["Wordpress", "Front-End", "Figma"];
    const hash = location.hash.replace("#", "");
    if (categoryOrder.includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const filteredProjects = projectsData.filter(
    (project) => project.category === activeTab
  );

  return (
    <div className="column projects-column-container">
      {" "}
      <div className="row projects-column-category">
        {categoryOrder.map((category) => (
          <button
            key={category}
            onClick={() => (window.location.hash = category)}
            className={`${activeTab === category ? "category-active" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="projects-column-grid">
        {" "}
        {filteredProjects.map((project, index) => (
          <a href={project.link} target="_blank">
            <div key={index} className="projects-column column">
              <div>
                <img src={project.image} alt={project.alt} className="" />
              </div>
              <div className="projects-column-title row">
                <span className="medium">{project.title}</span>
                <Icon name="path-link"></Icon>
              </div>
              <p className="light">{project.desc}</p>
              <ul className="row">
                {project.tech.map((tech, techIndex) => (
                  <li key={techIndex} className="tech">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProjectsColumn;
