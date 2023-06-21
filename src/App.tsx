import React, { useState, useRef, useEffect, useCallback } from "react";
import MediaPlayer from "./components/MediaPlayer";
import ActionBar from "./components/ActionBar";
import "./styles/app.css";
import MediaControls from "./util/MediaControls";
import { Track } from "./util/Track";

const getItem = (key: string, def: any) => {
  return localStorage.getItem(key) !== null ? localStorage.getItem(key)! : def;
};

type TrackCache = Map<string, Track[]>;

function App() {
  const mediaControls = useRef<MediaControls | null>(null);
  if (!mediaControls.current) {
    mediaControls.current = new MediaControls();
  }

  //? init states
  const [ambienceVolume, setAmbienceVolume] = useState(0);
  const [rainVolume, setRainVolume] = useState(0);
  const [thunderVolume, setThunderVolume] = useState(0);
  const [trafficVolume, setTrafficVolume] = useState(0);
  const [musicVolume, setMusicVolume] = useState(80);
  const [mood, setMood] = useState("Shuffle");
  const [scene, setScene] = useState("room.jpg");
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isScenesOpen, setIsScenesOpen] = useState(false);
  const [isMoodMenuOpen, setIsMoodMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const cachedTracks = useRef<TrackCache>(new Map());

  //? useEffects
  // fetch from local storage any existing values
  useEffect(() => {
    setAmbienceVolume(Number(getItem("forestVolume", 0)));
    setRainVolume(Number(getItem("rainyVolume", 0)));
    setThunderVolume(Number(getItem("boltVolume", 0)));
    setTrafficVolume(Number(getItem("trainVolume", 0)));
    setMusicVolume(Number(getItem("music_noteVolume", 80)));
    const storedMood = getItem("mood", "Shuffle");
    setMood(storedMood);
    setScene(getItem("scene", "room.jpg"));

    mediaControls.current?.changePlaylist(storedMood);
  }, []); // ensure data is only fetched locally once

  //? functions
  // enables fullscreen or exits fullscreen if already in
  function fullscreenClick(event: React.MouseEvent<HTMLElement>) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // closes menus on clicking outside
  const closeMenus = useCallback(() => {
    if (isMixerOpen || isScenesOpen || isMoodMenuOpen) {
      setIsMixerOpen(false);
      setIsScenesOpen(false);
      setIsMoodMenuOpen(false);
    } else {
      setIsMenuOpen(false);
    }
  }, [isMixerOpen, isScenesOpen, isMoodMenuOpen]);

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(/images/${scene})` }}
      onClick={closeMenus}
      onDoubleClick={fullscreenClick}
    >
      <div>
        <ActionBar
          mediaControls={mediaControls.current}
          ambienceVolume={ambienceVolume}
          rainVolume={rainVolume}
          thunderVolume={thunderVolume}
          trafficVolume={trafficVolume}
          musicVolume={musicVolume}
          mood={mood}
          scene={scene}
          isMuted={isMuted}
          isMenuOpen={isMenuOpen}
          isMoodMenuOpen={isMoodMenuOpen}
          isScenesOpen={isScenesOpen}
          isMixerOpen={isMixerOpen}
          setIsMenuOpen={setIsMenuOpen}
          setIsMixerOpen={setIsMixerOpen}
          setIsScenesOpen={setIsScenesOpen}
          setIsMoodMenuOpen={setIsMoodMenuOpen}
          setAmbienceVolume={setAmbienceVolume}
          setRainVolume={setRainVolume}
          setThunderVolume={setThunderVolume}
          setTrafficVolume={setTrafficVolume}
          setMusicVolume={setMusicVolume}
          setScene={setScene}
          setMood={setMood}
          setIsPlaying={setIsPlaying}
        ></ActionBar>
        <i className="material-icons fullscreen-icon" onClick={fullscreenClick}>
          fullscreen
        </i>
      </div>

      <MediaPlayer
        musicVolume={musicVolume}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isMuted={isMuted}
        mediaControls={mediaControls.current}
        setIsMuted={setIsMuted}
      ></MediaPlayer>
      <div className="logo">Lofi Loft</div>
    </div>
  );
}

export default App;
