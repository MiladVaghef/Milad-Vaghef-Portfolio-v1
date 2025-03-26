import { lazy, Suspense } from "react";
import { socialMediaData } from "../data/socialMedia";

const SocialMedia = lazy(() => import("../components/SocialMedia"));

const Contact = () => {
  return (
    <div id="contact">
      <Suspense fallback={<div>Loading social media...</div>}>
        {socialMediaData.map((mediaData, index) => (
          <SocialMedia key={index} {...mediaData} />
        ))}
      </Suspense>
    </div>
  );
};

export default Contact;
