// src/features/users/create.tsx
import * as React from 'react'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CalendarIcon, Camera, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { Route } from '@/routes/_authenticated/users/create'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { GenderLabel, type Gender } from '@/types/user'

// IMPORTANT: adapt your API to accept FormData if you want to upload avatar
import { create as createUser } from '@/api/users'

export const userFormSchema = z.object({
  login: z.string().min(1, 'Логин обязателен'),
  phone: z.string().min(1, 'Телефон обязателен'),
  email: z.string().email('Некорректный email'),
  first_name: z.string().min(1, 'Имя обязательно'),
  last_name: z.string().min(1, 'Фамилия обязательна'),
  middle_name: z.string().optional().default(''),
  birthdate: z.string().min(1, 'Дата рождения обязательна'),
  gender: z.enum(['m', 'f'], { message: 'Пол обязателен' }),
  school_id: z.string().min(1, 'Школа обязательна'),
  role_id: z.string().min(1, 'Роль обязательна'),
  avatar: z.instanceof(File).optional(),
})

export type UserForm = z.infer<typeof userFormSchema>

export function UsersCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { roles } = Route.useRouteContext()

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      login: '',
      phone: '',
      email: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      birthdate: '',
      school_id: '',
      role_id: '',
      // gender intentionally omitted => required select
      // avatar omitted
    },
  })

  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)

  const setPreview = (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  const clearAvatar = () => {
    form.setValue('avatar', undefined, { shouldDirty: true, shouldValidate: true })
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  React.useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const onSubmit = async (data: UserForm) => {
    setLoading(true)
    try {
      // If your backend expects JSON, avatar won't work.
      // Recommended: send FormData.
      const fd = new FormData()
      fd.append('login', data.login)
      fd.append('phone', data.phone)
      fd.append('email', data.email)
      fd.append('first_name', data.first_name)
      fd.append('last_name', data.last_name)
      fd.append('middle_name', data.middle_name ?? '')
      fd.append('birthdate', data.birthdate)
      fd.append('gender', data.gender)
      fd.append('school_id', data.school_id)
      fd.append('role_id', data.role_id)
      if (data.avatar) fd.append('avatar', data.avatar)

      await createUser(fd)

      form.reset()
      clearAvatar()
      toast.success('Пользователь успешно создан')
      navigate({ to: '/users' })
    } catch (err) {
      console.error(err)
      toast.error('Не удалось создать пользователя')
    } finally {
      setLoading(false)
    }
  }


  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <header className="flex items-center justify-between">
        <h1>Создать пользователя</h1>
        <Button type="button" onClick={() => navigate({ to: '/users' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          {/* Avatar */}
          <FormField
            control={form.control}
            name="avatar"
            render={() => (
              <FormItem>
                <FormLabel>Аватар</FormLabel>

                <div className="flex items-center gap-4">
                  <div className="relative size-20 overflow-hidden rounded-full border bg-muted">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Camera className="size-6" />
                      </div>
                    )}

                    {avatarPreview ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-1 top-1 h-7 w-7 rounded-full"
                        onClick={clearAvatar}
                        aria-label="Remove avatar"
                      >
                        <X className="size-4" />
                      </Button>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" asChild>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              if (!file.type.startsWith('image/')) return
                              form.setValue('avatar', file, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                              setPreview(file)
                              // reset input so selecting same file again triggers change
                              e.currentTarget.value = ''
                            }}
                          />
                          Загрузить фото
                        </label>
                      </Button>

                      {avatarPreview ? (
                        <Button type="button" variant="ghost" onClick={clearAvatar}>
                          Удалить
                        </Button>
                      ) : null}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      JPG/PNG, лучше квадратное изображение.
                    </p>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Основные данные */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="login" autoComplete="username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="email@example.com" autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+992..." autoComplete="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ФИО */}
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Фамилия" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Имя" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отчество</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Отчество (если есть)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Роль, Пол, Дата рождения */}
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Выберите роль"
                    items={roles?.data?.map((r: any) => ({
                      value: String(r.id),
                      label: String(r.name),
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пол</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Выберите пол"
                    items={Object.keys(GenderLabel).map((key) => ({
                      value: key,
                      label: GenderLabel[key as Gender],
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => {
                const dateValue = field.value ? new Date(field.value) : undefined


                return (
                  <FormItem>
                    <FormLabel>Дата рождения</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4 opacity-50" />
                            {field.value ? format(dateValue!, 'yyyy-MM-dd') : 'Выберите дату'}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(d) => {
                              if (!d) return
                              const yyyy = d.getFullYear()
                              const mm = String(d.getMonth() + 1).padStart(2, '0')
                              const dd = String(d.getDate()).padStart(2, '0')
                              field.onChange(`${yyyy}-${mm}-${dd}`)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          {/* Школа (пока текст) */}
          <FormField
            control={form.control}
            name="school_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Школа</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Введите школу (пока текстом)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
            Создать
          </Button>
        </form>
      </Form>
    </Main>
  )
}
