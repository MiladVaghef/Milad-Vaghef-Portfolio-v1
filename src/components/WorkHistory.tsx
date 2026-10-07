import Reveal from "./Reveal";

interface workHistoryProps {
  timeline: string;
  title: string;
  role: string[];
  desc: string;
  tech: string[];
}

const WorkHistory = ({
  timeline,
  title,
  role,
  desc,
  tech,
}: workHistoryProps) => {
  return (
    // Reveal staggers each experience entry in as it scrolls into view.
    <Reveal>
      <div className="work-history">
        <div className="work-history-time">{timeline}</div>
        <div className="work-history-info column">
          <div className="work-history-title column">
            <span className="medium">{title}</span>
            {role.map((role, index) => (
              <span className="work-history-role" key={index}>
                {role}
              </span>
            ))}
          </div>
          <p className="work-history-desc light">{desc}</p>
          <ul className="row">
            {tech.map((tech, index) => (
              <li className="tech" key={index}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
};

export default WorkHistory;
