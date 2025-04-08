import { lazy, Suspense } from "react";
import { socialMediaData } from "../data/socialMedia";
import useSwipe from "../hooks/useSwipe";

const SocialMedia = lazy(() => import("../components/SocialMedia"));

const Contact = () => {
  const swipeHandlers = useSwipe();
  return (
    <div id="contact" {...swipeHandlers} className="allow-vertical-pan">
      <div id="contact-box-holder">
        {" "}
        {socialMediaData.map((mediaData, index) => (
          <Suspense
            key={index}
            fallback={
              <div className="social-media-box-lazy lazy-animation"></div>
            }
          >
            <SocialMedia {...mediaData} />
          </Suspense>
        ))}
      </div>

      <span id="contact-note">
        Contact me at any time of the day you want! I will respond back as soon
        as I can.
      </span>
    </div>
  );
};

export default Contact;
