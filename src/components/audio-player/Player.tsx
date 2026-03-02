import { useState, useRef, useEffect, type HTMLProps } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PlayerControls } from './Controls'
// import { Playlist } from './Playlist'
import { VolumeControl } from './VolumeControl'

export interface Track {
  id: string
  title: string
  artist?: string
  album?: string
  duration?: number
  cover?: string
  audioUrl?: string
}

interface PlaylistProps extends HTMLProps<HTMLDivElement> {
  tracks: Track[]
}

export function AudioPlayer({ tracks }: PlaylistProps) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  // const [showPlaylist, setShowPlaylist] = useState(false)
  // const [isLiked, setIsLiked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const track = tracks[currentTrack]
  const duration = track.duration

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = async () => {
    const el = audioRef.current
    if (!el) return

    console.log('[audio] togglePlay', {
      isPlaying,
      src: el.currentSrc || el.src,
      readyState: el.readyState,
      networkState: el.networkState,
    })

    try {
      if (isPlaying) {
        el.pause()
        setIsPlaying(false)
        return
      }

      // ensure we have a source
      if (!el.currentSrc && !el.src) {
        console.log('[audio] NO SRC on audio element')
        return
      }

      await el.play() // <-- if this fails, you'll see why
      setIsPlaying(true)
    } catch (e) {
      console.log('[audio] play() rejected:', e)
    }
  }

  const handleNext = () => {
    if (shuffle) {
      const nextTrack = Math.floor(Math.random() * tracks.length)
      setCurrentTrack(nextTrack)
    } else {
      setCurrentTrack((prev) => (prev + 1) % tracks.length)
    }
    setCurrentTime(0)
  }

  const handlePrevious = () => {
    if (currentTime > 5) {
      setCurrentTime(0)
    } else {
      setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
      setCurrentTime(0)
    }
  }

  const handleSeek = (value: number) => {
    const el = audioRef.current
    if (!el) return
    el.currentTime = value
    setCurrentTime(value)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // const handleTrackSelect = (index: number) => {
  //   setCurrentTrack(index)
  //   setCurrentTime(0)
  //   setIsPlaying(true)
  // }

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    console.log('[audio] track changed -> load()', track.audioUrl)
    el.pause()
    el.currentTime = 0
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0)

    el.load() // <-- key
    if (isPlaying) {
      el.play().catch((e) =>
        console.log('[audio] play rejected after track change', e)
      )
    }
  }, [track.audioUrl])

  return (
    <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4'>
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload='metadata'
        crossOrigin='anonymous'
        onPlay={() => console.log('[audio] play event')}
        onPause={() => console.log('[audio] pause event')}
        onLoadedMetadata={() => {
          const el = audioRef.current
          console.log('[audio] loadedmetadata', {
            duration: el?.duration,
            readyState: el?.readyState,
            src: el?.currentSrc,
          })
        }}
        onCanPlay={() => console.log('[audio] canplay')}
        onTimeUpdate={() => {
          const el = audioRef.current
          if (!el) return
          setCurrentTime(el.currentTime)
        }}
        onEnded={() => {
          console.log('[audio] ended')
          handleNext()
        }}
        onError={() => {
          const el = audioRef.current
          // IMPORTANT: this tells you the real reason
          console.log('[audio] ERROR', {
            code: el?.error?.code,
            message: el?.error?.message,
            src: el?.currentSrc,
            networkState: el?.networkState,
            readyState: el?.readyState,
          })
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='h-full w-full max-w-md'
      >
        {/* Main Player Card */}
        <div className='h-full w-full rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl'>
          {/* Album Art */}
          <motion.div
            key={currentTrack}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className='group relative mb-8'
          >
            <div className='aspect-square overflow-hidden rounded-2xl shadow-2xl'>
              <motion.img
                src={track.cover}
                alt={track.title}
                className='h-full w-full object-cover'
                animate={{
                  scale: isPlaying ? 1.05 : 1,
                }}
                transition={{
                  duration: 0.3,
                }}
              />
            </div>

            {/* Animated vinyl effect when playing */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 rounded-2xl'
                >
                  <motion.div
                    className='absolute inset-0 rounded-2xl'
                    style={{
                      background:
                        'radial-gradient(circle, transparent 30%, rgba(147, 51, 234, 0.2) 100%)',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Track Info */}
          <motion.div
            key={`info-${currentTrack}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='mb-6'
          >
            <div className='mb-2 flex items-start justify-between'>
              <div className='min-w-0 flex-1'>
                <h2 className='mb-1 truncate text-2xl font-semibold text-white'>
                  {track.title}
                </h2>
                {/*<p className="text-purple-200 truncate">{track.artist}</p>*/}
                {/*<p className="text-purple-300/60 text-sm truncate">{track.album}</p>*/}
              </div>
              {/*<motion.button*/}
              {/*  whileHover={{ scale: 1.1 }}*/}
              {/*  whileTap={{ scale: 0.9 }}*/}
              {/*  onClick={() => setIsLiked(!isLiked)}*/}
              {/*  className="ml-4 flex-shrink-0"*/}
              {/*>*/}
              {/*  <Heart*/}
              {/*    className={`w-6 h-6 ${*/}
              {/*      isLiked ? 'fill-pink-500 text-pink-500' : 'text-purple-200'*/}
              {/*    } transition-colors`}*/}
              {/*  />*/}
              {/*</motion.button>*/}
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className='mb-6'>
            <div className='relative mb-2 h-2 overflow-hidden rounded-full bg-white/10'>
              <motion.div
                className='absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500'
                style={{
                  width: `${(currentTime / (duration ?? 1)) * 100}%`,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentTime / (duration ?? 1)) * 100}%`,
                }}
              />
              <input
                type='range'
                min='0'
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
              />
            </div>
            <div className='flex justify-between text-sm text-purple-200'>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration ?? 1)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onNext={handleNext}
            onPrevious={handlePrevious}
            shuffle={shuffle}
            onShuffleToggle={() => setShuffle(!shuffle)}
            repeat={repeat}
            onRepeatToggle={() => setRepeat(!repeat)}
          />

          {/* Bottom Controls */}
          <div className='mt-6 flex items-center justify-between border-t border-white/10 pt-6'>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setVolume}
              onMuteToggle={() => setIsMuted(!isMuted)}
            />

            {/*<motion.button*/}
            {/*  whileHover={{ scale: 1.05 }}*/}
            {/*  whileTap={{ scale: 0.95 }}*/}
            {/*  onClick={() => setShowPlaylist(!showPlaylist)}*/}
            {/*  className={`p-2 rounded-full transition-colors ${*/}
            {/*    showPlaylist*/}
            {/*      ? 'bg-purple-500 text-white'*/}
            {/*      : 'bg-white/10 text-purple-200 hover:bg-white/20'*/}
            {/*  }`}*/}
            {/*>*/}
            {/*  <List className="w-5 h-5" />*/}
            {/*</motion.button>*/}
          </div>
        </div>

        {/* Playlist */}
        {/*<AnimatePresence>*/}
        {/*  {showPlaylist && (*/}
        {/*    <Playlist*/}
        {/*      tracks={tracks}*/}
        {/*      currentTrack={currentTrack}*/}
        {/*      onTrackSelect={handleTrackSelect}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</AnimatePresence>*/}
      </motion.div>
    </div>
  )
}
