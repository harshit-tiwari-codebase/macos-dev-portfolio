import { AudioLines, ArrowUpRight } from "lucide-react";
import MacWindow from "./MacWindow";

const PLAYLIST_ID = "37i9dQZF1E4oJSdHZrVjxD";

const SpotifyWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Listening room"
      initialWidth={560}
      initialHeight={520}
    >
      <div className="flex h-full w-full flex-col bg-[#111512] text-white">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1ed760] text-[#102015]">
              <img src="/doc-icons/spotify.svg" alt="" className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Listening room</h1>
              <p className="mt-0.5 text-xs text-white/50">Spotify player</p>
            </div>
          </div>
          <a
            href={`https://open.spotify.com/playlist/${PLAYLIST_ID}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Open in Spotify
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </header>

        <div className="min-h-0 flex-1 p-3 sm:p-4">
          <div className="relative h-full overflow-hidden rounded-lg border border-white/10 bg-[#151a16]">
            <iframe
              data-testid="embed-iframe"
              title="Spotify playlist player"
              src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="relative z-0 h-full w-full"
            />
            <div aria-hidden="true" className="pointer-events-none absolute right-3 top-3 z-10 flex h-8 items-end gap-1 rounded-md bg-black/55 px-2 py-1 backdrop-blur-sm" title="Music visualizer">
              <AudioLines className="mr-0.5 h-4 w-4 self-center text-[#1ed760]" />
              {[0, 1, 2, 3, 4].map((bar) => <span key={bar} className="music-visualizer-bar w-1 rounded-full bg-[#1ed760]" style={{ animationDelay: `${bar * 120}ms` }} />)}
            </div>
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default SpotifyWindow;
