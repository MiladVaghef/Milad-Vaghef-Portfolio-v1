import { CSSProperties } from "react";

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

export default Skeleton;