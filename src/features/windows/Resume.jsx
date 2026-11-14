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
      title="Resume"
      initialWidth={750}
      initialHeight={550}
    >
      <div className="flex h-full w-full flex-col bg-[#10141a] text-[#dce2eb]">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#2a313c] bg-[#141922] px-3 py-2.5 text-xs text-[#a2adba] sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <img src="/doc-icons/pdf.svg" alt="" className="h-5 w-5 shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-none text-[11px] sm:text-xs">
              Harshit_Tiwari_Professional_Resume.pdf
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/documents/Harshit_Tiwari_Professional_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#343d49] bg-[#1a2029] px-3 py-2 text-xs font-medium text-[#c8d0db] transition-colors hover:bg-[#252d38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
              title="Open in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </a>
            <a
              href="/documents/Harshit_Tiwari_Professional_Resume.pdf"
              download="Harshit_Tiwari_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-[#d5defd] px-3 py-2 text-xs font-semibold text-[#19233a] transition-colors hover:bg-[#bdcbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6b7ff]"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          </div>
        </div>
        <iframe
          className="min-h-0 w-full flex-1 bg-[#10141a]"
          src="/documents/Harshit_Tiwari_Professional_Resume.pdf"
          title="Harshit Tiwari Resume"
        />
      </div>
    </MacWindow>
  )
}

export default Resume
