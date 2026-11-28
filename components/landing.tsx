"use client";

import Link from "next/link";
import { HabitatFilm } from "@/components/habitat-film";
import { range, story, plotHero, plotFlip } from "@/content/copy";
import { PlaceToggle } from "@/components/place";
import { FeatureGrid } from "@/components/feature-grid";
import { EntitySpec } from "@/components/entity-spec";
import { EntityField, FieldTiles, useField } from "@/components/entity-field";
import { WaitlistForm } from "@/components/waitlist-form";
import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TeamDialog } from "@/components/team-dialog";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

const LAST = 3;
const HERO_FLIP_MS = 720;
const HERO_HOLD_MS = 2800;

function isField(node: EventTarget | null) {
  const tag = (node as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function HeroAside({ lines }: { lines: readonly string[] }) {
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState(false);
  const front = lines[n];
  const back = lines[(n + 1) % lines.length];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let flipId = 0;
    let snapId = 0;
    let holdId = 0;
    const cycle = () => {
      setSnap(false);
      setOpen(true);
      flipId = window.setTimeout(() => {
        setSnap(true);
        setOpen(false);
        setN((i) => (i + 1) % lines.length);
        snapId = window.setTimeout(() => {
          setSnap(false);
          holdId = window.setTimeout(cycle, HERO_HOLD_MS);
        }, 40);
      }, HERO_FLIP_MS);
    };
    holdId = window.setTimeout(cycle, HERO_HOLD_MS);
    return () => {
      window.clearTimeout(flipId);
      window.clearTimeout(snapId);
      window.clearTimeout(holdId);
    };
  }, [lines]);

  return (
    <span className="land-hero-flip" aria-live="polite">
      {lines.map((line) => (
        <span key={line} className="land-hero-flip-sizer" aria-hidden="true">
          {line}
        </span>
      ))}
      <span className={`land-hero-flip-inner${open ? " is-open" : ""}${snap ? " is-snap" : ""}`}>
        <span className="land-hero-flip-face">{front}</span>
        <span className="land-hero-flip-face is-back">{back}</span>
      </span>
    </span>
  );
}

function HeroLine({ title, lines }: { title: string; lines: readonly string[] }) {
  return (
    <p className="land-hero-hold">
      <svg className="land-opening-symbol" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5 21 6v6.2c0 4.2-2.7 7.4-9 9.3-6.3-1.9-9-5.1-9-9.3V6L12 2.5Z" />
        <path d="m8 9 2.5 2.5L8 14m5 1h3" />
      </svg>
      <span className="land-hero-ghost">
        <span className="land-hero-live">{title}</span>
      </span>
      <span className="land-hero-slash land-hero-live">/</span>
      <span className="land-hero-aside land-hero-live">
        <HeroAside lines={lines} />
      </span>
    </p>
  );
}

function MobileTileRow() {
  return <div className="mobile-tile-row" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span className="mobile-background-tile" key={i} />)}</div>;
}

