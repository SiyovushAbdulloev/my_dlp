import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'motion/react'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) {
  return (
    <div className='flex items-center gap-2'>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onMuteToggle}
        className='text-purple-200 transition-colors hover:text-white'
      >
        {isMuted || volume === 0 ? (
          <VolumeX className='h-5 w-5' />
        ) : (
          <Volume2 className='h-5 w-5' />
        )}
      </motion.button>

      <div className='group relative h-2 w-20 overflow-hidden rounded-full bg-white/10'>
        <motion.div
          className='absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500'
          style={{
            width: `${isMuted ? 0 : volume * 100}%`,
          }}
        />
        <input
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            const newVolume = Number(e.target.value)
            onVolumeChange(newVolume)
            if (isMuted && newVolume > 0) {
              onMuteToggle()
            }
          }}
          className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
        />
      </div>
    </div>
  )
}
