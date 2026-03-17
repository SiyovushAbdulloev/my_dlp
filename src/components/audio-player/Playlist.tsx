import { Play } from 'lucide-react'
import { motion } from 'motion/react'
import type { Track } from './Player'

interface PlaylistProps {
  tracks: Track[]
  currentTrack: number
  onTrackSelect: (index: number) => void
}

export function Playlist({
  tracks,
  currentTrack,
  onTrackSelect,
}: PlaylistProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className='mt-4 max-h-[400px] overflow-y-auto rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl'
    >
      <h3 className='mb-4 text-lg font-semibold text-white'>Playlist</h3>
      <div className='space-y-2'>
        {tracks.map((track, index) => (
          <motion.button
            key={track.id}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTrackSelect(index)}
            className={`flex w-full items-center gap-4 rounded-xl p-3 transition-all ${
              index === currentTrack
                ? 'border border-purple-400/50 bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className='relative flex-shrink-0'>
              <img
                src={track.cover}
                alt={track.title}
                className='h-12 w-12 rounded-lg object-cover'
              />
              {index === currentTrack && (
                <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/40'>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Play className='h-4 w-4 text-white' fill='white' />
                  </motion.div>
                </div>
              )}
            </div>

            <div className='min-w-0 flex-1 text-left'>
              <p
                className={`truncate font-medium ${
                  index === currentTrack ? 'text-white' : 'text-purple-100'
                }`}
              >
                {track.title}
              </p>
              <p className='truncate text-sm text-purple-300/70'>
                {track.artist}
              </p>
            </div>

            <div className='flex-shrink-0 text-sm text-purple-200/60'>
              {formatTime(track.duration as number)}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
