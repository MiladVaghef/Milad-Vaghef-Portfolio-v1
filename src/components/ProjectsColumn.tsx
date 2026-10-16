import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { projectsData, type Project } from "../data/projects";
import { formatProjectAge, projectDateValue } from "../utils/projectDate";
import Icon, { type IconType } from "./Icon";
import LazyImage from "./LazyImage";
import Reveal from "./Reveal";
import { ProjectModalSkeleton } from "./Skeleton";

// The lightbox (and its Swiper dependency) is its own chunk. It only starts
// downloading the first time a card is opened, so the projects page never pays
// for it — see `modalRequested` below.
const ProjectModal = lazy(() => import("./ProjectModal"));

// Swiper
import Swiper from "swiper";
import type SwiperCore from "swiper";
import { Navigation } from "swiper/modules";

const categories: { label: string; icon: IconType }[] = [
  { label: "Front-End", icon: "front-end" },
  { label: "WordPress", icon: "wordpress" },
  { label: "Figma", icon: "figma" },
];

// Index of the category named by the URL hash (0 = Front-End when there's no
// hash or it doesn't match) — seeds both the active-tab state and Swiper's
// starting slide so deep links land on the right chip.
const seededCategoryIndex = () => {
  const hash = decodeURIComponent(window.location.hash.replace("#", ""));

  return Math.max(
    0,
    categories.findIndex((category) => category.label === hash),
  );
};

