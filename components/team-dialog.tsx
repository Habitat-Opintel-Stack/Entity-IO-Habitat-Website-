"use client";

import { useRef } from "react";

const team = [
  { name: "Ben L. Beresford", role: "Founder, Director and Chief Executive Officer" },
  { name: "Pete Hitchen", role: "Chief Data and Technology Officer" },
  { name: "Sujata Dongol", role: "Head of Engineering" },
  { name: "Ivan Lengyel", role: "Cyber Security and AI Advisor" },
];

export function TeamDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="head-link" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>Meet the Team</button>
      <dialog ref={dialog} className="habitat-film team-dialog" aria-labelledby="team-dialog-title">
        <div className="habitat-film-bar">
          <span id="team-dialog-title">Entity Io / Meet the Team</span>
          <button type="button" className="habitat-film-close" onClick={() => dialog.current?.close()} aria-label="Close team window">×</button>
        </div>
        <div className="habitat-film-screen team-dialog-screen">
          <ul className="team-list">
            {team.map((member) => <li key={member.name}><span>{member.name}</span><span className="team-role">{member.role}</span></li>)}
          </ul>
        </div>
      </dialog>
    </>
  );
}
