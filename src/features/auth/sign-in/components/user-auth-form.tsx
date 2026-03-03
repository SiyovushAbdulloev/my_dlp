import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { DefaultRoles } from '@/types'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import { applyValidationErrors } from '@/lib/applyValidationErrors.ts'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label.tsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  login: z.string({ message: 'Логин обязателен' }),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(7, 'Пароль должен содержать минимум 7 символов'),
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
  const [selectedRole, setSelectedRole] = useState<string>(
    DefaultRoles.SUPER_ADMIN
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)

    try {
      const response = await login(data)
      console.log({ response })

      auth.setUser(response.data.user)
      console.log('After setting auth user')

      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })
      console.log('After redirect')

      return `Добро пожаловать, ${data.login}!`
    } catch (e) {
      console.log({ e })
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
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='login'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Логин</FormLabel>
              <FormControl>
                <Input placeholder='test' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <RadioGroup
          defaultValue={selectedRole}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            setSelectedRole(e.target.value)
          }}
        >
          {Object.keys(DefaultRoles).map((key) => (
            <div key={key} className='flex items-center gap-3'>
              <RadioGroupItem
                value={
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-expect-error
                  DefaultRoles[key]
                }
                id={key}
              />
              <Label htmlFor={key}>
                {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-expect-error
                  DefaultRoles[key]
                }
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Вход
        </Button>
      </form>
    </Form>
  )
}
