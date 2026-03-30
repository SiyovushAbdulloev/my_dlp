import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn, User } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  login: z.string({ message: 'Логин обязателен' }).min(1, 'Логин обязателен'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(7, 'Пароль должен содержать минимум 7 символов'),
  remember_me: z.boolean().optional(),
})

export type LoginForm = z.infer<typeof formSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: '',
      password: '',
      remember_me: false,
    },
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)

    try {
      const response = await login(data)

      auth.setUser(response.data.user)

      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      toast.success(`Добро пожаловать, ${data.login}!`)
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Ошибка запроса')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-5', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='login'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium text-slate-700'>
                Логин
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <User className='pointer-events-none absolute top-1/2 left-3 z-10 size-5 -translate-y-1/2 text-slate-400' />
                  <Input
                    placeholder='Введите логин'
                    autoComplete='username'
                    className='pl-11'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className='text-sm text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium text-slate-700'>
                Пароль
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='••••••••'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-sm text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='remember_me'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='remember_me'
                    checked={!!field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor='remember_me'
                    className='cursor-pointer text-sm font-normal text-slate-600'
                  >
                    Запомнить меня
                  </Label>
                </div>

                <button
                  type='button'
                  className='text-sm font-medium text-indigo-600 transition hover:text-indigo-700'
                >
                  Забыли пароль?
                </button>
              </div>
            </FormItem>
          )}
        />

        <div className='rounded-lg border border-amber-200 bg-amber-50 p-3'>
          <p className='text-center text-xs text-amber-800'>
            <strong>Demo:</strong> admin / password
          </p>
        </div>

        <Button
          type='submit'
          disabled={
            isLoading ||
            !form.watch('login')?.trim() ||
            !form.watch('password')?.trim()
          }
          className='h-12 w-full rounded-xl bg-indigo-600 font-medium text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <Loader2 className='mr-2 animate-spin' />
          ) : (
            <LogIn className='mr-2' />
          )}
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </Form>
  )
}
