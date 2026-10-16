import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/projects";
import { formatProjectAge } from "../utils/projectDate";
// NOTE: no shared Icon import — the "path-link" glyph is a 30×30 / stroke-4
// drawing that renders as a chunky blob at button scale. The CTA inlines its
// own arrow instead (same reason the close × and zoom buttons are inlined).

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

type ImageStatus = "loading" | "loaded" | "error";

/**
 * Tracks whether an image's pixels have arrived, for the shimmer
 * placeholders. The mount-time `complete` check matters: a screenshot that's
 * already in the HTTP cache (e.g. the cover the card just rendered) finishes
 * before React attaches `onLoad`, which would otherwise strand the skeleton
 * forever.
 */
function useImageStatus(src: string) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<ImageStatus>("loading");

  useEffect(() => {
    const img = ref.current;

    if (img?.complete) {
      // naturalWidth is 0 on a failed decode — that path belongs to onError,
      // which has normally already fired by the time this effect runs.
      if (img.naturalWidth > 0) setStatus("loaded");
      return;
    }

    setStatus("loading");
  }, [src]);

  return {
    ref,
    status,
    markLoaded: () => setStatus("loaded"),
    markError: () => setStatus("error"),
  };
}

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
  // True while a mouse/pen drag-to-scroll gesture owns the viewport — the
  // auto-scroll's idle-resume timer checks it so it never restarts mid-drag.
  const draggingRef = useRef(false);
  // Set when a drag actually moved the viewport; consumed by the click that
  // follows the release so a drag never doubles as the zoom-out click.
  const dragMovedRef = useRef(false);
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

  // Shimmer state for this slide's screenshot — the scroll viewport fills the
  // slot (see SCSS) until the pixels land, then fades the image in. Destructured
  // so the effect below depends on the primitive `status`, not the fresh
  // object the hook returns on every render (which would restart the pass).
  const { ref: imageRef, status, markLoaded, markError } = useImageStatus(src);

  useEffect(() => {
    const el = scrollRef.current;
    // Auto-scroll only the tall view while it is NOT zoomed — once the visitor
    // flips into the manual pan (zoom) view, the pass stops so it can't fight
    // their panning. It also waits for the image to load: scrollHeight is
    // meaningless (and max <= 0) until the tall screenshot has real pixels,
    // and a cached image resolves before this effect first runs.
    if (!isTall || !active || !el || isZoomed) return;
    if (status !== "loaded") return;

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
        // A drag-to-scroll gesture is in progress — don't fight the visitor
        // by writing scrollTop behind their pointer. Their next interaction
        // re-arms this timer anyway.
        if (draggingRef.current) return;

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
  }, [isTall, active, isZoomed, status]);

  // Mouse/pen drag-to-scroll for the viewport — grabbing the image pans it by
  // hand, like the scrollbar thumb on the projects grid. Touch already scrolls
  // natively, and horizontal gestures belong to Swiper's slide swipe, which
  // politely releases vertical-dominant moves itself (its touchAngle check),
  // so the two never fight: this handler only commits once the gesture clearly
  // heads vertically — past the same 5px Swiper uses before it picks an axis.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let startScrollTop = 0;
    // null = idle, "pending" = axis undecided, "vertical" = we own the
    // gesture, "abandoned" = horizontal — the rest of it is Swiper's.
    let axis: "pending" | "vertical" | "abandoned" | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId || !axis) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (axis === "pending") {
        // Below the commitment threshold it's just jitter — wait it out.
        if (dx * dx + dy * dy < 25) return;

        if (Math.abs(dy) > Math.abs(dx)) {
          axis = "vertical";
          draggingRef.current = true;
          // Retarget the gesture at the viewport so the drag keeps tracking
          // past its edges.
          el.setPointerCapture(e.pointerId);
        } else {
          axis = "abandoned";
        }

        return;
      }

      if (axis === "vertical") {
        // Grab semantics — the image follows the pointer. Computed from the
        // gesture's START, so the mid-gesture capture never causes a jump.
        el.scrollTop = startScrollTop - dy;
        dragMovedRef.current = true;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;

      draggingRef.current = false;
      axis = null;

      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }

      pointerId = -1;

      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };

    const onDown = (e: PointerEvent) => {
      // Touch keeps its native panning; secondary buttons belong to the OS.
      if (e.pointerType === "touch" || e.button !== 0) return;

      // Only when there's actually room to pan (tall pass view or 1:1 zoom) —
      // fit-to-frame slides have nothing to scroll and must stay swipeable.
      if (el.scrollHeight - el.clientHeight <= 1) return;

      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startScrollTop = el.scrollTop;
      axis = "pending";
      dragMovedRef.current = false; // fresh gesture — clicks count again

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
    };

    el.addEventListener("pointerdown", onDown);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);

      draggingRef.current = false;
    };
  }, []);

  return (
    <div
      className="swiper-slide project-modal-slide"
      data-tall={isTall ? "true" : undefined}
      data-zoom={isZoomed ? "true" : undefined}
    >
      <div
        ref={scrollRef}
        className={`project-modal-scroll${zoomed ? " is-zoom-out" : ""}`}
        // Shimmer state for the SCSS placeholder — "loading" fills the slot
        // with the shared shimmer, "error" settles it to a static surface
        // (omitted entirely once the pixels are here).
        data-loading={status === "loaded" ? undefined : status}
        // When runtime-zoomed the (icon-less) image itself becomes the zoom-
        // out control — click/tap or Enter/Space returns it to the fit view.
        // Default-zoomed images (`zoom` prop) never set `zoomed`, so they
        // ignore this and stay zoomed.
        role={zoomed ? "button" : undefined}
        tabIndex={zoomed ? 0 : undefined}
        aria-label={zoomed ? "Zoom out" : undefined}
        onClick={() => {
          // A drag-to-scroll gesture releases with a click on this same
          // element — it must not also count as the zoom-out control.
          if (dragMovedRef.current) {
            dragMovedRef.current = false;
            return;
          }

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
          ref={imageRef}
          src={src}
          alt={`${alt} — image ${index + 1}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={(e) => {
            markLoaded();

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
          onError={markError}
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

/**
 * One thumbnail in the strip — same shimmer-until-loaded treatment as the
 * main slide, at 96×62. Thumbs use `loading="lazy"` too, so they routinely
 * paint after the slide they jump to.
 */
function ProjectThumb({ src, alt }: { src: string; alt: string }) {
  const imageStatus = useImageStatus(src);

  return (
    <div
      className={`swiper-slide project-modal-thumb${
        imageStatus.status === "loading" ? " is-loading" : ""
      }`}
    >
      <img
        ref={imageStatus.ref}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={imageStatus.markLoaded}
        onError={imageStatus.markError}
      />
    </div>
  );
}

/** Full-screen lightbox that showcases a multi-image project with a slider. */
const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const mainSliderRef = useRef<HTMLDivElement | null>(null);
  const thumbsSliderRef = useRef<HTMLDivElement | null>(null);
  const mainSwiper = useRef<SwiperCore | null>(null);
  const thumbsSwiper = useRef<SwiperCore | null>(null);

  // Timer for the sentinel history pop the close-cleanup schedules — kept in
  // a ref so the effect's next setup can cancel it (see the history effect).
  const sentinelPopTimerRef = useRef<number | null>(null);

  // 1-based active slide, for the "current / total" counter.
  const [activeIndex, setActiveIndex] = useState(0);

  const isOpen = project !== null;

  // Latest onClose, kept in a ref so the history effect below can subscribe
  // once per open — the parent passes a fresh closure on every render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // True only when this component's FIRST render already carries a project —
  // i.e. it mounted directly over the Suspense skeleton (cold chunk after a
  // refresh). That first appearance must land IN PLACE: the motion.divs start
  // at opacity 0, so animating it made the dialog vanish the instant the
  // skeleton swapped out and then fade back in — read as "the lightbox closed
  // and reopened". Flipped to false after the first commit so every LATER
  // open keeps its normal entrance animation.
  const mountedOverSkeleton = useRef(project !== null);

  useEffect(() => {
    mountedOverSkeleton.current = false;
  }, []);

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

    // Cancel a sentinel-pop the previous cleanup just scheduled. StrictMode
    // (dev) replays this effect on MOUNT as setup → cleanup → setup; without
    // this cancel, the replayed setup's listener would catch the first
    // setup's pop a tick later — a popstate that is NOT the visitor backing
    // out — and the lightbox would close itself the instant it opens (first
    // open dies, every open after it survives, because only mount replays).
    if (sentinelPopTimerRef.current !== null) {
      window.clearTimeout(sentinelPopTimerRef.current);
      sentinelPopTimerRef.current = null;
    }

    // Same replay, other half: the first setup already pushed the sentinel —
    // don't stack a second one on top of it.
    if (!window.history.state?.projectModalOpen) {
      window.history.pushState({ projectModalOpen: true }, "");
    }

    const onPopState = (event: PopStateEvent) => {
      // Arriving on an entry that still carries the sentinel flag is leftover
      // history plumbing, not a back press — only the unflagged entry BELOW
      // the sentinel means the visitor actually left the lightbox's entry.
      if (event.state?.projectModalOpen) return;

      onCloseRef.current();
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);

      // Only undo our own sentinel — after a popstate close it's already gone.
      // Deferred one tick (rather than history.back() inline) precisely so the
      // replayed setup above can cancel it: back() resolves asynchronously, so
      // an inline call survives long enough to fire against the re-armed
      // listener and be misread as the visitor pressing back.
      if (window.history.state?.projectModalOpen) {
        sentinelPopTimerRef.current = window.setTimeout(() => {
          sentinelPopTimerRef.current = null;

          if (window.history.state?.projectModalOpen) {
            window.history.back();
          }
        }, 0);
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
          // Skip the fade-in only when replacing the skeleton (see
          // `mountedOverSkeleton` above) — otherwise it reads as a close.
          initial={mountedOverSkeleton.current ? false : { opacity: 0 }}
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
            initial={
              mountedOverSkeleton.current
                ? false
                : { opacity: 0, y: 32, scale: 0.97 }
            }
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
                        <ProjectThumb
                          key={`${project.title}-thumb-${index}`}
                          src={src}
                          alt={`${project.alt} thumbnail ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* Project details */}
              <div className="project-modal-info">
                {/* Category pill + relative age ("2 years ago") */}
                <div className="project-modal-meta">
                  <span className="project-modal-category">
                    {project.category}
                  </span>

                  <time className="project-modal-date" dateTime={project.date}>
                    {formatProjectAge(project.date)}
                  </time>
                </div>

                <p className="project-modal-desc light">
                  {project.desc}
                </p>

                {/* Attention note (`Project.note`) — amber callout, e.g. a
                    live site whose design has since changed. */}
                {project.note && (
                  <p className="project-note">{project.note}</p>
                )}

                <ul className="project-modal-tech row">
                  {project.tech.map((tech) => (
                    <li className="tech" key={tech}>
                      {tech}
                    </li>
                  ))}
                  {project.isPractice && (
                    <li className="concept-tag">Experiment</li>
                  )}
                  {project.isConcept && (
                    <li className="concept-tag">Concept</li>
                  )}
                </ul>

                {/* Full-width footer button — pinned to the bottom of the
                    details column when the content is shorter than the
                    dialog (margin-top: auto); on phones it's a flush action
                    bar glued to the screen's bottom edge. Tooltip + aria-
                    label disclose the new tab (best practice for
                    target="_blank"). */}
                {project.activeLink && (
                  <a
                    className="project-modal-visit"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    title="Visit Project (opens in a new tab)"
                    aria-label={`Visit ${project.title} (opens in a new tab)`}
                  >
                    {/* Inline ↗ arrow — 24-box / 2.2 stroke to visually match
                        the close × and zoom controls; stroke comes from
                        currentColor via SCSS so it tracks the label color. */}
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7 17L17 7M9 7h8v8"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
