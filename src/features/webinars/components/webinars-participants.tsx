import { Users } from 'lucide-react'

const mockParticipants = [
  { id: 1, name: 'Иван Иванов' },
  { id: 2, name: 'Али Каримов' },
  { id: 3, name: 'Мария Петрова' },
  { id: 4, name: 'John Smith' },
]

export function WebinarParticipants() {
  return (
    <div className='flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm'>
      {/* Header */}
      <div className='flex items-center gap-2 border-b border-slate-100 px-4 py-3'>
        <Users size={18} />
        <span className='font-medium'>Участники</span>
      </div>

      {/* List */}
      <div className='flex-1 overflow-y-auto'>
        {mockParticipants.map((user) => (
          <div
            key={user.id}
            className='flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50'
          >
            <div className='relative'>
              <div className='flex size-9 items-center justify-center rounded-full bg-slate-200 text-sm font-medium'>
                {user.name.charAt(0)}
              </div>

              {/* Online indicator */}
              <span className='absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-green-500' />
            </div>

            <span className='text-sm text-slate-700'>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
