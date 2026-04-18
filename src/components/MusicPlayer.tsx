import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'Cyber Drift',
    artist: 'AI Engine #402',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Silicon Dreams',
    artist: 'Neural Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Midnight Protocol',
    artist: 'Synth Engine v4',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name === 'NotAllowedError') {
            setIsPlaying(false);
          } else if (error.name !== 'AbortError') {
            console.error("Audio playback error:", error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="contents">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <section className="col-start-1 row-start-1 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[16px] p-[20px] flex flex-col relative overflow-hidden">
        <div className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-text-dim)] mb-[15px]">Now Playing</div>
        <div className="w-full aspect-square bg-[linear-gradient(45deg,#111,#222)] rounded-[12px] mb-[20px] flex items-center justify-center border border-[#222]">
          <div className="w-[80px] h-[80px] border-[4px] border-[var(--color-neon-cyan)] rounded-full flex items-center justify-center">
            <div className="w-[20px] h-[20px] bg-[var(--color-neon-cyan)] rounded-full"></div>
          </div>
        </div>
        <div className="mb-1">
          <h3 className="text-[1.1rem] font-bold mb-[4px]">{currentTrack.title}</h3>
          <p className="text-[0.85rem] text-[var(--color-text-dim)]">{currentTrack.artist}</p>
        </div>
        <div className="mt-auto">
          <div className="h-[4px] bg-[#222] rounded-[2px] w-full my-[15px] relative cursor-pointer" onClick={(e) => {
            if (!audioRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const newPercent = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = newPercent * audioRef.current.duration;
            setProgress(newPercent * 100);
          }}>
            <div className="h-full bg-[var(--color-neon-cyan)] rounded-[2px] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-[10px]">
            <button onClick={handlePrev} className="bg-transparent border-none text-white cursor-pointer text-[14px]">PREV</button>
            <button onClick={togglePlay} className="bg-transparent border-none text-[var(--color-neon-cyan)] cursor-pointer text-[24px] font-bold uppercase">{isPlaying ? "PAUSE" : "PLAY"}</button>
            <button onClick={handleNext} className="bg-transparent border-none text-white cursor-pointer text-[14px]">NEXT</button>
          </div>
        </div>
      </section>

      <section className="col-start-3 row-start-1 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[16px] p-[20px] flex flex-col relative overflow-hidden">
        <div className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-text-dim)] mb-[15px]">Tracklist</div>
        <div className="overflow-y-auto flex-1">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id} 
              onClick={() => { setCurrentTrackIndex(idx); setProgress(0); setIsPlaying(true); }} 
              className={`flex items-center gap-[12px] p-[10px] rounded-[8px] mb-[8px] cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-[#1a1a1a] border-l-[3px] border-[var(--color-neon-cyan)]' : 'hover:bg-[#111]'}`}
            >
              <span className="text-[0.7rem] text-[var(--color-text-dim)]">{(idx + 1).toString().padStart(2, '0')}</span>
              <span className="text-[0.85rem]">{track.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
