import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/images/logo/raw-logo.png";

// ── Tuning ──────────────────────────────────────────────────────────
const MIN_DISPLAY = 650;          // ms — settle window behind the closed curtains
const STICKY_CEILING = 92;        // % — crawl target until the app is truly ready
const CRAWL_STEP = 0.03;          // per-frame ease toward the ceiling (tuned at 60fps)
const COMPLETE_STEP = 0.16;       // per-frame ease toward 100 once ready (tuned at 60fps)
const FRAME_RATE = 60;            // fps — reference rate the steps above are tuned for
const MAX_FRAME_GAP = 100;        // ms — clamp so a throttled/backgrounded tab can't
                                  // teleport the bar forward when it resumes
const HOLD_AT_100 = 260;          // ms — beat at 100% before the reveal
const PANEL_DELAY = 150;          // ms — stage fades before the curtains part
const REVEAL_DURATION = 750;      // ms — curtain reveal
const UNMOUNT_BUFFER = 120;       // ms — unmount just after the curtains finish opening
const READY_TIMEOUT = 4000;       // ms — cap for fonts + window load
const APP_READY_TIMEOUT = 5500;   // ms — cap for the app:rendered signal
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // site ease-out

const TAGLINE = "Front-End Developer · UI Designer";

interface LoadingScreenProps {
  /** Called once the reveal has finished so App can unmount the loader. */
  onFinish: () => void;
}