function StoryPage({
  headRef,
  specId,
}: {
  headRef?: Ref<HTMLParagraphElement>;
  specId?: string;
}) {
  return (
    <section className="split-stage land land-story">
      <MobileTileRow />
      <div className="land-story-col">
        <p className="land-story-head land-story-title" ref={headRef}>
          <svg className="land-opening-symbol" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4" /><path d="m8 8 3 3-3 3M13 16h4" /></svg><span className="land-hero-live">{story.hero}</span>
        </p>
        <div className="land-story-body">
          <div className="land-story-copy">
            <p className="land-mid">
              {story.problem.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <HabitatFilm className="land-core-kicker">
              <span className="land-hero-live">{story.core}</span>
              <span className="land-ask-go-mark" aria-hidden="true">
                <svg viewBox="0 0 12 12">
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </HabitatFilm>
          </div>
        </div>
      </div>
      <EntitySpec panelId={specId} />
    </section>
  );
}

function PlotPage({ headRef }: { headRef?: Ref<HTMLParagraphElement> }) {
  return (
    <section className="split-stage land land-story land-plot-stage">
      <div className="land-story-col">
        <p className="land-story-head" ref={headRef} aria-hidden="true" />
      </div>
      <div className="land-spec-hold land-plot-hold">
        <FieldTiles zones={["plot"]} className="land-spec" />
      </div>
      <HeroLine title={plotHero} lines={plotFlip} />
    </section>
  );
}

function LandingHead({
  onHome,
  onJoin,
}: {
  onHome: () => void;
  onJoin: () => void;
}) {
  const { offer, kitOn, holdKit, returnOffer } = useField();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="land-head">
      <div className="head-bar">
        <div className="head-ident">
          {!offer && (
            <button
              type="button"
              className="head-link head-kit"
              data-on={kitOn ? "1" : undefined}
              aria-pressed={kitOn}
              aria-label={kitOn ? "Lock Potential" : "Unlock Potential"}
              onClick={holdKit}
            >
              {kitOn ? "Lock Potential" : "Unlock Potential"}
            </button>
          )}
          <Link
            href="/"
            className="head-brand"
            onClick={(event) => {
              event.preventDefault();
              if (!offer) returnOffer();
              onHome();
            }}
          >
            Entity Io<span className="head-brand-divider" aria-hidden="true">\</span><span className="head-brand-extension">Operational Intelligence</span>
          </Link>
        </div>
        <button type="button" className="mobile-menu-toggle" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="landing-navigation" onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
        <nav id="landing-navigation" className="head-rail" data-mobile-open={menuOpen ? "1" : "0"} aria-label="Main navigation">
          <TeamDialog />
          <span className="head-sep" aria-hidden="true" />
          <Link
            href="/?enroll=1"
            className="head-link"
            onClick={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              onJoin();
            }}
          >
            Pilot Product
          </Link>
          <span className="head-sep" aria-hidden="true" />
          <HabitatFilm className="head-link">
            {range.explore}
          </HabitatFilm>
          <span className="head-sep" aria-hidden="true" />
          <PlaceToggle />
        </nav>
      </div>
    </header>
  );
}

