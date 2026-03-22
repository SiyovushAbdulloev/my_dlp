import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { CourseDifficultyLabel, CourseStatusLabel } from '@/types/course.ts'
import { ArrowLeft, ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/courses'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'

export const courseFormSchema = z.object({
  title: z.object({
    ru: z.string().min(1),
    en: z.string().min(1),
    tg: z.string().min(1),
  }),
  description: z.object({
    ru: z.string().optional(),
    en: z.string().optional(),
    tg: z.string().optional(),
  }),
  difficulty: z.string({ message: 'Сложность обязателен' }),
  duration_minutes: z.number().nullable().optional(),
  status: z.string({ message: 'Статус обязателен' }),
  cover: z.instanceof(File).nullable().optional(),
})

export type CourseForm = z.infer<typeof courseFormSchema>

export function CoursesCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<CourseForm>({
    resolver: zodResolver(courseFormSchema),
  })

  const cover = form.watch('cover')
  const coverPreview = useMemo(() => {
    if (!cover) return ''
    return URL.createObjectURL(cover)
  }, [cover])

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
      if (data.duration_minutes) {
        fd.append('duration_minutes', String(data.duration_minutes))
      }
      if (data.cover) {
        fd.append('cover', data.cover)
      }

      await create(fd)
      toast.success('Курс успешно создан')
      navigate({ to: '/courses' })
    } catch (e) {
      if (!applyValidationErrors(form, e)) toast.error('Не валидные данные')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Создать курс</h1>
        <Button variant='outline' onClick={() => navigate({ to: '/courses' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                    placeholder={'Выберите сложность'}
                    className={'w-full'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={Object.keys(CourseDifficultyLabel).map(
                      (difficulty) => ({
                        value: difficulty,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-expect-error
                        label: CourseDifficultyLabel[difficulty],
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
                    className={'w-full'}
                    placeholder={'Выберите статус'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={Object.keys(CourseStatusLabel).map((status) => ({
                      value: status,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-expect-error
                      label: CourseStatusLabel[status],
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
                  <div className='rounded-2xl border p-4'>
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

          <Button disabled={loading} type='submit'>
            {loading ? <Loader2 className='mr-2 animate-spin' /> : null}
            Создать
          </Button>
        </form>
      </Form>
    </Main>
  )
}