const LoadingScreen = ({ onFinish }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Refs let the rAF loop and the readiness effects read live values.
  const progressRef = useRef(0);
  const isReadyRef = useRef(false);
  // Stable boot time for the minimum-display check (survives effect restarts).
  const bootRef = useRef(performance.now());
  // Timestamp of the previous rAF frame — drives the time-based easing.
  const lastTickRef = useRef(0);

  const setProg = (value: number) => {
    progressRef.current = value;
    setProgress(value);
  };

  const markReady = () => {
    if (isReadyRef.current) return;
    isReadyRef.current = true;
    setIsReady(true);
  };

  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Locks scrolling and takes over from the static splash in index.html. The
  // app itself is never hidden with opacity — the opaque loader panels cover
  // it while it renders and settles behind, so the reveal is a pure composite.
  useEffect(() => {
    const { body } = document;

    body.classList.add("page-is-loading");
    window.scrollTo(0, 0);

    document
      .getElementById("app-loader")
      ?.classList.add("app-loader--superseded");

    return () => body.classList.remove("page-is-loading");
  }, []);

  // Adaptive progress — crawls toward a ceiling in whole numbers, then only
  // completes to 100% once the whole app is genuinely ready. Restarts when
  // readiness flips so the final 92 → 100 sprint kicks in automatically.
  useEffect(() => {
    if (reducedMotion) {
      setProg(100);
      return;
    }

    let rafId = 0;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - bootRef.current;
      const ready = isReadyRef.current && elapsed >= MIN_DISPLAY;

      const target = ready ? 100 : STICKY_CEILING;
      const step = ready ? COMPLETE_STEP : CRAWL_STEP;

      // The ref must keep the *precise* eased value — writing the rounded
      // integer back into it stalls the lerp (97 + 3×0.16 = 97.48 rounds
      // back to 97 forever, so it never reaches 100). Round only for
      // display; snap the ref to the target once the displayed value
      // reaches it.
      // Frame-rate independent easing: `step` is a per-frame value tuned at
      // 60fps, so raw frame stepping made the choreography race on 120Hz
      // displays ("the opening skips") and crawl on throttled frames ("it
      // gets laggy"). Convert the step into a per-second time constant and
      // integrate with the real frame delta — pacing is then identical on
      // every display and exactly matches the old behaviour at 60fps. The
      // delta is clamped so a long background pause can't jump the bar.
      const dt = Math.min(now - lastTickRef.current, MAX_FRAME_GAP) / 1000;
      lastTickRef.current = now;
      const alpha = 1 - Math.exp(Math.log(1 - step) * FRAME_RATE * dt);

      const next = progressRef.current + (target - progressRef.current) * alpha;
      const settled = Math.round(next) >= target;

      progressRef.current = settled ? target : next;
      setProgress(settled ? target : Math.round(next));

      if (!settled) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isReady, reducedMotion]);

  // Real readiness — webfonts + the page's load event + the routed app
  // content having mounted and painted (app:rendered). Each is capped so the
  // loader can never hang.
  useEffect(() => {
    const fontsReady =
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ??
      Promise.resolve();

    let resolveWindowLoad: () => void = () => {};
    const windowLoaded = new Promise<void>((resolve) => {
      resolveWindowLoad = resolve;
    });

    if (document.readyState === "complete") {
      resolveWindowLoad();
    } else {
      window.addEventListener("load", resolveWindowLoad, { once: true });
    }

    // Readiness requires ALL gates — fonts + window load AND app:rendered —
    // each with its own cap so the loader can never hang. (Marking ready on
    // the *first* signal let the curtains open before the lazy route chunk
    // had mounted, i.e. onto an empty page.)
    let loadSettled = false;
    let appSettled = false;

    const tryMarkReady = () => {
      if (loadSettled && appSettled) markReady();
    };

    const settleLoad = () => {
      if (loadSettled) return;
      loadSettled = true;
      tryMarkReady();
    };

    const settleApp = () => {
      if (appSettled) return;
      appSettled = true;
      tryMarkReady();
    };

    const handleAppRendered = () => {
      if (appSettled) return;
      // Restart the minimum-display clock now that the routed page has
      // mounted, so it always gets a full settle window behind the closed
      // curtains (first paint, fonts, images) before the reveal can start.
      bootRef.current = performance.now();
      settleApp();
    };

    window.addEventListener("app:rendered", handleAppRendered, { once: true });
    Promise.all([fontsReady, windowLoaded]).then(settleLoad).catch(settleLoad);

    const loadCap = setTimeout(settleLoad, READY_TIMEOUT);
    const appCap = setTimeout(settleApp, APP_READY_TIMEOUT);

    return () => {
      clearTimeout(loadCap);
      clearTimeout(appCap);
      window.removeEventListener("load", resolveWindowLoad);
      window.removeEventListener("app:rendered", handleAppRendered);
    };
  }, []);

  // Release — hold at 100%, fade the stage out, then part the curtains.
  useEffect(() => {
    if (!isReady || progress < 100) return;

    const holdTimer = setTimeout(() => {
      // Re-enable scrolling while the curtains are still fully closed: the
      // scrollbar reappearing reflows the page by a few pixels, and behind
      // the doors that shift is invisible — by the time the reveal starts
      // the layout is already final, so the landing is perfectly still.
      document.body.classList.remove("page-is-loading");
      setIsExiting(true);
    }, HOLD_AT_100);

    const exitTimer = setTimeout(
      () => {
        // Unmount a beat after the curtains have finished opening so a
        // dropped frame near the end can never pop the loader early.
        onFinish();
      },
      HOLD_AT_100 +
        (reducedMotion ? 360 : PANEL_DELAY + REVEAL_DURATION + UNMOUNT_BUFFER),
    );

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [isReady, progress, onFinish, reducedMotion]);

  const panelTransition = {
    duration: reducedMotion ? 0.25 : REVEAL_DURATION / 1000,
    ease: reducedMotion ? "easeOut" : EASE,
    // Hold both doors closed for PANEL_DELAY so the stage visibly fades out
    // first, then part together — identical delay on each side keeps the
    // opening perfectly centred.
    delay: isExiting && !reducedMotion ? PANEL_DELAY / 1000 : 0,
  };

  return (
    <div
      className={`loading-screen${isExiting ? " loading-screen--exiting" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      aria-hidden={isExiting || undefined}
    >
      {/* Curtains — both panels share identical timing so the opening
          stays perfectly centred while they part. */}
      <motion.div
        className="loading-screen__panel loading-screen__panel--left"
        initial={false}
        animate={{
          x: isExiting && !reducedMotion ? "-100%" : "0%",
          opacity: isExiting && reducedMotion ? 0 : 1,
          transition: panelTransition,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="loading-screen__panel loading-screen__panel--right"
        initial={false}
        animate={{
          x: isExiting && !reducedMotion ? "100%" : "0%",
          opacity: isExiting && reducedMotion ? 0 : 1,
          transition: panelTransition,
        }}
        aria-hidden="true"
      />

      {/* Dark canvas behind everything */}
      <div className="loading-screen__backdrop" aria-hidden="true" />

      {/* Stage content */}
      <div
        className={`loading-screen__content${isExiting ? " loading-screen__content--exit" : ""}`}
      >
        <div className="loading-screen__stage">
          <img src={logo} alt="" draggable={false} />
        </div>

        <div className="loading-screen__counter" aria-live="polite" aria-atomic="true">
          <span className="loading-screen__counter-value">{progress}</span>
          <span className="loading-screen__counter-unit">%</span>
        </div>

        <div
          className="loading-screen__bar"
          style={{ "--loading-progress": progress / 100 } as React.CSSProperties}
          aria-hidden="true"
        />

        <div className="loading-screen__tagline" aria-hidden="true">
          {TAGLINE.split(" ").map((word, index) => (
            <span
              key={index}
              className="loading-screen__tagline-word"
              style={{ animationDelay: `${340 + index * 70}ms` }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;