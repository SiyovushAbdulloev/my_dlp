import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
} from 'lucide-react'
import { motion } from 'motion/react'

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  shuffle: boolean
  onShuffleToggle: () => void
  repeat: boolean
  onRepeatToggle: () => void
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  shuffle,
  onShuffleToggle,
  repeat,
  onRepeatToggle,
}: PlayerControlsProps) {
  return (
    <div className='flex items-center justify-center gap-4'>
      {/* Shuffle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onShuffleToggle}
        className={`rounded-full p-2 transition-colors ${
          shuffle ? 'text-purple-400' : 'text-purple-200/60'
        }`}
      >
        <Shuffle className='h-5 w-5' />
      </motion.button>

      {/* Previous */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrevious}
        className='rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20'
      >
        <SkipBack className='h-5 w-5' />
      </motion.button>

      {/* Play/Pause */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayPause}
        className='rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white shadow-lg shadow-purple-500/50 transition-shadow hover:shadow-xl hover:shadow-purple-500/60'
      >
        <motion.div initial={false} animate={{ rotate: isPlaying ? 0 : 0 }}>
          {isPlaying ? (
            <Pause className='h-7 w-7' fill='currentColor' />
          ) : (
            <Play className='ml-1 h-7 w-7' fill='currentColor' />
          )}
        </motion.div>
      </motion.button>

      {/* Next */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className='rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20'
      >
        <SkipForward className='h-5 w-5' />
      </motion.button>

      {/* Repeat */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRepeatToggle}
        className={`rounded-full p-2 transition-colors ${
          repeat ? 'text-purple-400' : 'text-purple-200/60'
        }`}
      >
        <Repeat className='h-5 w-5' />
      </motion.button>
    </div>
  )
}
