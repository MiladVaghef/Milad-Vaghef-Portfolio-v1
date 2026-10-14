import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/projects";
import Icon from "./Icon";

// Swiper — loaded via SCSS (in _projectModal.scss) to match the project pipeline.
import Swiper from "swiper";
import type SwiperCore from "swiper";
import { Pagination, Keyboard, Thumbs, Mousewheel } from "swiper/modules";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Portrait-ish screenshots (height ≥ ~width — full-page and phone shots)
// get the zoomed-in auto-scroll treatment; landscape shots just fit the
// frame. An absolute pixel threshold missed "merely" 2k-px-tall phone
// captures, which rendered as tiny letterboxed slivers instead.
const TALL_RATIO = 0.9;
// Auto-scroll cruise speed for tall screenshots — CONSTANT regardless of the
// image's height (heights vary wildly, from ~2.5k up to 12k px, so deriving
// speed from height made every shot feel different).
const CRUISE_SPEED = 120; // px / second
// Seconds to ease from a slow crawl up to CRUISE_SPEED (mirrored while
// arriving). Long enough that the build-up reads as one smooth glide; the
// 0.3 floor keeps the opening frames moving (~0.6px/frame) so the crawl
// never stalls into visible frame-holds.
const RAMP_SECONDS = 5;
// Dwell at each end before the next pass starts — the slow reveal gives the
// visitor time to read the section that just scrolled past.
const PAUSE_MS = 3000;
// Grace period after the lightbox opens a tall project before the auto-scroll
// first moves — time to orient before anything starts sliding.
const START_DELAY_MS = 2000;
// After the visitor interrupts the auto-scroll, how long of calm it takes
// before the pass quietly resumes from wherever they left it.
const RESUME_MS = 5000;

/**
 * One lightbox slide. Portrait-ish screenshots (ratio ≥ 0.9 — full-page and
 * phone shots) render at full width inside a
 * scroll viewport that auto-scrolls at a steady, height-independent pace (a
 * 3s pause after opening, then a gentle 3s ramp, a short dwell at each end).
 * The visitor can take over at any time by scrolling or dragging; the pass
 * quietly resumes a few seconds after they stop interacting.
 */
