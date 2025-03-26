import Icon, { IconType } from "./Icon"; // Make sure to export IconType from Icon.tsx

interface dataProps {
  icon: IconType; // Change from string to IconType
  title: string;
  message: string;
  link: string;
  linkText: string;
}

const SocialMedia = ({ icon, title, message, link, linkText }: dataProps) => {
  return (
    <div className="social-media-box column">
      <div className="social-media-top row">
        <div className="icon-box">
          <Icon name={icon}></Icon>
        </div>
      </div>
      <div className="social-media-title column">
        <span className="medium">{title}</span>
        <p>{message}</p>
      </div>
      <div className="social-media-contact">
        <a href={link} className="medium">
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
