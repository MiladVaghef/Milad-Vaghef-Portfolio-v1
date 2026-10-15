import { CSSProperties, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../data/projects";

type SkeletonVariant = "text" | "block" | "image" | "circle";

interface SkeletonProps {
  /** Shape of the placeholder bone. */
  variant?: SkeletonVariant;
  /** Any CSS length — numbers are treated as pixels. */
  width?: string | number;
  height?: string | number;
  /** Number of stacked text lines (last line shortens to 60%). */
  lines?: number;
  /** Extra classes (sizing/positioning hooks from the host layout). */
  className?: string;
  style?: CSSProperties;
  /** Stagger offset in seconds — used to sequence neighbouring bones. */
  delay?: number;
}

const toCss = (value?: string | number) =>
  typeof value === "number" ? `${value}px` : value;

/**
 * A single shimmering skeleton bone. Purely decorative — always hidden from
 * assistive technology (the real content arrives when its chunk resolves).
 */
const Skeleton = ({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
  style,
  delay = 0,
}: SkeletonProps) => {
  const animationDelay = delay ? `${delay}s` : undefined;

  // Multi-line text block — lines stagger so the shimmer cascades downward.
  if (variant === "text" && lines > 1) {
    return (
      <span
        className={`skeleton-stack ${className}`.trim()}
        style={style}
        aria-hidden="true"
      >
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className="skeleton skeleton--text"
            style={{
              width: index === lines - 1 ? "60%" : "100%",
              animationDelay: delay
                ? `${delay + index * 0.12}s`
                : index
                  ? `${index * 0.12}s`
                  : undefined,
            }}
          />
        ))}
      </span>
    );
  }

  const boneStyle: CSSProperties = {
    width: toCss(width),
    height: toCss(height),
    ...style,
    animationDelay,
  };

  const classes = `skeleton skeleton--${variant} ${className}`.trim();

  if (variant === "text") {
    return <span className={classes} style={boneStyle} aria-hidden="true" />;
  }

  return <div className={classes} style={boneStyle} aria-hidden="true" />;
};

/** Mirrors the dimensions of a WorkHistory entry while its chunk loads. */
export const WorkHistorySkeleton = () => (
  <div className="work-history-lazy" aria-hidden="true">
    <Skeleton variant="block" delay={0} />
    <Skeleton variant="text" delay={0.12} />
  </div>
);

/** Mirrors the dimensions of a SocialMedia card while its chunk loads. */
export const SocialMediaSkeleton = () => (
  <div className="social-media-box-lazy" aria-hidden="true">
    <div className="social-media-box-lazy-top">
      <Skeleton variant="circle" width={40} height={40} />
      <Skeleton variant="block" width={74} height={30} delay={0.08} />
    </div>
    <Skeleton variant="text" lines={2} delay={0.16} />
    <Skeleton variant="text" width="45%" delay={0.4} />
  </div>
);

/**
 * Tech chip sized like the real `.tech` pill (2.5px×16px padding, 12px type
 * ≈ 28px tall) — a bone that inherits the pill row's flex wrapping.
 */
const TechChipSkeleton = ({ delay }: { delay: number }) => (
  <Skeleton variant="block" height={28} className="project-modal-chip" delay={delay} />
);

/**
 * Full-dialog placeholder shown while the lazy `ProjectModal` chunk streams in
 * on the first open. It reuses the real lightbox's `.project-modal*` classes
 * (title bar, slider column, details column) so the popup holds the exact
 * footprint it will land in — no layout shift when the real content arrives.
 *
 * Portalled to `document.body` for the same reason the modal itself is: the
 * page wrappers animate transforms, which would otherwise trap its
 * `position: fixed` inside a transformed ancestor.
 */
export const ProjectModalSkeleton = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  // The chunk owns the real Escape handler (and the body scroll lock), so the
  // skeleton must cover both — a lightbox you cannot dismiss while it loads is
  // a trap, and the blurred backdrop implies the page behind is frozen.
  useEffect(() => {
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
  }, [onClose]);

  // Same gallery resolution as ProjectModal: a gallery when present, else the
  // single cover. Drives the thumbnail strip so the bones land where the real
  // thumbs will (omitted entirely for single-image projects).
  const imageCount = project.gallery?.length ? project.gallery.length : 1;

  return createPortal(
    <div className="project-modal project-modal--skeleton" data-no-swipe>
      {/* Backdrop mirrors the real one — clicking it dismisses the skeleton. */}
      <div
        className="project-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="project-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Loading ${project.title}`}
      >
        {/* Real title (available immediately) so the header never jumps; the
            close × is the same inline glyph the modal ships. */}
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
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="project-modal-body" aria-hidden="true">
          {/* Slider column — stage bone capped like the real slider, then the
              counter/pagination row and the thumb strip. */}
          <div className="project-modal-slider-area">
            <div className="project-modal-slider">
              <Skeleton
                variant="image"
                className="project-modal-skeleton-stage"
                delay={0.06}
              />
            </div>

            <div className="project-modal-slider-footer">
              <Skeleton variant="text" width={44} height={13} delay={0.14} />
              <Skeleton variant="text" width={90} height={8} delay={0.2} />
            </div>

            {imageCount > 1 && (
              <div className="project-modal-thumbs">
                <div className="project-modal-skeleton-thumbs">
                  {Array.from({ length: imageCount }, (_, index) => (
                    <Skeleton
                      key={index}
                      variant="block"
                      width={96}
                      height={62}
                      className="project-modal-thumb"
                      delay={0.24 + index * 0.06}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details column — meta row, description, chips, CTA. */}
          <div className="project-modal-info">
            <div className="project-modal-meta">
              <Skeleton variant="block" width={92} height={26} />
              <Skeleton variant="text" width={72} delay={0.1} />
            </div>

            <Skeleton variant="text" lines={4} delay={0.18} />

            <ul className="project-modal-tech row">
              <li>
                <TechChipSkeleton delay={0.4} />
              </li>
              <li>
                <TechChipSkeleton delay={0.46} />
              </li>
              <li>
                <TechChipSkeleton delay={0.52} />
              </li>
            </ul>

            {project.activeLink && (
              <Skeleton
                variant="block"
                height={56}
                className="project-modal-visit"
                delay={0.58}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Skeleton;