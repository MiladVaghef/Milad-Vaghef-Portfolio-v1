import React, { lazy, Suspense } from "react";
import Icon from "../components/Icon";
import { InViewSections } from "../App";
import { useInView } from "react-intersection-observer";
import { projectsData } from "../data/projects";
import { workHistoryData } from "../data/workHistory";
import useSwipe from "../hooks/useSwipe";
import { useNavigation } from "../hooks/useNavigation";

const ProjectsRow = lazy(() => import("../components/ProjectsRow"));
const WorkHistory = lazy(() => import("../components/WorkHistory"));

interface HomeProps {
  setInViewSections?: React.Dispatch<React.SetStateAction<InViewSections>>;
}

const Home = ({ setInViewSections }: HomeProps) => {
  const swipeHandlers = useSwipe();
  const { navigateTo } = useNavigation();
  const limitedProjects = projectsData.slice(0, 4);
  const thresholdSteps = Array.from({ length: 100 }, (_, i) => i * 0.01);

  const { ref: bioRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      setInViewSections?.((prev) => ({
        ...prev,
        "#biography": entry.intersectionRatio,
      }));
    },
  });

  const { ref: projectsRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      setInViewSections?.((prev) => ({
        ...prev,
        "#home-row-projects": entry.intersectionRatio,
      }));
    },
  });

  const { ref: workRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      setInViewSections?.((prev) => ({
        ...prev,
        "#home-work-history": entry.intersectionRatio,
      }));
    },
  });

  return (
    <>
      <div id="home" {...swipeHandlers} className="allow-vertical-pan column">
        <section id="introduction">
          <h1>Milad Vaghef</h1>
          <h2 className="column">
            <span>Front-End Developer</span>
            <span>UI Designer</span>
          </h2>
          <p>
            I make modern and well-structured websites and friendly user
            interfaces.
          </p>
          <div id="intro-icons" className="row">
            <a href="https://t.me/miladvaghef" target="_blank">
              <Icon name="telegram" />
            </a>
            <a href="https://wa.me/989017867178" target="_blank">
              <Icon name="whatsapp" />
            </a>
            <a href="http://instagram.com/_u/miladvaghef" target="_blank">
              <Icon name="instagram" />
            </a>
          </div>
        </section>

        <div id="home-holder" className="column">
          <div id="biography" className="column" ref={bioRef}>
            <div className="sticky-title">
              <h3>About</h3>
            </div>
            <p>
              I'm a front-end web designer passionate about creating clean,
              visually engaging, and user-friendly digital experiences. I’m
              currently pursuing a degree in graphic design, where I gain
              hands-on experience creating posters, banners, and digital assets
              using tools like Adobe Photoshop and Illustrator. This combination
              of formal education and practical skills allows me to deliver
              polished and thoughtful designs.
            </p>
            <p>
              With a year of dedicated web design training and a certified web
              designing background, I bring both technical expertise and
              creative vision to every project. I focus on crafting websites
              that balance aesthetics with functionality, ensuring users enjoy
              seamless, intuitive, and visually appealing experiences.
            </p>
            <p>
              Based in Iran, I've collaborated on a variety of projects, from
              e-commerce platforms to custom digital experiences. I thrive on
              turning ideas into high-quality, innovative designs that resonate
              with users and help brands stand out. Whether working
              independently or as part of a team, I am committed to pushing
              creative boundaries and delivering results that exceed
              expectations.
            </p>
          </div>

          <div id="home-row-projects" className="column" ref={projectsRef}>
            <div className="sticky-title">
              <h3>Projects</h3>
            </div>

            {limitedProjects.map((project) => (
              <ProjectsRow {...project} />
            ))}

            <div id="all-projects-link" className="row semi-bold">
              <button
                onClick={() => navigateTo("/projects", "left")}
                className="link-button"
              >
                <span>View Full Project</span>
                <Icon name="right-arrow" />
              </button>
            </div>
          </div>

          <div id="home-work-history" className="column-reverse" ref={workRef}>
            {workHistoryData.map((workData, index) => (
              <Suspense
                key={index}
                fallback={
                  <div className="work-history-lazy">
                    <div className="lazy-animation"></div>
                    <span className="lazy-animation"></span>
                  </div>
                }
              >
                <WorkHistory {...workData} />
              </Suspense>
            ))}

            <div className="sticky-title">
              <h3>Experience</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
