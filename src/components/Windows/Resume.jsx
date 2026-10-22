import React from 'react'
import MacWindow from './MacWindow'
import { ExternalLink, Download } from 'lucide-react'

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
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-gray-300 gap-2">
          <span className="truncate max-w-[140px] sm:max-w-none text-[11px] sm:text-xs">
            Harshit_Tiwari_Resume.pdf
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/documents/Harshit_Tiwari_Professional_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1"
              title="Open in new tab"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">View</span>
            </a>
            <a
              href="/documents/Harshit_Tiwari_Professional_Resume.pdf"
              download="Harshit_Tiwari_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 sm:px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition text-xs flex items-center gap-1 font-medium"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </a>
          </div>
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
