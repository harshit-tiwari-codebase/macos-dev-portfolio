import React from 'react'
import MacWindow from './MacWindow'

const Resume = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Resume — Harshit Tiwari"
      initialWidth={750}
      initialHeight={550}
    >
      <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-gray-300">
          <span>Harshit_Tiwari_Professional_Resume.pdf</span>
          <a
            href="/documents/Harshit_Tiwari_Professional_Resume.pdf"
            download="Harshit_Tiwari_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition text-xs flex items-center gap-1.5"
          >
            Download PDF
          </a>
        </div>
        <iframe
          className="w-full flex-1"
          src="/documents/Harshit_Tiwari_Professional_Resume.pdf"
          title="Harshit Tiwari Resume"
        />
      </div>
    </MacWindow>
  )
}

export default Resume
