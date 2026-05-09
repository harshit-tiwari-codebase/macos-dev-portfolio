import React from "react";
import MacWindow from "./MacWindow";

const SpotifyWindow = () => {
  return (
    <MacWindow>
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1E4oJSdHZrVjxD?utm_source=generator&theme=0"
        width="100%"
        height={"100%"}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      ></iframe>
    </MacWindow>
  );
};

export default SpotifyWindow;