export function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLHeadingElement>(null);
  const slotRef = useRef<HTMLParagraphElement>(null);
  const slotCopyRef = useRef<HTMLParagraphElement>(null);
  const joinSlotRef = useRef<HTMLParagraphElement>(null);
  const goRef = useRef<(next: number) => void>(() => undefined);
  const wheel = useMemo(() => [WheelGesturesPlugin({ forceWheelAxis: "y" as const })], []);
  const [viewportRef, embla] = useEmblaCarousel(
    {
      axis: "y",
      loop: false,
      align: "start",
      skipSnaps: false,
      duration: 18,
      watchDrag: (_, event) => {
        // Let Embla reset its post-drag click suppression for these native inputs.
        // Embla ignores input elements for dragging, so the form remains stationary.
        if (event.target instanceof HTMLInputElement && event.target.closest('.land-ask-seats')) return true;
        if (isField(event.target)) return false;
        if (event.type === "touchstart" && window.matchMedia("(max-width: 600px), (max-width: 1000px) and (max-height: 600px) and (orientation: landscape) and (pointer: coarse)").matches && (event.target as Element | null)?.closest(".land-seat-stage .land-story-col, .land-story:not(.land-plot-stage):not(.land-seat-stage)")) return false;
        if (event.type === "touchstart" && window.matchMedia("(max-width: 600px), (max-width: 1000px) and (max-height: 600px) and (orientation: landscape) and (pointer: coarse)").matches && !(event.target as Element | null)?.closest(".land-ask-form, button, a")) return true;
        const path = typeof event.composedPath === "function" ? event.composedPath() : [];
        if (path.some((node) => node instanceof Element && node.closest(".feat-reel, .feat-grid, .feat-board, .land-spec, .feat-join, .land-ask-form, [data-epic]"))) {
          return false;
        }
        const node = event.target as HTMLElement | null;
        return !node?.closest(".feat-reel, .feat-grid, .feat-board, .land-spec, .feat-join, .land-ask-form, [data-epic]");
      },
    },
    wheel,
  );

  useEffect(() => {
    const lines = rootRef.current?.querySelectorAll<HTMLElement>(".land-opening-line, .land-story-title .land-hero-live");
    if (!lines?.length) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let previous = 50;
    const drift = () => {
      let next = 15 + Math.random() * 70;
      if (Math.abs(next - previous) < 20) next = previous > 50 ? 15 : 85;
      previous = next;
      const duration = 3500 + Math.random() * 2500;
      lines.forEach((line) => {
        line.style.transition = `background-position ${duration}ms cubic-bezier(.45, 0, .55, 1)`;
        line.style.backgroundPosition = `${next}% 0`;
      });
      timer = window.setTimeout(drift, duration);
    };
    const syncMotion = () => {
      window.clearTimeout(timer);
      if (motion.matches) {
        lines.forEach((line) => {
          line.style.removeProperty("transition");
          line.style.removeProperty("background-position");
        });
      } else {
        lines.forEach((line) => { line.style.backgroundPosition = `${previous}% 0`; });
        timer = window.setTimeout(drift, 50);
      }
    };
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener("change", syncMotion);
      lines.forEach((line) => {
        line.style.removeProperty("transition");
        line.style.removeProperty("background-position");
      });
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const nextNum = root?.querySelector<HTMLElement>(".land-next");
    if (!root || !nextNum || !embla) return;

    const pin = pinRef.current;
    const slot = slotRef.current;
    const joinSlot = joinSlotRef.current;
    const live = pin?.querySelector<HTMLElement>(".land-hero-live");

    const place = () => {
      if (!pin) return;
      const at = Number(root.dataset.page ?? 0);
      const floatingSymbol = root.querySelector<SVGElement>(".land-travel-symbol");
      const firstSymbol = root.querySelector<SVGElement>(".land-opening-line .land-opening-symbol");
      const secondSymbol = root.querySelector<SVGElement>(".land-story-title .land-opening-symbol");
      if (floatingSymbol && firstSymbol && secondSymbol) {
        const snaps = embla.scrollSnapList();
        const firstSnap = snaps[1] || 1;
        const progress = Math.max(0, Math.min(1, embla.scrollProgress() / firstSnap));
        const origin = root.getBoundingClientRect();
        const first = firstSymbol.getBoundingClientRect();
        const second = secondSymbol.getBoundingClientRect();
        const firstY = first.top - origin.top + progress * root.clientHeight;
        const secondY = second.top - origin.top - (1 - progress) * root.clientHeight;
        floatingSymbol.style.width = `${first.width + (second.width - first.width) * progress}px`;
        floatingSymbol.style.height = `${first.height + (second.height - first.height) * progress}px`;
        floatingSymbol.style.left = `${first.left - origin.left + (second.left - first.left) * progress}px`;
        floatingSymbol.style.top = `${firstY + (secondY - firstY) * progress}px`;
        floatingSymbol.style.visibility = at < 2 ? "visible" : "hidden";
      }
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const bottomPad = (window.matchMedia("(max-width: 860px)").matches ? 0.15 : 0.35) * rem + 96;
      const restTop = root.clientHeight - bottomPad - pin.offsetHeight;
      if (at === 2) {
        const hint = root.querySelector<HTMLElement>(".land-hint");
        if (hint) {
          const hintRect = hint.getBoundingClientRect();
          pin.style.bottom = "auto";
          pin.style.top = `${hintRect.top + hintRect.height / 2 - root.getBoundingClientRect().top - pin.offsetHeight / 2}px`;
          return;
        }
      }
      pin.style.bottom = "auto";
      const mark = at === LAST ? joinSlot : at === 2 ? null : slot;
      if (!mark) {
        pin.style.top = `${restTop}px`;
        return;
      }
      const slotTop = mark.getBoundingClientRect().top - root.getBoundingClientRect().top;
      pin.style.top = `${Math.min(restTop, slotTop)}px`;
    };

    const paint = (page: number) => {
      const at = Math.max(0, Math.min(LAST, page));
      root.dataset.page = String(at);
      nextNum.textContent = String(at + 1).padStart(2, "0");
      if (live) {
        live.textContent = at === LAST ? story.join : at === 2 ? plotHero : story.hero;
      }
    };

    const nearest = () => {
      const snaps = embla.scrollSnapList();
      const progress = embla.scrollProgress();
      let at = 0;
      let best = Infinity;
      for (let i = 0; i < snaps.length; i += 1) {
        const d = Math.abs(snaps[i] - progress);
        if (d < best) {
          best = d;
          at = i;
        }
      }
      return at;
    };

    goRef.current = (next) => {
      const page = Math.max(0, Math.min(LAST, next));
      paint(page);
      embla.scrollTo(page);
    };

    const sync = () => {
      paint(nearest());
      place();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || isField(event.target) || document.querySelector("dialog[open]")) return;
      if ((event.target as HTMLElement | null)?.closest?.(".feat-grid, .feat-board, .land-spec, .feat-join")) return;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goRef.current(Number(root.dataset.page ?? 0) + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goRef.current(Number(root.dataset.page ?? 0) - 1);
      }
    };

    paint(embla.selectedScrollSnap());
    place();
    if (new URLSearchParams(window.location.search).has("enroll")) {
      goRef.current(LAST);
    }
    embla.on("scroll", sync);
    embla.on("select", sync);
    embla.on("reInit", sync);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    return () => {
      embla.off("scroll", sync);
      embla.off("select", sync);
      embla.off("reInit", sync);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
    };
  }, [embla]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !embla) return;
    let start: { x: number; y: number; page: number; atTop: boolean; atBottom: boolean } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      if (!window.matchMedia("(max-width: 600px), (max-width: 1000px) and (max-height: 600px) and (orientation: landscape) and (pointer: coarse)").matches || event.touches.length !== 1) return;
      const target = event.target as Element | null;
      if (target?.closest("input, textarea, select, button, a, dialog, .land-head")) return;
      const page = Number(root.dataset.page ?? 0);
      const scroll = target?.closest<HTMLElement>(".land-seat-stage .land-story-col, .land-story:not(.land-plot-stage):not(.land-seat-stage)") ?? null;
      if (!scroll && page !== LAST) return;
      start = { x: event.touches[0].clientX, y: event.touches[0].clientY, page, atTop: !scroll || scroll.scrollTop <= 1, atBottom: !scroll || scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 1 };
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (!start || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (root.dataset.page === String(start.page) && Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.25) {
        if (dy > 0 && start.atTop) goRef.current(start.page - 1);
        else if (dy < 0 && start.atBottom) goRef.current(start.page === LAST ? LAST - 1 : start.page + 1);
      }
      start = null;
    };
    const cancel = () => { start = null; };
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("touchcancel", cancel);
    return () => { root.removeEventListener("touchstart", onTouchStart); root.removeEventListener("touchend", onTouchEnd); root.removeEventListener("touchcancel", cancel); };
  }, [embla]);

  return (
    <EntityField embla={embla}>
    <div className="split land-site" ref={rootRef} data-page="0">
      <div className="portrait-notice" role="status">Please turn your phone upright to view the site.</div>
      <span className="land-spine" aria-hidden="true" />
      <LandingHead onHome={() => goRef.current(0)} onJoin={() => goRef.current(LAST)} />
      <svg className="land-opening-symbol land-travel-symbol" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4" /><path d="m8 8 3 3-3 3M13 16h4" /></svg>
      <h1 className="land-hero" ref={pinRef}>
        <span className="land-hero-live">{story.hero}</span>
      </h1>
      <div className="land-pager" ref={viewportRef}>
        <div className="land-track">
          <section className="split-stage land land-open">
            <MobileTileRow />
            <FeatureGrid />
            <p className="land-opening-line"><svg className="land-opening-symbol" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4" /><path d="m8 8 3 3-3 3M13 16h4" /></svg>See your entire operation, <span>shape what happens next.</span></p>
          </section>
          <StoryPage headRef={slotRef} />
          <PlotPage headRef={slotCopyRef} />
          <section className="split-stage land land-story land-seat-stage">
            <MobileTileRow />
            <div className="land-story-col">
              <p className="land-story-head" ref={joinSlotRef} aria-hidden="true">
                <span className="land-hero-live">{story.join}</span>
              </p>
              <div className="land-story-body">
                <div className="land-story-copy">
                  <p className="land-mid">
                    <span>{story.ask}</span>
                  </p>
                  <WaitlistForm tone="field" />
                </div>
              </div>
            </div>
            <div className="land-spec-hold land-ask-hold">
              <FieldTiles zones={["ask"]} className="land-spec land-ask-field" />
            </div>
          </section>
        </div>
      </div>
      <div className="land-hint">
        <button
          type="button"
          className="land-flick land-flick-prev"
          aria-label="Previous page"
          onClick={() => goRef.current(Number(rootRef.current?.dataset.page ?? 0) - 1)}
        >
          <span className="land-flick-mark" aria-hidden="true">
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="land-flick"
          aria-label="Next page"
          onClick={() => goRef.current(Number(rootRef.current?.dataset.page ?? 0) + 1)}
        >
          <span className="land-flick-mark" aria-hidden="true">
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <span className="land-next" aria-label="Current page">01</span>
      </div>
    </div>
    </EntityField>
  );
}
