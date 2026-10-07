import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Site ease-out — same curve as the loading screen curtains.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RevealProps {
  children: ReactNode;
  /** Class hooks from the host layout — the reveal div takes their place. */
  className?: string;
  style?: React.CSSProperties;
  /** How much of the element must be visible before it reveals (0–1). */
  amount?: number;
  /** Delay before the reveal starts, in seconds (for staggered lists). */
  delay?: number;
}

/**
 * Lazy-loading animation for elements: the content fades and slides up the
 * first time it scrolls into view, then stays put. Honors reduced-motion by
 * rendering the children without any animation at all.
 */
const Reveal = ({ children, className, style, amount = 0.2, delay = 0 }: RevealProps) => {
  const reducedMotion = useReducedMotion();
  // Always keep the base "reveal" class — host layouts target it in CSS.
  const classes = `reveal ${className ?? ""}`.trim();

  if (reducedMotion) {
    return (
      <div className={classes} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={classes}
      style={style}
      // Slide in from slightly ABOVE: start-edge overflow never triggers a
      // scrollbar, whereas a positive y extends the scrollable overflow of
      // containers like #contact-box-holder and flashes a scrollbar for the
      // duration of the animation.
      initial={{ opacity: 0, y: -28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;