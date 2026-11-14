import React, { useState, useRef, useEffect, useMemo } from "react";
import MacWindow from "./MacWindow";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Search,
  Radio,
  Compass,
  Home,
  Music2,
  ListMusic,
  User,
  Clock,
  AudioLines,
  Share2,
  Flame,
  Check,
} from "lucide-react";

export const MUSIC_PLAYLIST = [
  {
    id: 0,
    songName: "Lovely",
    artist: "Billie Eilish, Khalid",
    artistDescription:
      "Billie Eilish is an American singer-songwriter who rose to global fame for her unique whisper-style vocals, dark pop sound, and deeply emotional lyrics. She is known for breaking traditional pop norms, experimenting with minimal production, and addressing themes like mental health, loneliness, and self-identity in her music.",
    songPoster: "/music/img/Lovely.webp",
    artistPoster: "/music/img/billie elilish.png",
    url: "/music/audio/Billie_Eilish_Khalid_-_Lovely_(mp3.pm).mp3",
    likes: 1234,
    duration: "3:20",
    album: "13 Reasons Why (Season 2)",
  },
  {
    id: 1,
    songName: "Raat Ki Rani",
    artist: "Seedhe Maut",
    artistDescription:
      "Seedhe Maut is a Delhi-based hip-hop duo consisting of Calm and Encore ABJ. They are widely respected in the Indian underground rap scene for their raw lyricism, sharp wordplay, and socially conscious storytelling. Their music reflects urban realities, youth struggles, and the evolution of desi hip-hop culture.",
    songPoster: "/music/img/raat ki rani.jpg",
    artistPoster: "/music/img/seedhe maut poster.jpg",
    url: "/music/audio/Raat Ki Rani - Seedhe Maut (pagalall.com).mp3",
    likes: 2890,
    duration: "2:45",
    album: "Nayaab / Singles",
  },
  {
    id: 2,
    songName: "Sad",
    artist: "XXXTENTACION",
    artistDescription:
      "XXXTENTACION was an American rapper and songwriter known for his emotionally intense music and genre-blending style. His work often explored themes of depression, heartbreak, inner conflict, and personal pain, which helped him build a deep emotional connection with a global youth audience.",
    songPoster: "/music/img/sad.jpg",
    artistPoster: "/music/img/tentaxion.jpg",
    url: "/music/audio/XXXTENTACION-SAD-(TopGhanaMusic.Com).mp3",
    likes: 3105,
    duration: "2:46",
    album: "? (Question Mark)",
  },
  {
    id: 3,
    songName: "On My Way",
    artist: "Alan Walker, Sabrina Carpenter",
    artistDescription:
      "Alan Walker is a Norwegian DJ, producer, and electronic music artist best known for his cinematic melodies and atmospheric sound. His music blends EDM with emotional storytelling, often featuring themes of journey, hope, and self-discovery, making his tracks popular worldwide.",
    songPoster: "/music/img/on my way.jpg",
    artistPoster: "/music/img/alan walker poster.jpg",
    url: "/music/audio/Alan_Walker_Sabrina_Carpenter_-_On_My_Way_(mp3.pm).mp3",
    likes: 1980,
    duration: "3:13",
    album: "World of Walker",
  },
  {
    id: 4,
    songName: "Perfect",
    artist: "Ed Sheeran",
    artistDescription:
      "Ed Sheeran is an English singer-songwriter famous for his heartfelt songwriting, acoustic guitar-driven sound, and romantic ballads. He has achieved massive global success by blending pop, folk, and soul influences, often writing songs inspired by personal experiences and relationships.",
    songPoster: "/music/img/perfect.jpg",
    artistPoster: "/music/img/ed sheeran poster.jpg",
    url: "/music/audio/Edd_Sheeran_-_Perfect_(mp3.pm).mp3",
    likes: 4210,
    duration: "4:23",
    album: "÷ (Divide)",
  },
  {
    id: 5,
    songName: "Die With A Smile",
    artist: "Bruno Mars, Lady Gaga",
    artistDescription:
      "Bruno Mars is an American singer, songwriter, and performer known for his energetic stage presence and versatile musical style. His music draws inspiration from funk, soul, R&B, and pop, and he is widely praised for his powerful vocals, retro influences, and chart-topping hits.",
    songPoster: "/music/img/die with smile.jpg",
    artistPoster: "/music/img/bruno mars.jpeg",
    url: "/music/audio/Die With A Smile-(SambalpuriStar.In).mp3",
    likes: 3560,
    duration: "4:11",
    album: "Single",
  },
];

