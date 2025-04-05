import Icon, { IconType } from "./Icon";

interface dataProps {
  isAvailable: boolean;
  isFollowable: boolean;
  icon: IconType;
  title: string;
  message: string;
  link: string;
  linkText: string;
}

const SocialMedia = ({
  isAvailable,
  isFollowable,
  icon,
  title,
  message,
  link,
  linkText,
}: dataProps) => {
  return (
    <a
      href={link}
      className={
        isAvailable === false
          ? "not-available social-media-container"
          : "social-media-container"
      }
    >
      <div className="social-media-box column">
        <div className="social-media-top row">
          <div className="icon-box">
            <Icon name={icon}></Icon>
          </div>
          <div className="social-media-button-container">
            {isAvailable === false ? (
              <button className="not-available-button semi-bold">
                Not Available
              </button>
            ) : isFollowable ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                <button className="primary-button semi-bold">Follow</button>
              </a>
            ) : null}
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
    </a>
  );
};

export default SocialMedia;
