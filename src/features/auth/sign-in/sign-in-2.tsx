import { GraduationCap } from 'lucide-react'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn2() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2'>
          {/* Left side */}
          <div className='hidden lg:block'>
            <div className='relative overflow-hidden rounded-3xl shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
                alt='Learning platform'
                className='h-[640px] w-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/45 to-transparent' />

              <div className='absolute right-0 bottom-0 left-0 p-10'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white'>
                    <GraduationCap className='size-7 text-indigo-600' />
                  </div>
                  <h2 className='text-3xl font-bold text-white'>
                    Digital Learning Platform
                  </h2>
                </div>

                <p className='max-w-xl text-lg leading-relaxed text-white/90'>
                  Войдите в систему и продолжите обучение, управление курсами и
                  работу с учебными материалами.
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className='mx-auto w-full max-w-md'>
            <div className='rounded-3xl border-0 bg-white p-8 shadow-xl'>
              <div className='mb-8'>
                <div className='mb-6 flex items-center justify-center lg:hidden'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 shadow-md'>
                    <span className='text-base font-bold text-white'>ҶТ</span>
                  </div>
                </div>

                <h1 className='mb-2 text-3xl font-semibold text-slate-900'>
                  С возвращением
                </h1>
                <p className='text-slate-500'>
                  Войдите, чтобы продолжить работу в системе
                </p>
              </div>

              <UserAuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
