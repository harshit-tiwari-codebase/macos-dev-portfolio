import React from "react";
import MusicWindow from "./MusicWindow";

/**
 * Backward compatibility alias for SpotifyWindow
 * Now powered by the native Apple Music player
 */
const SpotifyWindow = (props) => {
  return <MusicWindow {...props} />;
};

export default SpotifyWindow;