"use client";

import Link from "next/link";
import { HabitatFilm } from "@/components/habitat-film";
import { useState } from "react";
import { range, rangeNumerals } from "@/content/copy";
import { PlaceToggle } from "@/components/place";
import { EntityField, FieldTiles, usePadCols } from "@/components/entity-field";
import type { RangeRead } from "@/components/range-carousel";

const ENROLL = "/?enroll=1";
const PLOT_CORNER = [{ col: 6, row: 13, zone: "plot" as const }];
const PLOT_WIDE = [9, 10, 11, 12, 13].map((row) => ({ col: 7, row, zone: "plot" as const }));
const PLOT_EXTRA_WIDE = [...PLOT_CORNER, ...PLOT_WIDE];
const PLOT_CAROUSEL = { c: 6, r: 11 };
const PLOT_CAROUSEL_WIDE = { c: 7, r: 11 };
const PLOT_GATE = { c: 0, r: 12 };
const PLOT_KEEP = ["0,12"];

function viewNumeral(view: (typeof range.habitat) | (typeof range.engineering) | (typeof range.views)[number]) {
  if (!("code" in view)) return null;
  return rangeNumerals[Number(view.code) - 1] ?? null;
}

export function ProductRange() {
  const wide = usePadCols() > 7;
  const carousel = wide ? PLOT_CAROUSEL_WIDE : PLOT_CAROUSEL;
  const extra = wide ? PLOT_EXTRA_WIDE : PLOT_CORNER;
  const [read, setRead] = useState<RangeRead | null>("habitat");
  const [cover, setCover] = useState(false);
  const view =
    read === "habitat"
      ? cover
        ? null
        : range.habitat
      : read === "technical"
        ? range.engineering
        : read;
  const numeral = view ? viewNumeral(view) : null;
  const habitat = Boolean(view && read === "habitat");

  return (
    <EntityField page={2} extraCells={extra} hubSeat={carousel} hubStart={PLOT_GATE}>
      <div className="split land-site range-page" data-page="2">
        <span className="land-spine" aria-hidden="true" />
        <header className="land-head">
          <div className="head-bar">
            <div className="head-ident">
              <Link href="/" className="head-brand">
                Entity Io<span className="head-brand-divider" aria-hidden="true">\</span><span className="head-brand-extension">Operational Intelligence</span>
              </Link>
            </div>
            <nav className="head-rail">
              <Link href={ENROLL} className="head-link">
                {range.enroll}
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
        <section className="split-stage land land-story land-plot-stage">
          {view ? (
            <div className="land-story-col" key={view.name} data-numeral={numeral ? "1" : undefined}>
              <p className="land-story-head">
                <span className="land-hero-live">
                  {numeral ? <span className="range-numeral">{numeral}.</span> : null}
                  {numeral ? " " : null}
                  {view.name}
                </span>
              </p>
              <div className="land-story-body">
                <div className="land-story-copy">
                  {habitat ? (
                    <p className="land-mid">
                      <span>{range.habitat.aside}</span>
                      {range.habitat.lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </p>
                  ) : (
                    <>
                      <p className="land-mid">
                        {"aside" in view && view.aside ? <span>{view.aside}</span> : null}
                        {view.lines.slice(0, view.lines.length > 1 ? -1 : undefined).map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </p>
                      {view.lines.length > 1 ? (
                        <div className="range-foot">
                          <ul className="range-uses">
                            {view.lines[view.lines.length - 1].split(" · ").map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <div className="land-spec-hold land-plot-hold">
            <FieldTiles
              zones={["plot"]}
              className="land-spec"
              loneEpic
              carouselSeat={carousel}
              showCells={PLOT_KEEP}
              onView={setRead}
              onCover={setCover}
            />
          </div>
        </section>
      </div>
    </EntityField>
  );
}
