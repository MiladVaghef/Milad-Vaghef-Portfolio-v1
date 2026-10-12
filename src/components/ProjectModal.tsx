import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/projects";
import Icon from "./Icon";

// Swiper — loaded via SCSS (in _projectModal.scss) to match the project pipeline.
import Swiper from "swiper";
import type SwiperCore from "swiper";
import { Navigation, Pagination, Keyboard, Thumbs } from "swiper/modules";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Screenshots taller than this get the auto-scroll treatment (full-page shots).
const TALL_THRESHOLD = 3000;
// Seconds for one full top→bottom pass of a tall screenshot.
const SCROLL_SECONDS = 16;

/**
 * One lightbox slide. Tall screenshots (>3000px) render at full width inside a
 * scroll viewport that auto-scrolls top→bottom; the visitor can take over at
 * any time by scrolling or dragging, which stops the animation for that slide.
 */
function ProjectSlide({
  src,
  alt,
  index,
  active,
}: {
  src: string;
  alt: string;
  index: number;
  active: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const [isTall, setIsTall] = useState(false);

  // Cancel any running auto-scroll (user took over, or slide went inactive).
  const stopScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!isTall || !active || !el) return;

    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;

    const speed = max / SCROLL_SECONDS; // px / second
    let pos = 0;
    let dir = 1;
    let last = performance.now();

    el.scrollTop = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      pos += dir * speed * (dt / 1000);

      // Ping-pong: glide to the bottom, then back to the top, and repeat.
      if (pos >= max) {
        pos = max;
        dir = -1;
      } else if (pos <= 0) {
        pos = 0;
        dir = 1;
      }

      el.scrollTop = pos;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopScroll;
  }, [isTall, active]);

  return (
    <div
      className="swiper-slide project-modal-slide"
      data-tall={isTall ? "true" : undefined}
    >
      <div
        ref={scrollRef}
        className="project-modal-scroll"
        onWheel={stopScroll}
        onTouchStart={stopScroll}
        onPointerDown={stopScroll}
      >
        <img
          src={src}
          alt={`${alt} — image ${index + 1}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={(e) =>
            setIsTall(e.currentTarget.naturalHeight > TALL_THRESHOLD)
          }
        />
      </div>
    </div>
  );
}

/** Full-screen lightbox that showcases a multi-image project with a slider. */
const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const mainSliderRef = useRef<HTMLDivElement | null>(null);
  const thumbsSliderRef = useRef<HTMLDivElement | null>(null);
  const mainSwiper = useRef<SwiperCore | null>(null);
  const thumbsSwiper = useRef<SwiperCore | null>(null);

  // 1-based active slide, for the "current / total" counter.
  const [activeIndex, setActiveIndex] = useState(0);

  const isOpen = project !== null;

  // The images to show — fall back to the single cover when no gallery exists.
  const images = project?.gallery?.length
    ? project.gallery
    : project
      ? [project.image]
      : [];

  // Close on Escape + lock background scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Build the main slider + linked thumbnail slider whenever a project opens.
  useEffect(() => {
    if (!isOpen || !mainSliderRef.current) return;

    setActiveIndex(0);

    // Thumbnails only render for multi-image projects, so guard the init —
    // `new Swiper(null, …)` throws and crashes the whole React tree (black screen).
    if (images.length > 1 && thumbsSliderRef.current) {
      thumbsSwiper.current = new Swiper(thumbsSliderRef.current, {
        modules: [Thumbs],
        slidesPerView: "auto",
        spaceBetween: 10,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
      });
    }

    mainSwiper.current = new Swiper(mainSliderRef.current, {
      modules: [Navigation, Pagination, Keyboard, Thumbs],
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      keyboard: { enabled: true },
      thumbs: thumbsSwiper.current
        ? { swiper: thumbsSwiper.current }
        : undefined,
      pagination: {
        el: ".project-modal-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".project-modal-next",
        prevEl: ".project-modal-prev",
      },
      on: {
        slideChange(swiper) {
          setActiveIndex(swiper.activeIndex);
        },
      },
    });

    return () => {
      mainSwiper.current?.destroy(true, true);
      mainSwiper.current = null;
      thumbsSwiper.current?.destroy(true, true);
      thumbsSwiper.current = null;
    };
  }, [isOpen, project]);

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal"
          data-no-swipe
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {/* Backdrop — clicking it closes the lightbox. */}
          <div
            className="project-modal-backdrop"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className="project-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={onClose}
              aria-label="Close project"
            >
              <Icon name="path-link" />
            </button>

            <div className="project-modal-body">
              {/* Main image slider */}
              <div className="project-modal-slider-area">
                <div
                  ref={mainSliderRef}
                  className="swiper project-modal-slider"
                >
                  <div className="swiper-wrapper">
                    {images.map((src, index) => (
                      <ProjectSlide
                        key={`${project.title}-${index}`}
                        src={src}
                        alt={project.alt}
                        index={index}
                        active={activeIndex === index}
                      />
                    ))}
                  </div>

                  {images.length > 1 && (
                    <>
                      <div className="project-modal-prev project-modal-arrow">
                        <Icon name="right-arrow" />
                      </div>
                      <div className="project-modal-next project-modal-arrow">
                        <Icon name="right-arrow" />
                      </div>
                    </>
                  )}
                </div>

                {/* Counter + pagination row */}
                <div className="project-modal-slider-footer">
                  <span className="project-modal-counter">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(images.length).padStart(2, "0")}
                  </span>
                  <div className="project-modal-pagination" />
                </div>

                {/* Thumbnail strip to jump to any page */}
                {images.length > 1 && (
                  <div
                    ref={thumbsSliderRef}
                    className="swiper project-modal-thumbs"
                  >
                    <div className="swiper-wrapper">
                      {images.map((src, index) => (
                        <div
                          className="swiper-slide project-modal-thumb"
                          key={`${project.title}-thumb-${index}`}
                        >
                          <img
                            src={src}
                            alt={`${project.alt} thumbnail ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* Project details */}
              <div className="project-modal-info">
                <span className="project-modal-category">
                  {project.category}
                </span>

                <div className="project-modal-title-row">
                  <h2 className="project-modal-title medium">
                    {project.title}
                  </h2>

                  {project.activeLink && (
                    <a
                      className="project-modal-visit"
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      title="Visit Project"
                      aria-label={`Visit ${project.title}`}
                    >
                      <Icon name="path-link" />
                    </a>
                  )}
                </div>

                <p className="project-modal-desc light">
                  {project.desc}
                </p>

                <ul className="project-modal-tech row">
                  {project.tech.map((tech) => (
                    <li className="tech" key={tech}>
                      {tech}
                    </li>
                  ))}
                  {project.isPractice && (
                    <li className="concept-tag">Concept</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ProjectModal;