function ProjectSlide({
  src,
  alt,
  index,
  active,
  zoom,
  tall,
}: {
  src: string;
  alt: string;
  index: number;
  active: boolean;
  /** Per-image zoom flag — entry's own `zoom`, else the project's `zoomImages`. */
  zoom?: boolean;
  /**
   * Per-image tall override — entry's own `tall`. When defined it beats the
   * aspect-ratio auto-detection (`false` keeps narrow-but-tall shots fitting
   * the frame instead of zooming into the scrolling window).
   */
  tall?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  // Start from the explicit override when there is one; otherwise wait for
  // onLoad to auto-detect from the image's aspect ratio.
  const [isTall, setIsTall] = useState(tall ?? false);
  // Landscape / ≈16:9 shots (wider than tall) fill the frame when fit, so they
  // never get the zoom affordance — set on load from the natural size.
  const [isWide, setIsWide] = useState(false);
  // Manual zoom toggle — the visitor can flip any non-`zoom` image into the
  // native 1:1 pannable view (and back). `isZoomed` is the effective state:
  // permanently-zoomed slides (`zoom` prop) are always zoomed, everything
  // else follows the local toggle.
  const [zoomed, setZoomed] = useState(false);
  const isZoomed = !!zoom || zoomed;

  useEffect(() => {
    const el = scrollRef.current;
    // Auto-scroll only the tall view while it is NOT zoomed — once the visitor
    // flips into the manual pan (zoom) view, the pass stops so it can't fight
    // their panning.
    if (!isTall || !active || !el || isZoomed) return;

    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;

    let pos = 0;
    let dir: 1 | -1 = 1;
    // "wait" = the opening grace period before the very first pass.
    let phase: "wait" | "pass" | "pause" = "wait";
    let last = performance.now();
    let ramped = 0; // seconds spent accelerating in the current pass
    let pauseStart = performance.now();
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
        // Ease-in ramp 0.3 → 1 × CRUISE_SPEED over RAMP_SECONDS, then hold:
        // the quadratic build-up starts as a slow crawl and glides into
        // pace instead of jumping off the line. Speed stays constant per
        // pixel of image, so 12k-px shots and 2.5k-px shots feel the same.
        ramped = Math.min(RAMP_SECONDS, ramped + dt);

        pos +=
          dir *
          (CRUISE_SPEED * (0.3 + 0.7 * (ramped / RAMP_SECONDS) ** 2)) *
          dt;

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
      } else if (
        (phase === "wait" && now - pauseStart >= START_DELAY_MS) ||
        (phase === "pause" && now - pauseStart >= PAUSE_MS)
      ) {
        // Opening grace period or end dwell over — start the next pass,
        // easing up from slow again.
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
  }, [isTall, active, isZoomed]);

  return (
    <div
      className="swiper-slide project-modal-slide"
      data-tall={isTall ? "true" : undefined}
      data-zoom={isZoomed ? "true" : undefined}
    >
      <div
        ref={scrollRef}
        className={`project-modal-scroll${zoomed ? " is-zoom-out" : ""}`}
        // When runtime-zoomed the (icon-less) image itself becomes the zoom-
        // out control — click/tap or Enter/Space returns it to the fit view.
        // Default-zoomed images (`zoom` prop) never set `zoomed`, so they
        // ignore this and stay zoomed.
        role={zoomed ? "button" : undefined}
        tabIndex={zoomed ? 0 : undefined}
        aria-label={zoomed ? "Zoom out" : undefined}
        onClick={() => {
          if (zoomed) setZoomed(false);
        }}
        onKeyDown={(e) => {
          if (!zoomed) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setZoomed(false);
          }
        }}
      >
        <img
          src={src}
          alt={`${alt} — image ${index + 1}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            // Landscape / ≈16:9 shots already fill the frame — no zoom
            // affordance for them.
            setIsWide(img.naturalWidth > img.naturalHeight);
            // An explicit `tall` override always wins; otherwise auto-detect
            // from the image's aspect ratio.
            if (tall !== undefined) {
              setIsTall(tall);
              return;
            }
            setIsTall(img.naturalHeight / img.naturalWidth >= TALL_RATIO);
          }}
        />
      </div>

      {/* Zoom-in affordance — only on portrait-ish fit-to-frame shots. Tall
          auto-scroll images (`isTall`) are already shown zoomed-in with the
          scrolling animation, and landscape/≈16:9 shots (`isWide`) already fill
          the frame — neither gets the button; nor do slides that are
          default-zoomed (`zoom`/`zoomImages`). The button also disappears once
          the visitor zooms in — while zoomed, the image itself acts as the
          zoom-out control (see the scroll div above). */}
      {!isTall && !isWide && !isZoomed && (
        <button
          type="button"
          className="project-modal-zoom-btn"
          onClick={() => setZoomed(true)}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {/* Magnifier + plus */}
            <path
              d="M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8 10.5h5" strokeWidth="2" strokeLinecap="round" />
            <path d="M10.5 8v5" strokeWidth="2" strokeLinecap="round" />
            <path d="M14.75 14.75 20 20" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
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

  // The images to show — fall back to the single cover when no gallery
  // exists. Gallery entries may be plain URLs or objects with per-image
  // options; each resolved slide gets its own `zoom` flag (the entry's own
  // `zoom` wins, otherwise the project-wide `zoomImages` default applies) and
  // `tall` override (the entry's own `tall`, if any — otherwise the slide
  // auto-detects from the image's aspect ratio).
  const images: { src: string; zoom?: boolean; tall?: boolean }[] = (
    project?.gallery?.length
      ? project.gallery
      : project
        ? [project.image]
        : []
  ).map((entry) =>
    typeof entry === "string"
      ? { src: entry, zoom: project?.zoomImages }
      : { src: entry.src, zoom: entry.zoom ?? project?.zoomImages, tall: entry.tall },
  );

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
        modules: [Thumbs, Mousewheel],
        slidesPerView: "auto",
        spaceBetween: 10,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        // Scrolling (wheel / trackpad) over the thumbnail strip pans it left
        // and right: forceToAxis maps any wheel direction onto the strip's
        // horizontal axis; at either end the gesture releases so the wheel
        // can keep scrolling whatever sits behind the dialog.
        mousewheel: {
          enabled: true,
          forceToAxis: true,
          releaseOnEdges: true,
        },
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
                    {images.map(({ src, zoom, tall }, index) => (
                      <ProjectSlide
                        key={`${project.title}-${index}`}
                        src={src}
                        alt={project.alt}
                        index={index}
                        active={activeIndex === index}
                        zoom={zoom}
                        tall={tall}
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
                      {images.map(({ src }, index) => (
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
