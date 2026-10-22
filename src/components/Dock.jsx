import React from 'react'

const Dock = ({ WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  const openWindow = (windowName) => {
    setWindowState((state) => ({ ...state, [windowName]: true }))
    if (setActiveWindow) {
      setActiveWindow(windowName)
    }
  }

  return (
    <div
      className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 py-1.5 sm:py-2 px-1.5 sm:px-2.5 items-center rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-2xl z-50 select-none
        max-w-[calc(100vw-12px)] overflow-x-auto scrollbar-none"
    >
      <div
        onClick={() => { openWindow("projects") }}
        title="All Projects"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-blue-600 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/projects.svg" alt="Projects" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => { openWindow("github") }}
        title="GitHub"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-black flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/github.svg" alt="GitHub" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => { openWindow("note") }}
        title="Notes.js"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-yellow-900 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/note.svg" alt="Notes" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => { openWindow("resume") }}
        title="Resume"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-red-900 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/pdf.svg" alt="Resume" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => { openWindow("spotify") }}
        title="Spotify"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-green-900 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/spotify.svg" alt="Spotify" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => {
          window.open(
            "https://www.linkedin.com/in/harshit-tiwari-48830b3b4/",
            "_blank"
          )
        }}
        title="LinkedIn"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-blue-900 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/link.svg" alt="LinkedIn" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => { openWindow("cli") }}
        title="Terminal"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-neutral-800 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/cli.svg" alt="Terminal" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => {
          window.open(
            "https://calendar.google.com/calendar/u/0/r?pli=1",
            "_blank"
          )
        }}
        title="Calendar"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-orange-900 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/calender.svg" alt="Calendar" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>

      <div
        onClick={() => {
          window.open(
            "https://mail.google.com/mail/u/0/#inbox?compose=new",
            ""
          )
        }}
        title="Mail"
        className="icon p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-cyan-900 flex justify-center items-center cursor-pointer shrink-0"
      >
        <img src="/doc-icons/mail.svg" alt="Mail" className="w-5 h-5 sm:w-8 sm:h-8 select-none pointer-events-none" />
      </div>
    </div>
  )
}

export default Dock
