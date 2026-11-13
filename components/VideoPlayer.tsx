import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { Play, Pause, Loader2, AlertCircle } from 'lucide-react';

interface ActiveVideoEntry {
  shouldPlay: () => boolean;
  wantsUnmute: () => boolean;
}

// Global tracking for user interactions to unlock audio only for actively playing unmuted videos
let globalUserHasInteracted = false;
const activeVideoEntries = new Map<HTMLVideoElement, ActiveVideoEntry>();

if (typeof window !== 'undefined') {
  const triggerGlobalUnmute = () => {
    if (globalUserHasInteracted) return;
    globalUserHasInteracted = true;

    activeVideoEntries.forEach((entry, video) => {
      try {
        if (!entry.shouldPlay()) return;
        if (entry.wantsUnmute()) {
          video.muted = false;
          if (video.paused) {
            video.play().catch(() => {});
          }
        }
      } catch {
        // Ignore browser media errors
      }
    });
  };

  window.addEventListener('click', triggerGlobalUnmute, { capture: true, passive: true });
  window.addEventListener('pointerdown', triggerGlobalUnmute, { capture: true, passive: true });
  window.addEventListener('touchstart', triggerGlobalUnmute, { capture: true, passive: true });
  window.addEventListener('keydown', triggerGlobalUnmute, { capture: true, passive: true });
  window.addEventListener('mousedown', triggerGlobalUnmute, { capture: true, passive: true });
}

function stopAndUnloadVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  activeVideoEntries.delete(video);
  try {
    video.pause();
    video.muted = true;
  } catch {
    // Ignore pause errors during unmount
  }
  // Defer src removal to a microtask so React StrictMode simulated remounts keep src,
  // while real DOM unmounts (!video.isConnected) release the media pipeline immediately.
  queueMicrotask(() => {
    if (!video.isConnected) {
      try {
        video.pause();
        video.muted = true;
        video.removeAttribute('src');
        video.load();
      } catch {
        // Ignore cleanup errors
      }
    }
  });
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  playing?: boolean;
  loop?: boolean;
  muted?: boolean;
  onLoadedData?: () => void;
  preload?: 'none' | 'metadata' | 'auto';
  controls?: boolean;
  disableIntersectionObserver?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onMuteChange?: (muted: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(({ 
  src, 
  poster,
  className = '', 
  autoPlay = false, 
  playing,
  loop = false, 
  muted = false, 
  onLoadedData,
  preload = 'auto',
  controls = false,
  disableIntersectionObserver = false,
  onPlayingChange,
  onMuteChange
}) => {
  const [isPlaying, setIsPlaying] = useState(playing !== undefined ? playing : autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume] = useState(1);
  const mutedPropRef = useRef(muted);
  
  useEffect(() => {
    mutedPropRef.current = muted;
    setIsMuted(muted);
  }, [muted]);

  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [duration, setDuration] = useState(0);
  const [, setCurrentTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const playRequestIdRef = useRef(0);
  const prevSrcRef = useRef(src);
  const isPlayingRef = useRef(isPlaying);
  const isMutedRef = useRef(isMuted);

  isPlayingRef.current = isPlaying;
  isMutedRef.current = isMuted;

  const pauseVideoSafely = useCallback((video: HTMLVideoElement | null) => {
    playRequestIdRef.current += 1;
    if (!video) return;
    try {
      video.pause();
    } catch {
      // Ignore pause errors
    }
    if (playPromiseRef.current) {
      const pending = playPromiseRef.current;
      pending
        .then(() => {
          if (!isMounted.current || !isPlayingRef.current) {
            try {
              video.pause();
            } catch {
              // Ignore
            }
          }
        })
        .catch(() => {
          try {
            video.pause();
          } catch {
            // Ignore
          }
        });
    }
  }, []);

  const attemptPlaySafely = useCallback((video: HTMLVideoElement | null) => {
    if (!video || !isMounted.current || !isPlayingRef.current) return;

    video.muted = isMutedRef.current;
    video.volume = volume;

    if (!video.paused) return;

    const reqId = ++playRequestIdRef.current;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromiseRef.current = playPromise;
      playPromise
        .then(() => {
          if (playPromiseRef.current === playPromise) {
            playPromiseRef.current = null;
          }
          if (!isMounted.current || !isPlayingRef.current || reqId !== playRequestIdRef.current) {
            try {
              video.pause();
            } catch {
              // Ignore
            }
          }
        })
        .catch((error) => {
          if (playPromiseRef.current === playPromise) {
            playPromiseRef.current = null;
          }
          if (!isMounted.current || !isPlayingRef.current || reqId !== playRequestIdRef.current) {
            try {
              video.pause();
            } catch {
              // Ignore
            }
            return;
          }
          if (error?.name === 'AbortError') {
            return;
          }
          if (error?.name === 'NotAllowedError') {
            setIsMuted(true);
            isMutedRef.current = true;
            video.muted = true;
            const retryPromise = video.play();
            if (retryPromise !== undefined) {
              playPromiseRef.current = retryPromise;
              retryPromise
                .then(() => {
                  if (playPromiseRef.current === retryPromise) {
                    playPromiseRef.current = null;
                  }
                  if (!isMounted.current || !isPlayingRef.current || reqId !== playRequestIdRef.current) {
                    video.pause();
                  }
                })
                .catch(() => {
                  if (playPromiseRef.current === retryPromise) {
                    playPromiseRef.current = null;
                  }
                  if (isMounted.current) {
                    setIsPlaying(false);
                  }
                });
            }
          }
        });
    }
  }, [volume]);

  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.volume = volume;

    if (isPlaying) {
      attemptPlaySafely(video);
    } else {
      pauseVideoSafely(video);
    }
  }, [isPlaying, isMuted, src, volume, attemptPlaySafely, pauseVideoSafely]);

  // Register active video element and guarantee synchronous stop & unload on unmount (React 19 + StrictMode safe)
  useLayoutEffect(() => {
    isMounted.current = true;
    isPlayingRef.current = playing !== undefined ? playing : autoPlay;
    const video = playerRef.current;
    if (video) {
      if (src && !video.getAttribute('src')) {
        video.setAttribute('src', src);
      }
      activeVideoEntries.set(video, {
        shouldPlay: () => isMounted.current && isPlayingRef.current,
        wantsUnmute: () => !mutedPropRef.current,
      });
    }

    return () => {
      isMounted.current = false;
      isPlayingRef.current = false;
      playRequestIdRef.current += 1;
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      stopAndUnloadVideo(video);
    };
  }, []);

  // --- INTERSECTION OBSERVER (Performance) ---
  useEffect(() => {
    if (disableIntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlayingRef.current) {
            setIsPlaying(false);
          } else if (entry.isIntersecting && autoPlay && !isPlayingRef.current) {
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay, disableIntersectionObserver]);

  // Sync autoPlay and playing prop changes directly to isPlaying state
  useEffect(() => {
    const targetPlaying = playing !== undefined ? playing : autoPlay;
    isPlayingRef.current = targetPlaying;
    setIsPlaying(targetPlaying);
    const video = playerRef.current;
    if (!targetPlaying && video) {
      pauseVideoSafely(video);
    }
  }, [autoPlay, playing, src, pauseVideoSafely]);

  // Reset & reload only when src changes after mount
  useEffect(() => {
    if (prevSrcRef.current === src) return;
    prevSrcRef.current = src;
    setHasError(false);
    setHasStarted(false);
    setProgress(0);
    setCurrentTime(0);
    const video = playerRef.current;
    if (video) {
      video.load();
      if (isPlayingRef.current) {
        attemptPlaySafely(video);
      } else {
        pauseVideoSafely(video);
      }
    }
  }, [src, attemptPlaySafely, pauseVideoSafely]);

  // --- HANDLERS ---
  const togglePlay = useCallback((e?: React.MouseEvent | React.PointerEvent) => {
    e?.stopPropagation();
    const nextPlaying = !isPlayingRef.current;
    isPlayingRef.current = nextPlaying;
    setIsPlaying(nextPlaying);
    if (onPlayingChange) {
      onPlayingChange(nextPlaying);
    }
    if (controls) showControlsTemporarily();
  }, [controls, onPlayingChange]);

  const toggleMute = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (onMuteChange) {
      onMuteChange(nextMuted);
    }
    if (controls) showControlsTemporarily();
  }, [isMuted, controls, onMuteChange]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isMounted.current) return;
    const current = e.currentTarget.currentTime;
    setCurrentTime(current);
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
    setIsBuffering(false);
    if (current > 0) setHasStarted(true);
  };

  const handleDurationChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isMounted.current) return;
    const dur = e.currentTarget.duration;
    setDuration(dur);
    if (onLoadedData) onLoadedData();
    setIsBuffering(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const time = (val / 100) * duration;
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
    setProgress(val);
    setCurrentTime(time);
  };

  const showControlsTemporarily = () => {
    if (!controls) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 2000);
  };

  const handleMouseMove = () => {
    if (controls) showControlsTemporarily();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group bg-black overflow-hidden select-none ${className}`}
      onMouseMove={handleMouseMove}
      onClick={playing !== undefined ? undefined : togglePlay}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={playerRef}
        src={src}
        preload={preload}
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        loop={loop}
        crossOrigin="anonymous"
        className={`w-full h-full ${className.includes('object-cover') ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onLoadedMetadata={() => {
          if (!isMounted.current) return;
          if (isPlayingRef.current && playerRef.current) {
            attemptPlaySafely(playerRef.current);
          } else if (playerRef.current) {
            pauseVideoSafely(playerRef.current);
          }
        }}
        onWaiting={() => {
          if (isMounted.current) setIsBuffering(true);
        }}
        onError={() => {
          if (!isMounted.current) return;
          setIsBuffering(false);
          setHasError(true);
        }}
        onPlaying={() => { 
          if (!isMounted.current) return;
          if (!isPlayingRef.current && playerRef.current) {
            pauseVideoSafely(playerRef.current);
            return;
          }
          setIsBuffering(false); 
          setHasStarted(true); 
        }}
        onPlay={() => {
          if (!isMounted.current) return;
          if (!isPlayingRef.current && playerRef.current) {
            pauseVideoSafely(playerRef.current);
            return;
          }
          setHasStarted(true);
          setIsBuffering(false);
        }}
        onEnded={() => {
          if (!isMounted.current || !playerRef.current) return;
          playerRef.current.currentTime = 0;
          if (loop && isPlayingRef.current) {
            attemptPlaySafely(playerRef.current);
          } else {
            setIsPlaying(false);
          }
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900 text-white p-4 text-center">
           {poster ? (
             <img src={poster} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
           ) : (
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 border border-white/10">
               <AlertCircle size={24} className="text-zinc-500" />
             </div>
           )}
           <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preview Unavailable</span>
        </div>
      )}
      
      {poster && !hasStarted && !hasError && (
        <img 
          src={poster} 
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" 
          alt="" 
        />
      )}

      {isBuffering && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 backdrop-blur-[1px] pointer-events-none transition-all duration-300">
           <div className="relative">
               <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full scale-150 animate-pulse"></div>
               <Loader2 className="w-10 h-10 text-brand-primary animate-spin relative z-10 drop-shadow-[0_0_15px_rgba(255,208,0,0.6)]" />
           </div>
        </div>
      )}

      {/* Always-on TikTok Style thin top progress bar */}
      {controls && (
        <div 
          className={`absolute top-0 left-0 right-0 h-[3px] bg-white/20 transition-all duration-300 z-10 pointer-events-none ${
            showControls ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'
          }`}
        >
          <div 
            className="h-full bg-brand-primary transition-all duration-75" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {controls && (
        <div 
            className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/40 to-transparent pt-14 pb-12 px-4 transition-all duration-300 flex items-center gap-3 z-20 pointer-events-auto ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
            }}
        >
            <button 
                onClick={togglePlay} 
                onPointerDown={(e) => e.stopPropagation()}
                className="w-8 h-8 flex items-center justify-center text-white hover:text-brand-primary transition-colors bg-white/10 rounded-full hover:bg-white/20 shadow-sm shrink-0"
            >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Custom TikTok Style Scrubbable Seek Bar */}
            <div className="relative flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer group/seek flex items-center">
                <div 
                    className="absolute top-0 left-0 h-full bg-brand-primary rounded-full transition-all duration-75" 
                    style={{ width: `${progress}%` }}
                />
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    value={progress} 
                    onChange={handleSeek}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/seek:scale-100 transition-transform pointer-events-none"
                    style={{ left: `calc(${progress}% - 6px)` }}
                />
            </div>
        </div>
      )}
    </div>
  );
});
