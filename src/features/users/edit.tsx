// src/features/users/edit.tsx
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/users/$userId.edit.tsx'
import { type Role } from '@/types'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/users'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'

export const userEditFormSchema = z
  .object({
    phone: z.string().min(1, 'Телефон обязателен'),
    login: z.string().optional(),
    first_name: z.string().min(1, 'Имя обязательно'),
    last_name: z.string().min(1, 'Фамилия обязательна'),
    middle_name: z.string().min(1, 'Отчество обязательно'),
    email: z.string().email('Неверный email'),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    role: z.string().min(1, 'Роль обязательна'),
  })
  .refine(
    (data) => {
      if (!data.password && !data.password_confirmation) return true
      return data.password === data.password_confirmation
    },
    {
      path: ['password_confirmation'],
      message: 'Пароли не совпадают',
    }
  )

export type UserEditForm = z.infer<typeof userEditFormSchema>

export function UsersEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { roles, user } = Route.useRouteContext()

  const form = useForm<UserEditForm>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      phone: '',
      login: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: user.role.id,
    },
  })

  useEffect(() => {
    if (!user) return

    form.reset({
      phone: user.phone ?? '',
      login: user.login ?? '',
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      middle_name: user.middle_name ?? '',
      email: user.email ?? '',
      password: '',
      password_confirmation: '',
    })
  }, [user, form])

  const onSubmit = async (data: UserEditForm) => {
    setLoading(true)
    try {
      await edit(user.id, data)
      toast.success('Пользователь успешно обновлён')
      navigate({ to: '/users' })
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Редактировать пользователя
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Обновите данные пользователя и роль.
          </p>
        </div>

        <Button variant='outline' onClick={() => navigate({ to: '/users' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
            {/* Left */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-2'>
                <div className='inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50'>
                  <Sparkles className='size-4 text-slate-700' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>
                    Основные данные
                  </p>
                  <p className='text-xs text-slate-500'>
                    ФИО, логин, телефон и роль
                  </p>
                </div>
              </div>

              <div className='mt-6 space-y-4'>
                <FormField
                  control={form.control}
                  name='last_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фамилия</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='middle_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Отчество</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='login'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логин</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Роль</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          className='w-full'
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Выберите роль'
                          items={roles.data.map((role: Role) => ({
                            value: role.id,
                            label:
                              role.description ?? role.name ?? String(role.id),
                          }))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <p className='text-sm font-semibold text-slate-900'>Доступ</p>
              <p className='mt-1 text-xs text-slate-500'>
                Email и пароль для входа в систему
              </p>

              <div className='mt-6 grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Новый пароль</FormLabel>
                      <FormControl>
                        <Field>
                          <Input
                            type='password'
                            {...field}
                            placeholder='Оставьте пустым, если не менять'
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password_confirmation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтверждение пароля</FormLabel>
                      <FormControl>
                        <Field>
                          <Input
                            type='password'
                            {...field}
                            placeholder='Повторите новый пароль'
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className='sticky bottom-4 z-20'>
            <div className='flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate({ to: '/users' })}
              >
                Отмена
              </Button>

              <Button disabled={loading} type='submit' className='min-w-40'>
                {loading ? <Loader2 className='mr-2 animate-spin' /> : null}
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Main>
  )
}
