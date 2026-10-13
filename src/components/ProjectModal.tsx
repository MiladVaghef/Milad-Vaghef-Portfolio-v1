import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/projects";
import Icon from "./Icon";

// Swiper — loaded via SCSS (in _projectModal.scss) to match the project pipeline.
import Swiper from "swiper";
import type SwiperCore from "swiper";
import { Pagination, Keyboard, Thumbs } from "swiper/modules";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Screenshots taller than this get the auto-scroll treatment (full-page shots).
const TALL_THRESHOLD = 3000;
// Auto-scroll cruise speed for tall screenshots — CONSTANT regardless of the
// image's height (heights vary wildly, from ~2.5k up to 12k px, so deriving
// speed from height made every shot feel different).
const CRUISE_SPEED = 120; // px / second
// Seconds to ramp from half speed up to CRUISE_SPEED (mirrored while
// arriving). Starting at half speed keeps the first frames at ~1px/frame or
// more — a slower crawl would visibly stutter frame by frame.
const RAMP_SECONDS = 3;
// Dwell at each end before the next pass starts — the slow reveal gives the
// visitor time to read the section that just scrolled past.
const PAUSE_MS = 3000;
// After the visitor interrupts the auto-scroll, how long of calm it takes
// before the pass quietly resumes from wherever they left it.
const RESUME_MS = 5000;

/**
 * One lightbox slide. Tall screenshots (>3000px) render at full width inside a
 * scroll viewport that auto-scrolls at a steady, height-independent pace (a
 * gentle 3s ramp, a short dwell at each end). The visitor can take over at any
 * time by scrolling or dragging; the pass quietly resumes a few seconds after
 * they stop interacting.
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!isTall || !active || !el) return;

    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;

    let pos = 0;
    let dir: 1 | -1 = 1;
    let phase: "pass" | "pause" = "pass";
    let last = performance.now();
    let ramped = 0; // seconds spent accelerating in the current pass
    let pauseStart = 0;
    let resumeTimer = 0;

    el.scrollTop = 0;

    const stopRaf = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    const tick = (now: number) => {
      // Clamp long frames (tab switches, breaks) so the position never jumps.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (phase === "pass") {
        // Linear ramp 0.5 → 1 × CRUISE_SPEED over RAMP_SECONDS, then hold.
        // Speed is constant per pixel of image, so 12k-px shots and 2.5k-px
        // shots feel the same.
        ramped = Math.min(RAMP_SECONDS, ramped + dt);

        pos += dir * (CRUISE_SPEED * (0.5 + 0.5 * (ramped / RAMP_SECONDS))) * dt;

        const target = dir === 1 ? max : 0;

        if ((dir === 1 && pos >= max) || (dir === -1 && pos <= 0)) {
          pos = target;
          // The next pass goes the other way — after this dwell.
          dir = dir === 1 ? -1 : 1;
          phase = "pause";
          pauseStart = now;
        }

        // Only write while passing — during the dwell the position is
        // settled, and writing would fight a visitor scrolling by hand.
        el.scrollTop = pos;
      } else if (now - pauseStart >= PAUSE_MS) {
        // Dwell over — start the next pass, easing up from slow again.
        phase = "pass";
        ramped = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // The visitor takes over by scrolling or grabbing the image: halt the
    // auto-scroll, then quietly resume from wherever they left it after
    // RESUME_MS of calm (each new interaction resets the timer).
    const onInteract = () => {
      stopRaf();
      window.clearTimeout(resumeTimer);

      resumeTimer = window.setTimeout(() => {
        pos = el.scrollTop; // wherever the visitor scrolled to
        ramped = 0;
        last = performance.now();
        phase = "pass";
        rafRef.current = requestAnimationFrame(tick);
      }, RESUME_MS);
    };

    rafRef.current = requestAnimationFrame(tick);

    el.addEventListener("wheel", onInteract, { passive: true });
    el.addEventListener("touchstart", onInteract, { passive: true });
    el.addEventListener("pointerdown", onInteract);

    return () => {
      stopRaf();
      window.clearTimeout(resumeTimer);
      el.removeEventListener("wheel", onInteract);
      el.removeEventListener("touchstart", onInteract);
      el.removeEventListener("pointerdown", onInteract);
    };
  }, [isTall, active]);

  return (
    <div
      className="swiper-slide project-modal-slide"
      data-tall={isTall ? "true" : undefined}
    >
      <div ref={scrollRef} className="project-modal-scroll">
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

  // Latest onClose, kept in a ref so the history effect below can subscribe
  // once per open — the parent passes a fresh closure on every render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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

  // Treat the phone/browser back button as "close" while the lightbox is
  // open: push a sentinel history entry on open and close on popstate. When
  // the modal is dismissed any other way (X, Escape, backdrop), the cleanup
  // drops the sentinel again so the next back press doesn't hit a stale entry.
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ projectModalOpen: true }, "");

    const onPopState = () => onCloseRef.current();

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);

      // Only undo our own sentinel — after a popstate close it's already gone.
      if (window.history.state?.projectModalOpen) {
        window.history.back();
      }
    };
  }, [isOpen]);

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
      modules: [Pagination, Keyboard, Thumbs],
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
            {/* Title bar — project name left, close button right */}
            <div className="project-modal-header">
              <span className="project-modal-header-title medium">
                {project.title}
              </span>

              <button
                type="button"
                className="project-modal-close"
                onClick={onClose}
                aria-label="Close project"
              >
                {/* Inline × — the shared Icon set has no close glyph. */}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

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

                {/* Full-width footer button — pinned to the bottom of the
                    details column when the content is shorter than the
                    dialog (margin-top: auto). */}
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
                    <span>Visit Project</span>
                  </a>
                )}
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