const MusicWindow = ({
  windowName = "music",
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedSongs, setLikedSongs] = useState({});
  const [followedArtists, setFollowedArtists] = useState({});
  const [activeTab, setActiveTab] = useState("all-songs");

  const audioRef = useRef(null);

  const currentSong = MUSIC_PLAYLIST[currentIndex] || MUSIC_PLAYLIST[0];

  // Filtered playlist based on search query
  const filteredPlaylist = useMemo(() => {
    if (!searchQuery.trim()) return MUSIC_PLAYLIST;
    const q = searchQuery.toLowerCase();
    return MUSIC_PLAYLIST.filter(
      (s) =>
        s.songName.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.album && s.album.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Queue of upcoming songs
  const upNextQueue = useMemo(() => {
    return MUSIC_PLAYLIST.filter((_, idx) => idx !== currentIndex);
  }, [currentIndex]);

  // Audio source change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.warn("Audio autoplay blocked:", e));
      }
    }
  }, [currentIndex]);

  // Handle play / pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn("Audio play prevented:", e);
          setIsPlaying(false);
        });
    }
  };

  const playSongAtIndex = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = MUSIC_PLAYLIST[index].url;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn("Audio play error:", e));
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      let rand = Math.floor(Math.random() * MUSIC_PLAYLIST.length);
      if (rand === currentIndex) rand = (currentIndex + 1) % MUSIC_PLAYLIST.length;
      playSongAtIndex(rand);
    } else {
      playSongAtIndex((currentIndex + 1) % MUSIC_PLAYLIST.length);
    }
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    const prev = (currentIndex - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
    playSongAtIndex(prev);
  };

  // Audio event listeners
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
    }
  };

  const toggleLike = (songId) => {
    setLikedSongs((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const toggleFollow = (artistName) => {
    setFollowedArtists((prev) => ({
      ...prev,
      [artistName]: !prev[artistName],
    }));
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Vision Music"
      initialWidth={980}
      initialHeight={620}
      initialX={180}
      initialY={50}
    >
      <div className="flex h-full w-full flex-col bg-[#0e1014] text-white select-none overflow-hidden font-[-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* Hidden HTML5 Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Top Header / Search / Profile */}
        <header className="h-12 shrink-0 border-b border-white/[0.08] bg-[#14171d]/90 backdrop-blur-xl px-4 flex items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#fc677e] via-[#fa233b] to-[#c90724] shadow-sm shadow-red-500/30">
              <img
                src="/doc-icons/apple-music.svg"
                alt="Vision Music"
                className="h-4 w-4"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              Vision Music
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-red-500/20 text-[#ff5469] border border-red-500/30">
                Vision Audio
              </span>
            </span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-sm relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists, songs, albums..."
              className="w-full h-8 pl-8 pr-3 bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.12] rounded-full text-xs text-white placeholder-white/40 border border-white/10 outline-none transition"
            />
          </div>

          {/* Profile Badge */}
          <div className="flex items-center gap-2 pl-2">
            <img
              src="/music/img/profile.jpg"
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-tight text-white/90">
                Harshit Tiwari
              </p>
              <p className="text-[10px] text-white/40 leading-tight">Subscriber</p>
            </div>
          </div>
        </header>

        {/* Main Body (Left Sidebar + Mid Content + Right Sidebar) */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left macOS Music Sidebar */}
          <aside className="w-48 shrink-0 bg-[#121419]/95 border-r border-white/[0.08] p-3 flex flex-col gap-4 overflow-y-auto macos-scrollbar hidden md:flex">
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Vision Music
              </p>
              <nav className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("listen-now")}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeTab === "listen-now"
                      ? "bg-[#fa233b] text-white shadow-sm shadow-red-500/25"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Listen Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("browse")}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeTab === "browse"
                      ? "bg-[#fa233b] text-white shadow-sm shadow-red-500/25"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("radio")}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeTab === "radio"
                      ? "bg-[#fa233b] text-white shadow-sm shadow-red-500/25"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>Radio</span>
                </button>
              </nav>
            </div>

            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Library
              </p>
              <nav className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("all-songs")}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeTab === "all-songs"
                      ? "bg-white/[0.12] text-white font-semibold"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Music2 className="w-4 h-4 text-[#fa233b]" />
                  <span>All Songs ({MUSIC_PLAYLIST.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("artists")}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeTab === "artists"
                      ? "bg-white/[0.12] text-white font-semibold"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Artists</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("liked")}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeTab === "liked"
                      ? "bg-white/[0.12] text-white font-semibold"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Favorites</span>
                </button>
              </nav>
            </div>

            <div className="mt-auto p-2.5 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 text-[11px] text-white/60">
              <p className="font-semibold text-white/90">Vision Music</p>
              <p className="text-[10px] text-white/40 mt-0.5">
                Integrated directly into HarshitOS macOS environment.
              </p>
            </div>
          </aside>

          {/* Center Main Stage (Hero + Song List) */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#101217] overflow-y-auto macos-scrollbar">
            {/* Dynamic Artist Hero Banner */}
            <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden group">
              <img
                src={currentSong.artistPoster}
                alt={currentSong.artist}
                className="w-full h-full object-cover object-center filter brightness-65 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101217] via-[#101217]/60 to-transparent flex flex-col justify-end p-5 sm:p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5469]">
                  Now Featuring
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {currentSong.artist}
                </h1>
                <p className="text-xs text-white/70 max-w-lg line-clamp-2 mt-1">
                  {currentSong.artistDescription}
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#fa233b] to-[#e1142c] hover:brightness-110 text-white font-semibold text-xs transition shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>PLAY NOW</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFollow(currentSong.artist)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer ${
                      followedArtists[currentSong.artist]
                        ? "bg-white/20 border-white/40 text-white"
                        : "border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {followedArtists[currentSong.artist] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>FOLLOWING</span>
                      </>
                    ) : (
                      <span>+ FOLLOW</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Song List Section */}
            <div className="p-4 sm:p-6 flex-1">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08]">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>All Tracks</span>
                  <span className="text-xs font-normal text-white/40">
                    ({filteredPlaylist.length} songs)
                  </span>
                </h2>
                <span className="text-xs text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Duration</span>
                </span>
              </div>

              {/* Songs Table */}
              <div className="space-y-1">
                {filteredPlaylist.map((song, idx) => {
                  const isCurrent = song.id === currentSong.id;
                  const isLiked = !!likedSongs[song.id];

                  return (
                    <div
                      key={song.id}
                      onClick={() => playSongAtIndex(song.id)}
                      className={`group flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? "bg-gradient-to-r from-red-500/15 via-white/[0.06] to-transparent border-l-4 border-[#fa233b] text-white"
                          : "hover:bg-white/[0.06] text-white/80 hover:text-white"
                      }`}
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 shadow-md">
                          <img
                            src={song.songPoster}
                            alt={song.songName}
                            className="w-full h-full object-cover"
                          />
                          {isCurrent && isPlaying ? (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="flex items-end gap-0.5 h-3.5">
                                <span className="w-0.5 h-full bg-[#fa233b] animate-pulse" />
                                <span className="w-0.5 h-2/3 bg-[#fa233b] animate-bounce" />
                                <span className="w-0.5 h-4/5 bg-[#fa233b] animate-pulse" />
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-4 h-4 text-white fill-current" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isCurrent ? "text-[#ff5469]" : "text-white"
                            }`}
                          >
                            {song.songName}
                          </p>
                          <p className="text-xs text-white/50 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      {/* Album Column (hidden on mobile) */}
                      <div className="hidden lg:block w-48 text-xs text-white/40 truncate">
                        {song.album}
                      </div>

                      {/* Right: Likes & Duration */}
                      <div className="flex items-center gap-4 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song.id);
                          }}
                          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-rose-400 transition"
                        >
                          <Heart
                            className={`w-4 h-4 transition ${
                              isLiked
                                ? "text-rose-500 fill-rose-500"
                                : "text-white/40 group-hover:text-white/70"
                            }`}
                          />
                          <span className="tabular-nums">
                            {song.likes + (isLiked ? 1 : 0)}
                          </span>
                        </button>
                        <span className="text-xs text-white/40 font-mono w-10 text-right">
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Right macOS Music Inspector (Up Next & Artist Card) */}
          <aside className="w-64 shrink-0 bg-[#121419]/95 border-l border-white/[0.08] p-4 flex flex-col justify-between overflow-y-auto macos-scrollbar hidden xl:flex">
            {/* Up Next Section */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Up Next
                </h3>
                <span className="text-[10px] text-white/30">Queue</span>
              </div>
              <div className="space-y-2">
                {upNextQueue.slice(0, 4).map((song) => (
                  <div
                    key={song.id}
                    onClick={() => playSongAtIndex(song.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.06] transition cursor-pointer group"
                  >
                    <img
                      src={song.songPoster}
                      alt={song.songName}
                      className="w-9 h-9 rounded-md object-cover shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white/90 truncate group-hover:text-[#ff5469] transition">
                        {song.songName}
                      </p>
                      <p className="text-[10px] text-white/40 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Artist Info Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src={currentSong.artistPoster}
                  alt={currentSong.artist}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {currentSong.artist}
                  </h4>
                  <p className="text-[10px] text-[#ff5469] font-medium">
                    Verified Artist
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-white/60 line-clamp-3 leading-relaxed">
                {currentSong.artistDescription}
              </p>
            </div>
          </aside>
        </div>

        {/* Bottom Playbar (Apple Music Controller) */}
        <footer className="h-20 shrink-0 border-t border-white/[0.08] bg-[#161920] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
          {/* Left Track Info */}
          <div className="flex items-center gap-3 w-1/4 min-w-0">
            <img
              src={currentSong.songPoster}
              alt={currentSong.songName}
              className="w-12 h-12 rounded-lg object-cover shadow-md shrink-0 border border-white/10"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentSong.songName}
              </p>
              <p className="text-xs text-white/50 truncate">
                {currentSong.artist}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleLike(currentSong.id)}
              className="p-1 text-white/40 hover:text-rose-400 transition cursor-pointer ml-1"
            >
              <Heart
                className={`w-4 h-4 ${
                  likedSongs[currentSong.id]
                    ? "text-rose-500 fill-rose-500"
                    : "text-white/40"
                }`}
              />
            </button>
          </div>

          {/* Center Playback Controls & Timeline */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
            {/* Buttons */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setIsShuffle((s) => !s)}
                title="Shuffle"
                className={`p-1 transition cursor-pointer ${
                  isShuffle ? "text-[#fa233b]" : "text-white/40 hover:text-white"
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePrev}
                title="Previous"
                className="p-1 text-white/80 hover:text-white transition cursor-pointer active:scale-90"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                title={isPlaying ? "Pause" : "Play"}
                className="w-9 h-9 rounded-full bg-[#fa233b] hover:bg-red-500 text-white flex items-center justify-center transition shadow-md shadow-red-500/30 cursor-pointer active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                title="Next"
                className="p-1 text-white/80 hover:text-white transition cursor-pointer active:scale-90"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat((r) => !r)}
                title="Repeat"
                className={`p-1 transition cursor-pointer ${
                  isRepeat ? "text-[#fa233b]" : "text-white/40 hover:text-white"
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Time Scrubber */}
            <div className="w-full flex items-center gap-2 text-[11px] font-mono text-white/40">
              <span className="w-9 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#fa233b]"
              />
              <span className="w-9">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Volume & Tools */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 text-white/60 hover:text-white transition cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#fa233b]"
              />
            </div>
          </div>
        </footer>
      </div>
    </MacWindow>
  );
};

export default MusicWindow;