const ProjectsColumn = () => {
  // Which project's lightbox is currently open (null = closed).
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Flips on the first open and stays on: the lazy ProjectModal must keep
  // rendering after close (with project=null) so AnimatePresence can play the
  // exit animation — unmounting it would cut the lightbox out with no fade.
  const [modalRequested, setModalRequested] = useState(false);

  const openProject = useCallback((project: Project) => {
    setModalRequested(true);
    setActiveProject(project);
  }, []);

  const closeProject = useCallback(() => setActiveProject(null), []);

  const swiperRef = useRef<HTMLDivElement | null>(null);
  const swiperInstance = useRef<SwiperCore | null>(null);

  // The scroll container and the sticky category bar inside it — the bar's
  // blur veil only turns on once cards actually scroll under it.
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  // The container anchors the custom scrollbar thumb (the wrapper's native
  // scrollbar is hidden — its track spanned the whole page).
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  // Which category the strip is showing — LOCAL state, seeded from the URL
  // hash. Swipes and taps update it directly and keep the hash in sync via
  // replaceState: a category change no longer round-trips through the router
  // (which re-rendered the whole route tree — full-page motion wrappers
  // included — at the end of every swipe) and no longer pushes a history
  // entry per swipe.
  const [activeTab, setActiveTab] = useState(() =>
    categories[seededCategoryIndex()].label
  );


  useEffect(() => {
    if (!swiperRef.current) return;

    swiperInstance.current = new Swiper(swiperRef.current, {
      modules: [Navigation],
      slidesPerView: "auto",
      centeredSlides: true,
      grabCursor: true,
      spaceBetween: 0,

      // Land on the hash-seeded chip on mount (deep links) — later changes
      // flow through slideChange below.
      initialSlide: seededCategoryIndex(),

      navigation: {
        nextEl: ".projects-next",
        prevEl: ".projects-prev",
      },

      on: {
        slideChange(swiper) {
          const category = categories[swiper.activeIndex];

          if (!category) return;

          setActiveTab(category.label);

          // replaceState, not hash-assignment: the URL stays shareable and
          // refresh-safe without a history entry per swipe or a router
          // re-render at the end of the gesture.
          const hash = `#${encodeURIComponent(category.label)}`;

          if (window.location.hash !== hash) {
            window.history.replaceState(null, "", hash);
          }
        },
      },
    });


    return () => {
      swiperInstance.current?.destroy(true, true);
      swiperInstance.current = null;
    };

  }, []);


  // Keep the bar's veil in sync with the scroll, start every tab at the
  // top (a stale scroll offset would mount the remounted cards clipped above
  // the viewport, where their reveal observers never fire — a whole column
  // reads as empty), and drive the custom scrollbar thumb: its track starts
  // below the category bar and stops just above the floating footer nav pill
  // (the container itself bleeds 30px past the visible page bottom).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bar = barRef.current;
    const container = containerRef.current;
    const thumb = thumbRef.current;

    if (!wrapper || !bar || !container || !thumb) return;

    wrapper.scrollTop = 0;

    // Px between the bar's bottom edge and the top of the thumb's track.
    const TRACK_TOP_GAP = 8;
    // Px between the container's bottom edge and the end of the track.
    // The container bleeds 30px past the visible page bottom, and the fixed
    // footer nav pill floats ~100px above it (20px offset + ~80px tall) —
    // 145 lands the track's end ~115px above the visible bottom, a touch
    // clear of the pill instead of sliding underneath it.
    const TRACK_BOTTOM_GAP = 145;
    // Smallest thumb so the handle stays visible when content barely
    // overflows.
    const MIN_THUMB = 48;

    const sync = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;

      bar.classList.toggle("scrolled", scrollTop > 0);

      const trackTop = bar.offsetHeight + TRACK_TOP_GAP;
      const trackH = container.offsetHeight - trackTop - TRACK_BOTTOM_GAP;
      const scrollable = scrollHeight - clientHeight;

      if (scrollable <= 1 || trackH < MIN_THUMB) {
        thumb.classList.remove("is-visible");
        return;
      }

      const thumbH = Math.min(
        trackH,
        Math.max(MIN_THUMB, (trackH * clientHeight) / scrollHeight),
      );
      const progress = scrollTop / scrollable;
      const y = trackTop + progress * (trackH - thumbH);

      thumb.style.height = `${Math.round(thumbH)}px`;
      thumb.style.transform = `translateY(${Math.round(y)}px)`;
      thumb.classList.add("is-visible");
    };

    wrapper.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();

    // --- Thumb interaction --------------------------------------------------
    // The thumb used to be pure decoration (pointer-events: none, no JS at
    // all — it was only positioned), so grabbing it did nothing and the grid
    // only scrolled via wheel/touch. It now behaves like the native
    // scrollbar it replaced: drag the thumb, click the track to page.

    // Same geometry `sync` uses — thumb travel vs. the wrapper's full
    // scrollable range; the ratio maps pointer delta onto scroll delta.
    const metrics = () => {
      const trackTop = bar.offsetHeight + TRACK_TOP_GAP;
      const trackH = container.offsetHeight - trackTop - TRACK_BOTTOM_GAP;
      const { scrollHeight, clientHeight } = wrapper;

      return {
        trackTop,
        trackH,
        scrollable: scrollHeight - clientHeight,
        travel: trackH - thumb.offsetHeight,
      };
    };

    // Drag: pointer events (not mouse) so touchscreens and touchpad taps
    // drag too — the thumb is desktop-only anyway (`display: none` ≤ tablet).
    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    const moveDrag = (e: PointerEvent) => {
      if (!dragging) return;

      const { travel, scrollable } = metrics();

      if (travel <= 0 || scrollable <= 0) return;

      wrapper.scrollTop =
        dragStartScroll + ((e.clientY - dragStartY) * scrollable) / travel;
    };

    const stopDrag = (e: PointerEvent) => {
      if (!dragging) return;

      dragging = false;

      if (thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId);
      }

      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };

    const startDrag = (e: PointerEvent) => {
      if (e.button !== 0) return;

      const { travel, scrollable } = metrics();

      // Nothing to scroll (or no room to travel) — no gesture to start.
      if (travel <= 0 || scrollable <= 1) return;

      dragging = true;
      dragStartY = e.clientY;
      dragStartScroll = wrapper.scrollTop;

      // Keep the gesture tracking outside the 4px bar, and stop the press
      // from starting a text selection / native drag.
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();

      window.addEventListener("pointermove", moveDrag);
      window.addEventListener("pointerup", stopDrag);
      window.addEventListener("pointercancel", stopDrag);
    };

    // The thumb is NOT inside the scroll wrapper, so a wheel over it would
    // bubble past the grid into the overflow-hidden page shell and do
    // nothing — forward it to the wrapper instead.
    const onThumbWheel = (e: WheelEvent) => {
      e.preventDefault();

      // deltaMode 1 = lines (some Firefox/Linux setups) — normalize to px.
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;

      wrapper.scrollTop += dy;
    };

    // Click the track — the empty strip the thumb rides in (it sits inside
    // the wrapper's 60px right padding, never over a card) — to page a
    // screen in that direction, like a native scrollbar track.
    const onTrackClick = (e: MouseEvent) => {
      if (e.button !== 0) return;

      const target = e.target as Node | null;

      // Only the empty chrome itself. Cards, the sticky bar, the grid and
      // the thumb all sit deeper (or ARE the thumb) and keep their own
      // behaviour — this also keeps modal overlays from paging the grid.
      if (target !== container && target !== wrapper) return;

      const { trackTop, trackH, scrollable } = metrics();

      if (scrollable <= 1 || trackH < MIN_THUMB) return;

      // Inside the thumb's column (with the widened hit-area slop)?
      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const HIT_SLOP = 12;

      if (
        e.clientX < thumbRect.left - HIT_SLOP ||
        e.clientX > thumbRect.right + HIT_SLOP
      ) {
        return;
      }

      // ...and inside the track's vertical span (not beside the category
      // bar at the top or the footer pill zone at the bottom).
      const y = e.clientY - containerRect.top;

      if (y < trackTop || y > trackTop + trackH) return;

      // Page up/down relative to where the thumb currently sits.
      const thumbCenter = (thumbRect.top + thumbRect.bottom) / 2 - containerRect.top;
      const direction = y < thumbCenter ? -1 : 1;

      wrapper.scrollTop += direction * wrapper.clientHeight;
    };

    thumb.addEventListener("pointerdown", startDrag);
    thumb.addEventListener("wheel", onThumbWheel, { passive: false });
    container.addEventListener("click", onTrackClick);

    return () => {
      wrapper.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);

      thumb.removeEventListener("pointerdown", startDrag);
      thumb.removeEventListener("wheel", onThumbWheel);
      container.removeEventListener("click", onTrackClick);

      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [activeTab]);


  // Recomputed only when the category actually changes — previously these ran
  // on every render (modal opens, etc.), feeding the gesture-commit spike.
  // Filtered AND sorted newest-first here so cards show how recently each
  // project was added; the masonry split below inherits the order.
  // (The Home page's projects row intentionally does NOT use this — it just
  // takes the top 4 entries of `projectsData` as-is.)
  const filteredProjects = useMemo(
    () =>
      projectsData
        .filter((project) => project.category === activeTab)
        .sort(
          (a, b) => projectDateValue(b.date) - projectDateValue(a.date),
        ),
    [activeTab],
  );


  // Masonry column calculation
  const columns = useMemo(() => {
    const result: Project[][] = [[], []];

    const columnHeights = [0, 0];

    filteredProjects.forEach((project) => {
      const imageRatio = project.height / project.width;


      // Estimate image height based on column width.
      // 500 is approximate width of the card.
      // You can adjust this if needed.
      const estimatedHeight = imageRatio * 500;


      const shortestColumn = columnHeights.indexOf(
        Math.min(...columnHeights)
      );


      result[shortestColumn].push(project);

      columnHeights[shortestColumn] += estimatedHeight;
    });

    return result;
  }, [filteredProjects]);



  return (
    <div ref={containerRef} className="column projects-column-container">

      <div ref={wrapperRef} className="projects-column-grid-wrapper">

      <div ref={barRef} className="category-slider-wrapper" data-no-swipe>

        <div
          ref={swiperRef}
          className="swiper projects-column-category"
        >

          <div className="swiper-wrapper">

            {categories.map(({ label, icon }) => (

              <div
                key={label}
                className="swiper-slide"
              >

                <div
                  className={`category-slide row ${
                    activeTab === label
                      ? "category-active"
                      : ""
                  }`}

                  onClick={() => {

                    const index = categories.findIndex(
                      (category) =>
                        category.label === label
                    );

                    swiperInstance.current?.slideTo(index);

                  }}
                >

                  <Icon name={icon} />

                  <span>{label}</span>

                </div>

              </div>

            ))}

          </div>

        </div>


        <div className="projects-prev swiper-button-prev" />

        <div className="projects-next swiper-button-next" />

      </div>



        {/* Remounting on tab change gives every category fresh reveal
            observers; the scroll reset itself lives on the scroll wrapper. */}
        <div key={activeTab} className="projects-column-grid">


          <div className="projects-column-grid-column">

            {columns[0].map((project) => (

              <ProjectCard
                key={project.title}
                project={project}
                onOpen={openProject}
              />

            ))}

          </div>



          <div className="projects-column-grid-column">

            {columns[1].map((project) => (

              <ProjectCard
                key={project.title}
                project={project}
                onOpen={openProject}
              />

            ))}

          </div>


        </div>

      </div>

      {/* Custom scrollbar thumb — the wrapper's native scrollbar is hidden
          (its track spanned the whole page); this one starts below the
          category bar and stops above the floating footer nav pill. Positions
          come from the scroll/resize sync effect above. */}
      <div ref={thumbRef} className="projects-scroll-thumb" aria-hidden="true" />

      {/* Lazy lightbox behind Suspense: a skeleton dialog (same chrome, same
          footprint) covers the gap while the chunk streams in on the first
          open, and the fallback goes null once closed so no skeleton lingers
          over the grid. */}
      {modalRequested && (
        <Suspense
          fallback={
            activeProject ? (
              <ProjectModalSkeleton
                project={activeProject}
                onClose={closeProject}
              />
            ) : null
          }
        >
          <ProjectModal project={activeProject} onClose={closeProject} />
        </Suspense>
      )}

    </div>
  );
};



