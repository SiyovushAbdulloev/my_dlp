import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/users/create'
import { toast } from 'sonner'
import { create } from '@/api/users'
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

export const userFormSchema = z
  .object({
    phone: z.string().min(1, 'Телефон обязателен'),
    login: z.string().min(1, 'Логин обязателен'),
    first_name: z.string().min(1, 'Имя обязательно'),
    last_name: z.string().min(1, 'Фамилия обязательна'),
    middle_name: z.string().min(1, 'Отчество обязательно'),
    email: z.string().email('Неверный email'),
    password: z.string().min(1, 'Пароль обязателен'),
    password_confirmation: z
      .string()
      .min(1, 'Подтверждение пароля обязательно'),
    role: z.string().min(1, 'Роль обязательна'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Пароли не совпадают',
  })

export type UserForm = z.infer<typeof userFormSchema>

export function UsersCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { roles } = Route.useRouteContext()

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      phone: '',
      login: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: '',
    },
  })

  const roleItems = useMemo(
    () =>
      roles.data.map((role) => ({
        value: String(role.id),
        label: role.description ?? role.name ?? String(role.id),
      })),
    [roles]
  )

  const onSubmit = async (data: UserForm) => {
    setLoading(true)
    try {
      await create(data)
      toast.success('Пользователь успешно создан')
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
        title='Создать пользователя'
        backTo='/users'
        actionText='Создать'
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
                      <Input {...field} placeholder='Например: Ибрагимов' />
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
                      <Input {...field} placeholder='Например: Сиёвуш' />
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
                      <Input {...field} placeholder='Например: Зафарович' />
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
                      <Input {...field} placeholder='Например: admin' />
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
                      <Input {...field} placeholder='+992...' />
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
                      <Input {...field} placeholder='user@example.com' />
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
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Field>
                      <Input
                        type='password'
                        {...field}
                        placeholder='Введите пароль'
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
                        placeholder='Повторите пароль'
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
