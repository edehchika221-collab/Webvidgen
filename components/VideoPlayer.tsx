import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Maximize2, Minimize2, Volume2, VolumeX, Music } from 'lucide-react';

interface VideoPlayerProps {
  src: string | null;
  audioSrc?: string | null;
  poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, audioSrc, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousVolumeRef = useRef<number>(1);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Determine if we are in "Voiceover Mode"
  const hasAudio = !!audioSrc;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if(videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
    }
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
    }
  }, [src, audioSrc]);

  // Sync Logic
  useEffect(() => {
    const vid = videoRef.current;
    const aud = audioRef.current;
    
    // If we have audio, the audio drives the timeline/progress.
    // The video just loops.
    
    const updateTime = () => {
      if (isDragging) return;

      if (hasAudio && aud) {
         // Master: Audio
         const cur = aud.currentTime;
         const dur = aud.duration || 0;
         setCurrentTime(cur);
         setDuration(dur);
         setProgress(dur > 0 ? (cur / dur) * 100 : 0);
      } else if (vid) {
         // Master: Video
         const cur = vid.currentTime;
         const dur = vid.duration || 0;
         setCurrentTime(cur);
         setDuration(dur);
         setProgress(dur > 0 ? (cur / dur) * 100 : 0);
      }
    };

    const handleEnd = () => {
       setIsPlaying(false);
       if (vid) vid.pause();
       if (aud) {
           aud.pause();
           aud.currentTime = 0;
       }
    };

    // Attach listeners
    if (hasAudio && aud) {
        aud.addEventListener('timeupdate', updateTime);
        aud.addEventListener('ended', handleEnd);
        // Ensure video loops while audio plays
        if (vid) vid.loop = true;
    } else if (vid) {
        vid.addEventListener('timeupdate', updateTime);
        vid.addEventListener('ended', handleEnd);
        vid.loop = true; // Default to loop for short clips
    }

    return () => {
        if (aud) {
            aud.removeEventListener('timeupdate', updateTime);
            aud.removeEventListener('ended', handleEnd);
        }
        if (vid) {
            vid.removeEventListener('timeupdate', updateTime);
            vid.removeEventListener('ended', handleEnd);
        }
    };
  }, [hasAudio, audioSrc, src, isDragging]);


  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    const vid = videoRef.current;
    const aud = audioRef.current;

    if (isPlaying) {
      if (vid) vid.pause();
      if (aud) aud.pause();
    } else {
      if (vid) vid.play().catch(e => console.error("Video play error", e));
      if (aud) aud.play().catch(e => console.error("Audio play error", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const vid = videoRef.current;
    const aud = audioRef.current;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const clickedRatio = x / rect.width;

    // Use duration from the master source
    const targetDuration = (hasAudio && aud) ? (aud.duration || 0) : (vid?.duration || 0);

    if (isFinite(targetDuration)) {
      const newTime = clickedRatio * targetDuration;
      
      if (hasAudio && aud) {
          aud.currentTime = newTime;
          // Sync video roughly just in case, though it loops
          if (vid) vid.currentTime = newTime % (vid.duration || 1);
      } else if (vid) {
          vid.currentTime = newTime;
      }
      
      setProgress(clickedRatio * 100);
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      const vol = previousVolumeRef.current || 1;
      setVolume(vol);
      setIsMuted(false);
      
      if (audioRef.current) {
        audioRef.current.volume = vol;
        audioRef.current.muted = false;
      }
      if (videoRef.current) {
        videoRef.current.volume = vol;
        videoRef.current.muted = false;
      }
    } else {
      // Mute: save current volume
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
      
      if (audioRef.current) audioRef.current.muted = true;
      if (videoRef.current) videoRef.current.muted = true;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    
    // Auto unmute if sliding up
    if (newVol > 0 && isMuted) {
        setIsMuted(false);
        if (audioRef.current) audioRef.current.muted = false;
        if (videoRef.current) videoRef.current.muted = false;
    } else if (newVol === 0 && !isMuted) {
        setIsMuted(true);
        if (audioRef.current) audioRef.current.muted = true;
        if (videoRef.current) videoRef.current.muted = true;
    }

    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (videoRef.current) {
        videoRef.current.volume = newVol;
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (src) {
      const a = document.createElement('a');
      a.href = src;
      a.download = `webvidgen-preview-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (!src) return null;

  return (
    <div 
      ref={containerRef}
      className="relative group w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black aspect-video border border-slate-700 flex flex-col justify-center"
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain bg-black"
        playsInline
        // Events are handled by useEffect manually
      />
      
      {/* Hidden Audio Element for Voiceover */}
      {audioSrc && (
          <audio ref={audioRef} src={audioSrc} />
      )}
      
      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        
        {/* Progress Bar Area */}
        <div 
          className="relative w-full h-4 mb-4 cursor-pointer flex items-center group/progress"
          onClick={handleSeek}
        >
          {/* Background Track */}
          <div className="w-full h-1.5 bg-gray-600/50 rounded-full overflow-hidden transition-all group-hover/progress:h-2.5">
            {/* Filled Progress */}
            <div 
              className="h-full bg-indigo-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Handle/Thumb */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${progress}%`, marginLeft: '-7px' }} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-indigo-400 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                aria-label="Volume"
              />
            </div>

            <span className="text-xs text-slate-300 font-medium font-mono select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {audioSrc && (
                <div className="flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-900/50 px-2 py-1 rounded border border-indigo-500/30">
                    <Music size={10} />
                    <span>Voiceover Active</span>
                </div>
            )}

            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-lg"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
            
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Big Play Button Overlay (when paused) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/20 transition-colors"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 shadow-xl">
            <Play size={32} className="text-white fill-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};
