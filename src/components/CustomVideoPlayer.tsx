import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface CustomVideoPlayerProps {
  url: string
  title: string
  onClose: () => void
}

const CustomVideoPlayer = ({ url, title, onClose }: CustomVideoPlayerProps) => {
  const [playing, setPlaying] = useState(true)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = volume
    video.muted = muted
  }, [volume, muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    if (playing) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented:', err)
          setPlaying(false)
        })
      }
    } else {
      video.pause()
    }
  }, [playing])

  const handlePlayPause = () => setPlaying(!playing)
  const handleToggleMute = () => setMuted(!muted)

  const handleTimeUpdate = () => {
    if (videoRef.current && duration > 0) {
      setPlayed(videoRef.current.currentTime / duration)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value)
    setPlayed(newPlayed)
    if (videoRef.current) {
      videoRef.current.currentTime = newPlayed * duration
    }
  }

  const handleError = () => {
    setError('ВИДЕО ПОТЕРЯЛОСЬ, НО СКОРО ВЕРНЕТСЯ')
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current)
    }
  }, [playing])

  const handleFullscreen = () => {
    const playerElement = document.querySelector('.player-wrapper')
    if (!playerElement) return

    if (!document.fullscreenElement) {
      playerElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div 
      className="player-wrapper relative w-full h-full group bg-black flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        if (e.target === e.currentTarget) handlePlayPause()
      }}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onEnded={() => setPlaying(false)}
        onClick={handlePlayPause}
        playsInline
      />

      {/* Окно ошибки */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 sm:p-10 text-center overflow-y-auto"
          >
            <div className="text-[#E10600] mb-3 sm:mb-4 shrink-0">
              <RotateCcw size={40} className="sm:w-12 sm:h-12" />
            </div>
            <h4 className="font-bounded text-base sm:text-lg text-[#F5F7F6] mb-2 uppercase px-4">{error}</h4>
            <p className="font-bounded text-[9px] sm:text-[10px] text-[#F5F7F6]/40 uppercase tracking-widest mb-6 sm:mb-8 shrink-0">
              Ошибка: {url.split('/').pop()?.replace('.mp4', '') || 'Неизвестное видео'}
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3 sm:px-6 sm:py-2 border border-[#F5F7F6]/20 rounded-full font-bounded text-[10px] uppercase tracking-widest text-[#F5F7F6] hover:bg-[#F5F7F6] hover:text-black transition-all active:scale-95 shrink-0 mb-4 sm:mb-0"
            >
              Закрыть
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Эффект шума (зернистость) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Элементы управления */}
      <AnimatePresence>
        {showControls && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"
          >
            {/* Верхняя панель */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex flex-col">
                <span className="font-bounded text-[10px] uppercase tracking-[0.3em] text-[#E10600] mb-1">
                  СЕЙЧАС ИГРАЕТ
                </span>
                <h3 className="font-bounded text-lg sm:text-2xl uppercase text-[#F5F7F6] tracking-tight">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#F5F7F6]/5 border border-[#F5F7F6]/10 text-[#F5F7F6] hover:bg-[#E10600] transition-all hover:scale-110 active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Нижняя панель управления */}
            <div className="flex flex-col gap-4 pointer-events-auto">
              {/* Полоса прогресса */}
              <div className="relative w-full h-1 group/progress cursor-pointer">
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="absolute inset-0 bg-[#F5F7F6]/20 rounded-full" />
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#E10600] rounded-full"
                  style={{ width: `${played * 100}%` }}
                />
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-[#F5F7F6] rounded-full shadow-[0_0_10px_rgba(235,0,0,0.8)] opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `${played * 100}%`, marginLeft: '-6px' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-6">
                  <button onClick={handlePlayPause} className="text-[#F5F7F6] hover:text-[#E10600] transition-colors">
                    {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>
                  
                  <div className="flex items-center gap-3 group/volume">
                    <button onClick={handleToggleMute} className="text-[#F5F7F6] hover:text-[#E10600] transition-colors">
                      {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="any"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 accent-[#E10600] h-1 cursor-pointer pointer-events-none group-hover/volume:pointer-events-auto"
                    />
                  </div>

                  <div className="font-bounded text-[10px] sm:text-xs text-[#F5F7F6]/60 tracking-widest uppercase">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handleFullscreen} className="text-[#F5F7F6] hover:text-[#E10600] transition-colors">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Значок Play в центре при паузе */}
      <AnimatePresence>
        {!playing && !showControls && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="w-20 h-20 rounded-full bg-[#E10600]/20 border border-[#E10600]/40 backdrop-blur-md flex items-center justify-center text-[#F5F7F6]">
              <Play size={32} fill="currentColor" className="ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomVideoPlayer
