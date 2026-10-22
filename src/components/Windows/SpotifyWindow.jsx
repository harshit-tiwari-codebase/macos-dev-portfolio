import React from "react";
import MacWindow from "./MacWindow";

const SpotifyWindow = ({ windowName, WindowState, setWindowState, activeWindow, setActiveWindow }) => {
  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Spotify — Music"
      initialWidth={500}
      initialHeight={480}
    >
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1E4oJSdHZrVjxD?utm_source=generator&theme=0"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl w-full h-full"
      />
    </MacWindow>
  );
};

export default SpotifyWindow;
