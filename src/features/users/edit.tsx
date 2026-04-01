import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/users/$userId.edit'
import { type Role } from '@/types'
import { toast } from 'sonner'
import { edit } from '@/api/users'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
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
import { AdminFormCard } from '@/components/admin/form-card'
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
      role: String(user.role.id),
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
      role: String(user.role.id),
    })
  }, [user, form])

  const roleItems = useMemo(
    () =>
      roles.data.map((role: Role) => ({
        value: String(role.id),
        label: role.description ?? role.name ?? String(role.id),
      })),
    [roles]
  )

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
    <Form {...form}>
      <AdminFormCard
        title='Редактировать пользователя'
        backTo='/users'
        actionText='Сохранить'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
          <div className='space-y-4'>
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
                      items={roleItems}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
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
      </AdminFormCard>
    </Form>
  )
}
