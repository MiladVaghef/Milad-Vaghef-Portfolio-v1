import React, { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import Icon from "../components/Icon";
import { InViewSections } from "../App";
import { useInView } from "react-intersection-observer";
import { projectsData } from "../data/projects";
import { workHistoryData } from "../data/workHistory";
import { useNavigation } from "../hooks/navigationContext";
import useAppReady from "../hooks/useAppReady";
import PageLayout from "../components/PageLayout";
import Reveal from "../components/Reveal";
import { WorkHistorySkeleton } from "../components/Skeleton";

const ProjectsRow = lazy(() => import("../components/ProjectsRow"));
const WorkHistory = lazy(() => import("../components/WorkHistory"));

interface HomeProps {
  setInViewSections?: React.Dispatch<React.SetStateAction<InViewSections>>;
}

const Home = ({ setInViewSections }: HomeProps) => {
  useAppReady();

  const { navigateTo } = useNavigation();
  const limitedProjects = projectsData.slice(0, 4);
  const thresholdSteps = Array.from({ length: 10 }, (_, i) => i * 0.1);

  // The observers fire on threshold crossings throughout a scroll gesture.
  // Quantize each ratio to a 5% bucket and coalesce all three sections into
  // at most ONE state update per animation frame — otherwise the whole App
  // re-renders continuously while scrolling, which iOS Safari experiences as
  // dropped scroll frames ("hard to scroll").
  const pendingSectionsRef = useRef<Partial<InViewSections>>({});
  const inViewRafRef = useRef(0);

  const queueInViewUpdate = useCallback(
    (key: keyof InViewSections, ratio: number) => {
      if (!setInViewSections) return;

      pendingSectionsRef.current[key] = Math.round(ratio * 20) / 20;

      if (inViewRafRef.current) return;

      inViewRafRef.current = requestAnimationFrame(() => {
        inViewRafRef.current = 0;

        const pending = pendingSectionsRef.current;
        pendingSectionsRef.current = {};

        setInViewSections((prev) => {
          const changed = (
            Object.keys(pending) as (keyof InViewSections)[]
          ).some((key) => prev[key] !== pending[key]);

          // Returning the same reference skips the re-render entirely when
          // every bucket is unchanged.
          return changed ? { ...prev, ...pending } : prev;
        });
      });
    },
    [setInViewSections],
  );

  useEffect(
    () => () => cancelAnimationFrame(inViewRafRef.current),
    [],
  );

  const { ref: bioRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      queueInViewUpdate("#biography", entry.intersectionRatio);
    },
  });

  const { ref: projectsRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      queueInViewUpdate("#home-row-projects", entry.intersectionRatio);
    },
  });

  const { ref: workRef } = useInView({
    threshold: thresholdSteps,
    onChange: (_, entry) => {
      queueInViewUpdate("#home-work-history", entry.intersectionRatio);
    },
  });

  return (
    <PageLayout>
      <div id="home" className="allow-vertical-pan column">
        <section id="introduction" className="home-mobile-padding">
          <h1 className="home-mobile-padding">Milad Vaghef</h1>
          <h2 className="column home-mobile-padding">
            <span>Front-End Developer</span>
            <span>UI Designer</span>
          </h2>
          <p className="home-mobile-padding">
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
            <Reveal className="biography-paragraph home-mobile-padding row">
              <div className="icon-box">
                <Icon name="code"></Icon>
              </div>
              <p>
                I'm a <span className="primary-text">front-end developer</span>{" "}
                focused on building modern, responsive, and scalable web
                applications. I enjoy turning complex ideas into intuitive user
                interfaces while writing clean, maintainable code that is built
                for long-term growth. My work is driven by performance,
                accessibility, and delivering polished user experiences.
              </p>
            </Reveal>

            <Reveal
              className="biography-paragraph home-mobile-padding row highlight"
              delay={0.08}
            >
              <div className="icon-box">
                <Icon name="brush"></Icon>
              </div>
              <span className="highlight-line"></span>
              <p>
                My background in design gives me a strong attention to detail,
                allowing me to bridge the gap between design and development. I
                take pride in translating UI concepts into{" "}
                <span className="primary-text">pixel-perfect</span>,
                production-ready interfaces while preserving the intent behind
                every design.
              </p>
            </Reveal>

            <Reveal className="biography-paragraph home-mobile-padding row" delay={0.16}>
              <div className="icon-box">
                <Icon name="rocket"></Icon>
              </div>
              <p>
                I've contributed to a variety of commercial projects, including
                business websites, e-commerce platforms, and marketplace
                applications. Whether developing reusable component systems,
                improving existing products, or building new features from
                scratch, I enjoy collaborating with designers, back-end
                developers, and product teams to create reliable, scalable
                solutions. I'm always looking to refine my skills and build
                digital products that provide real value to both users and
                businesses.
              </p>
            </Reveal>
          </div>

          <div ref={projectsRef}>
            <div className="sticky-title">
              <h3>Projects</h3>
            </div>

            <div id="home-row-projects" className="home-mobile-padding column">
              {limitedProjects.map((project) => (
                <ProjectsRow key={project.title} {...project} />
              ))}
            </div>

            <div
              id="all-projects-link"
              className="row semi-bold home-mobile-padding"
            >
              <button
                onClick={() => navigateTo("/projects", "left")}
                className="link-button"
              >
                <span>View Full Project</span>
                <Icon name="right-arrow" />
              </button>
            </div>
          </div>

          <div ref={workRef}>
            <div className="sticky-title">
              <h3>Experience</h3>
            </div>
            <div
              className="home-mobile-padding column-reverse"
              id="home-work-history"
            >
              {workHistoryData.map((workData, index) => (
                <Suspense
                  key={index}
                  fallback={<WorkHistorySkeleton />}
                >
                  <WorkHistory {...workData} />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
