"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const places = [
  { id: "sydney", label: "Sydney", zone: "Australia/Sydney" },
  { id: "melbourne", label: "Melbourne", zone: "Australia/Melbourne" },
  { id: "brisbane", label: "Brisbane", zone: "Australia/Brisbane" },
  { id: "perth", label: "Perth", zone: "Australia/Perth" },
  { id: "adelaide", label: "Adelaide", zone: "Australia/Adelaide" },
  { id: "auckland", label: "Auckland", zone: "Pacific/Auckland" },
  { id: "wellington", label: "Wellington", zone: "Pacific/Auckland" },
  { id: "singapore", label: "Singapore", zone: "Asia/Singapore" },
  { id: "london", label: "London", zone: "Europe/London" },
  { id: "manchester", label: "Manchester", zone: "Europe/London" },
  { id: "edinburgh", label: "Edinburgh", zone: "Europe/London" },
  { id: "dublin", label: "Dublin", zone: "Europe/Dublin" },
  { id: "new-york", label: "New York", zone: "America/New_York" },
  { id: "los-angeles", label: "Los Angeles", zone: "America/Los_Angeles" },
  { id: "chicago", label: "Chicago", zone: "America/Chicago" },
  { id: "san-francisco", label: "San Francisco", zone: "America/Los_Angeles" },
  { id: "toronto", label: "Toronto", zone: "America/Toronto" },
  { id: "vancouver", label: "Vancouver", zone: "America/Vancouver" },
  { id: "johannesburg", label: "Johannesburg", zone: "Africa/Johannesburg" },
  { id: "cape-town", label: "Cape Town", zone: "Africa/Johannesburg" },
] as const;

export type PlaceId = (typeof places)[number]["id"];

const DEFAULT_PLACE: PlaceId = "sydney";

const PlaceContext = createContext<{
  place: PlaceId;
  zone: string;
  setPlace: (id: PlaceId) => void;
}>({
  place: DEFAULT_PLACE,
  zone: "Australia/Sydney",
  setPlace: () => undefined,
});

function apply(id: PlaceId) {
  try {
    localStorage.setItem("kit-place", id);
  } catch {
    /* ignore */
  }
}

export function PlaceProvider({ children }: { children: React.ReactNode }) {
  const [place, setPlaceState] = useState<PlaceId>(DEFAULT_PLACE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kit-place");
      if (places.some((item) => item.id === stored)) setPlaceState(stored as PlaceId);
    } catch {
      /* ignore */
    }
  }, []);

  const zone = places.find((item) => item.id === place)?.zone ?? places[0].zone;

  const value = useMemo(
    () => ({
      place,
      zone,
      setPlace: (id: PlaceId) => {
        setPlaceState(id);
        apply(id);
      },
    }),
    [place, zone],
  );

  return <PlaceContext.Provider value={value}>{children}</PlaceContext.Provider>;
}

export function usePlace() {
  return useContext(PlaceContext);
}

export function PlaceToggle() {
  return (
    <span className="head-globe head-stack" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 7.5 12 3l8.5 4.5L12 12z" />
          <path d="M3.5 11.2 12 15.7l8.5-4.5" />
          <path d="M3.5 15 12 19.5l8.5-4.5" />
        </g>
      </svg>
    </span>
  );
}
