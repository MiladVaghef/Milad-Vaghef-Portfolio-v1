import { lazy, Suspense } from "react";
import { socialMediaData } from "../data/socialMedia";

const SocialMedia = lazy(() => import("../components/SocialMedia"));

const Contact = () => {
  return (
    <div id="contact" className="column">
      <div id="contact-box-holder">
        {" "}
        {socialMediaData.map((mediaData, index) => (
          <Suspense key={index} fallback={<div>Loading social media...</div>}>
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
