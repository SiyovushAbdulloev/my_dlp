import { useState } from 'react'
import { format, parse } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/users/$userId.edit'
import { ArrowLeft, CalendarIcon, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { fetchIndex as fetchIndexEducationDepartments } from '@/api/education-departments'
import { fetchIndex } from '@/api/head-directorates'
import { edit } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Combobox } from '@/components/combobox.tsx'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'
import { type UserForm, userFormSchema } from '@/features/users/create.tsx'

export function UsersEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { roles, user } = Route.useRouteContext()

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      middle_name: user.middle_name,
      role_id: user.role.id,
      education: user.education,
      university: user.university,
      profession: user.profession,
      category: user.category,
      phone: user.phone,
      email: user.email,
      head_directorate_id: user.head_directorate_id,
      education_department_id: user.education_department_id,
      birthdate: parse(user.birthdate, 'dd.MM.yyyy', new Date()),
    },
  })

  const onSubmit = async (data: UserForm) => {
    setLoading(true)
    try {
      await edit(user.id, data)
      toast.success('Пользователь успешно обновлён')
      navigate({ to: '/users' })
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
            Обновите персональные данные, роль и подразделение.
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
                    Профиль
                  </p>
                  <p className='text-xs text-slate-500'>ФИО / дата / роль</p>
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
                          <Input {...field} placeholder='(необязательно)' />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-3'>
                  <FormField
                    control={form.control}
                    name='birthdate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата рождения</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type='button'
                                variant='outline'
                                data-empty={!field.value}
                                className='w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground'
                              >
                                <CalendarIcon className='mr-2 size-4' />
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Выберите</span>
                                )}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className='w-auto p-0'>
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) field.onChange(date)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='role_id'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>Роль</FormLabel>
                        <FormControl>
                          <SelectDropdown
                            className='w-full'
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Выберите роль'
                            items={roles.data.map((role) => ({
                              label: role.name,
                              value: role.id,
                            }))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className='my-6' />

              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='head_directorate_id'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Сарраёсат</FormLabel>
                      <FormControl>
                        <Combobox
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Выберите сарраёсат'
                          searchPlaceholder='Поиск по сарраёсат...'
                          load={({ page }) => fetchIndex(page)}
                          getValue={(d) => String(d.id)}
                          getLabel={(d) => d.name_ru}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='education_department_id'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Отдел образования</FormLabel>
                      <FormControl>
                        <Combobox
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Выберите маориф'
                          searchPlaceholder='Поиск по маориф...'
                          load={({ page }) =>
                            fetchIndexEducationDepartments(page)
                          }
                          getValue={(d) => String(d.id)}
                          getLabel={(d) => d.name_ru}
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
              <p className='text-sm font-semibold text-slate-900'>Детали</p>
              <p className='mt-1 text-xs text-slate-500'>
                Образование, контакты и профессия
              </p>

              <div className='mt-6 grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='education'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Образование</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} placeholder='Например: Высшее' />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='university'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Университет</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} placeholder='Например: ТНУ' />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='profession'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Профессия</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} placeholder='Например: Учитель' />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <FormControl>
                        <Field>
                          <Input {...field} placeholder='Например: Высшая' />
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
                  name='email'
                  render={({ field }) => (
                    <FormItem>
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
              </div>
            </div>
          </div>

          {/* Sticky actions */}
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
