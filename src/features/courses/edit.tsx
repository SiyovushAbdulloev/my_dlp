import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/edit'
import { CourseDifficultyLabel, CourseStatusLabel } from '@/types/course'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/courses'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AdminFormCard } from '@/components/admin/form-card'
import { SelectDropdown } from '@/components/select-dropdown'
import { courseFormSchema, type CourseForm } from '@/features/courses/create'

export function CoursesEdit() {
  const navigate = useNavigate()
  const { course } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course.title,
      description: course.description ?? { ru: '', en: '', tg: '' },
      difficulty: String(course.difficulty),
      duration_minutes: course.duration_minutes ?? undefined,
      status: String(course.status),
      cover: null,
    },
  })

  const cover = form.watch('cover')
  const coverPreview = useMemo(() => {
    if (!cover) return course.cover?.url ?? ''
    return URL.createObjectURL(cover)
  }, [cover, course.cover?.url])

  const onSubmit = async (data: CourseForm) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title[ru]', data.title.ru)
      fd.append('title[en]', data.title.en)
      fd.append('title[tg]', data.title.tg)

      fd.append('description[ru]', data.description.ru ?? '')
      fd.append('description[en]', data.description.en ?? '')
      fd.append('description[tg]', data.description.tg ?? '')

      fd.append('difficulty', String(data.difficulty))
      fd.append('status', String(data.status))
      fd.append('_method', 'PUT')

      if (data.duration_minutes) {
        fd.append('duration_minutes', String(data.duration_minutes))
      }

      if (data.cover) {
        fd.append('cover', data.cover)
      }

      await edit(course.id, fd)
      toast.success('Курс успешно обновлён')
      navigate({ to: '/courses' })
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
        title='Редактировать курс'
        backTo='/courses'
        actionText='Сохранить'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='space-y-6'>
          <Tabs defaultValue='ru' className='w-full'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='ru'>RU</TabsTrigger>
                <TabsTrigger value='en'>EN</TabsTrigger>
                <TabsTrigger value='tg'>TG</TabsTrigger>
              </TabsList>
            </div>

            {(['ru', 'en', 'tg'] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className='mt-4 space-y-4'>
                <FormField
                  control={form.control}
                  name={`title.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`description.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            ))}
          </Tabs>

          <div className='grid gap-4 md:grid-cols-3'>
            <FormField
              control={form.control}
              name='difficulty'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сложность</FormLabel>
                  <SelectDropdown
                    placeholder='Выберите сложность'
                    className='w-full'
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={Object.keys(CourseDifficultyLabel).map(
                      (difficulty) => ({
                        value: difficulty,
                        label:
                          CourseDifficultyLabel[
                            Number(
                              difficulty
                            ) as keyof typeof CourseDifficultyLabel
                          ],
                      })
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <SelectDropdown
                    className='w-full'
                    placeholder='Выберите статус'
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={Object.keys(CourseStatusLabel).map((status) => ({
                      value: status,
                      label:
                        CourseStatusLabel[
                          Number(status) as keyof typeof CourseStatusLabel
                        ],
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='duration_minutes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Длительность (мин.)</FormLabel>
                  <FormControl>
                    <Field>
                      <Input
                        type='number'
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </Field>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='cover'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Обложка</FormLabel>
                <FormControl>
                  <div className='rounded-2xl border border-slate-200 p-4'>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] ?? null)
                      }
                    />

                    <div className='mt-4 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100'>
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt='cover'
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='flex h-full items-center justify-center text-slate-400'>
                          <ImageIcon className='size-5' />
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AdminFormCard>
    </Form>
  )
}
