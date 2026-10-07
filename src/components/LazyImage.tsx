import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface LazyImageProps {
  src: string;
  alt: string;
  /** Wrapper classes from the host layout (e.g. "projects-row-image"). */
  className?: string;
  /** Wrapper styles — aspect-ratio tokens etc. */
  style?: React.CSSProperties;
  /** How far outside the viewport to pre-fetch, e.g. "300px 0px". */
  rootMargin?: string;
}

type ImageStatus = "idle" | "loaded" | "error";

/**
 * Lazy image with a shimmering skeleton placeholder. The network request only
 * starts once the wrapper nears the viewport (IntersectionObserver), the
 * skeleton keeps the slot filled meanwhile, and the finished image reveals
 * with a fade + subtle zoom-out. Broken images fall back to a flat placeholder.
 */
const LazyImage = ({
  src,
  alt,
  className = "",
  style,
  rootMargin = "300px 0px",
}: LazyImageProps) => {
  const [status, setStatus] = useState<ImageStatus>("idle");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { ref, inView } = useInView({
    rootMargin,
    triggerOnce: true,
  });

  // Cached images can already be complete when the ref attaches — skip the
  // wait so the reveal doesn't hang on an event that already fired.
  const setImgRef = (img: HTMLImageElement | null) => {
    imgRef.current = img;

    if (img?.complete && img.naturalWidth > 0) {
      setStatus("loaded");
    }
  };

  const classes = [
    "lazy-image",
    className,
    status === "loaded" ? "loaded" : "",
    status === "error" ? "error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      style={style}
      aria-busy={status !== "loaded"}
    >
      {inView && (
        <img
          ref={setImgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
};

export default LazyImage;