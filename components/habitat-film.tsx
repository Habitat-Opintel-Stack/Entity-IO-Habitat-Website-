"use client";

import { useRef, type ReactNode } from "react";

/** Set NEXT_PUBLIC_HABITAT_FILM_URL and NEXT_PUBLIC_HABITAT_CAPTIONS_URL when the film is ready. */
export function HabitatFilm({ children, className }: { children: ReactNode; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const filmUrl = process.env.NEXT_PUBLIC_HABITAT_FILM_URL;
  const captionsUrl = process.env.NEXT_PUBLIC_HABITAT_CAPTIONS_URL;

  function close() {
    video.current?.pause();
    dialog.current?.close();
  }

  return <>
    <button type="button" className={className} onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">{children}</button>
    <dialog ref={dialog} className="habitat-film" aria-labelledby="habitat-film-title" onClose={() => video.current?.pause()}>
      <div className="habitat-film-bar"><span id="habitat-film-title">Habitat / Product film</span><button type="button" className="habitat-film-close" onClick={close} aria-label="Close product film">×</button></div>
      {filmUrl ? <video ref={video} className="habitat-film-screen" poster="/habitat-film-poster.png" controls playsInline preload="metadata"><source src={filmUrl} type="video/mp4" />{captionsUrl && <track kind="captions" src={captionsUrl} srcLang="en" label="English" default />}Your browser does not support video playback.</video> : <div className="habitat-film-screen habitat-film-poster" role="img" aria-label="Luminous glass platform" />}
    </dialog>
  </>;
}
