export function WebinarVideo() {
  return (
    <div className='relative h-full min-h-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm'>
      {/* BigBlueButton iframe */}
      <iframe
        src='https://your-bigbluebutton-url'
        className='h-full w-full'
        allow='camera; microphone; fullscreen'
      />
    </div>
  )
}
