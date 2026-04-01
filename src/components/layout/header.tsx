import { Search } from 'lucide-react'
import { ProfileDropdown } from '@/components/profile-dropdown'

type HeaderProps = {
  children?: React.ReactNode
  bottomSlot?: React.ReactNode
}

export function Header({ children, bottomSlot }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm'>
      <div className='mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4'>
        <div className='flex items-center gap-4'>
          <div className='flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 shadow-md'>
            <span className='text-sm font-bold text-white'>ҶТ</span>
          </div>

          <div className='hidden flex-col lg:flex'>
            <span className='font-semibold text-slate-900'>
              Платформаи миллии таълими рақамӣ
            </span>
            <span className='text-sm text-slate-500'>
              Ҷумҳурии Тоҷикистон · STEM
            </span>
          </div>
        </div>

        <div className='hidden max-w-2xl flex-1 xl:block'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              placeholder='Ҷустуҷӯи курсҳо, дарсҳо, санҷишҳо...'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
            />
          </div>
        </div>

        <div className='ml-auto flex items-center gap-4'>
          {children}
          <ProfileDropdown />
        </div>
      </div>

      {bottomSlot ? (
        <div className='border-t border-slate-100'>{bottomSlot}</div>
      ) : null}
    </header>
  )
}
