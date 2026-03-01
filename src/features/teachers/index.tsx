import { Main } from '@/components/layout/main'
import { TeachersTable } from './components/teachers-table.tsx'

export function Teachers() {
  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Учителя</h2>
          </div>
        </div>
        <TeachersTable />
      </Main>
    </>
  )
}