// Memoized: its props (module-data project + stable openProject) never change,
// so category-swipe commits and lightbox state flips don't re-render every
// card on the grid — only the tab-keyed remount rebuilds them.
const ProjectCard = memo(({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) => {

  return (

    // Reveal slides the card up the first time it enters the viewport. The
    // amount must be tiny: full-page screenshot cards (e.g. Bushehr Khorma,
    // ~5× their width ≈ 3400px tall) can only show a sliver of themselves in
    // one fold — with 5% required, such a card sat INVISIBLE on screen until
    // the user scrolled. 1% reveals every card the moment a real slice of it
    // is on screen, while fully off-screen cards still stay hidden.
    <Reveal amount={0.01}>

      <div className="projects-column">

        <button
          type="button"
          className="projects-column-open"
          onClick={() => onOpen(project)}
          aria-label={`Open ${project.title}`}
        >

          <ProjectContent project={project} />

        </button>

      </div>

    </Reveal>

  );

});



const ProjectContent = ({
  project,
}: {
  project: Project;
}) => {

  const aspectRatio =
    project.height / project.width;


  return (

    <>

      <div className="projects-column-media">

        <LazyImage

          className="image-wrapper"

          src={project.image}

          alt={project.alt}

          style={{

            "--aspect-ratio": aspectRatio,

          } as React.CSSProperties}

        />


        {/* "N pages" badge — only for multi-image projects */}
        {project.gallery && project.gallery.length > 1 && (

          <span className="projects-column-badge">

            <Icon name="grid" />

            {project.gallery.length} pages

          </span>

        )}

        {/* "2 years ago" — glassy pill in the cover's bottom-left corner */}
        <time
          className="project-image-date"
          dateTime={project.date}
        >
          {formatProjectAge(project.date)}
        </time>

      </div>



      <div className="details column">

        <div className="projects-column-title row">

          <span className="medium">
            {project.title}
          </span>


          {project.activeLink && (
            <Icon name="path-link" />
          )}

        </div>


        <p className="light">
          {project.desc}
        </p>



        <ul className="row">

          {project.tech.map((tech) => (

            <li
              key={tech}
              className="tech"
            >
              {tech}
            </li>

          ))}


          {project.isPractice && (
            <li className="concept-tag">
              Experiment
            </li>
          )}

          {project.isConcept && (
            <li className="concept-tag">
              Concept
            </li>
          )}

        </ul>


      </div>

    </>

  );
};


export default ProjectsColumn;