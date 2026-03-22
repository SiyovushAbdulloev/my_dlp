import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/lessons/create'
import {
  ArrowLeft,
  FileText,
  Film,
  Loader2,
  Paperclip,
  Trash,
} from 'lucide-react'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'
import { create } from '@/api/course-lessons'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Main } from '@/components/layout/main'

export const courseLessonFormSchema = z.object({
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
  sort_order: z.coerce.number().min(1),
  duration_minutes: z.coerce.number().nullable().optional(),

  text_content: z.object({
    ru: z.string().optional(),
    en: z.string().optional(),
    tg: z.string().optional(),
  }),

  use_external_video: z.boolean(),
  video: z.instanceof(File).nullable().optional(),
  video_link: z.string().optional(),

  video_description: z.object({
    ru: z.string().optional(),
    en: z.string().optional(),
    tg: z.string().optional(),
  }),

  attachments: z.array(z.instanceof(File)).optional(),
})

export type CourseLessonForm = z.infer<typeof courseLessonFormSchema>

export function CourseLessonsCreate() {
  const navigate = useNavigate()
  const { course, module } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const attachmentsInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CourseLessonForm>({
    resolver: zodResolver(courseLessonFormSchema),
    defaultValues: {
      title: { ru: '', en: '', tg: '' },
      description: { ru: '', en: '', tg: '' },
      sort_order: 1,
      duration_minutes: undefined,
      text_content: { ru: '', en: '', tg: '' },
      use_external_video: false,
      video: null,
      video_link: '',
      video_description: { ru: '', en: '', tg: '' },
      attachments: [],
    },
  })

  const attachments = form.watch('attachments') ?? []

  const onSubmit = async (data: CourseLessonForm) => {
    setLoading(true)
    try {
      const fd = new FormData()

      fd.append('title[ru]', data.title.ru)
      fd.append('title[en]', data.title.en)
      fd.append('title[tg]', data.title.tg)

      fd.append('description[ru]', data.description.ru ?? '')
      fd.append('description[en]', data.description.en ?? '')
      fd.append('description[tg]', data.description.tg ?? '')

      fd.append('sort_order', String(data.sort_order))

      if (data.duration_minutes) {
        fd.append('duration_minutes', String(data.duration_minutes))
      }

      fd.append('text_content[ru]', data.text_content.ru ?? '')
      fd.append('text_content[en]', data.text_content.en ?? '')
      fd.append('text_content[tg]', data.text_content.tg ?? '')

      if (data.video) {
        fd.append('video', data.video)
      }

      if (data.video_link) {
        fd.append('video_link', data.video_link)
      }

      fd.append('video_description[ru]', data.video_description.ru ?? '')
      fd.append('video_description[en]', data.video_description.en ?? '')
      fd.append('video_description[tg]', data.video_description.tg ?? '')

      for (const file of attachments) {
        fd.append('attachments[]', file)
      }

      await create(course.id, module.id, fd)

      toast.success('Урок успешно создан')
      navigate({
        to: '/courses/$courseId/modules/$moduleId/lessons',
        params: { courseId: course.id, moduleId: module.id },
      })
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  const removeAttachment = (index: number) => {
    const current = form.getValues('attachments') ?? []
    form.setValue(
      'attachments',
      current.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true }
    )
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Создать урок</h1>
          <p className='text-sm text-muted-foreground'>{module.title.ru}</p>
        </div>

        <Button
          variant='outline'
          onClick={() =>
            navigate({
              to: '/courses/$courseId/modules/$moduleId/lessons',
              params: { courseId: course.id, moduleId: module.id },
            })
          }
        >
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Tabs defaultValue='ru'>
            <TabsList>
              <TabsTrigger value='ru'>RU</TabsTrigger>
              <TabsTrigger value='en'>EN</TabsTrigger>
              <TabsTrigger value='tg'>TG</TabsTrigger>
            </TabsList>

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
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`text_content.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Текст урока</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`video_description.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание видео</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            ))}
          </Tabs>

          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='sort_order'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порядок</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
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
                    <Input
                      type='number'
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='use_external_video'
            render={({ field }) => (
              <FormItem className='flex items-center gap-3 rounded-md border p-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                </FormControl>
                <FormLabel className='!mt-0'>
                  Использовать внешнюю ссылку на видео
                </FormLabel>
              </FormItem>
            )}
          />

          {!form.watch('use_external_video') ? (
            <FormField
              control={form.control}
              name='video'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Видео урока</FormLabel>
                  <FormControl>
                    <div
                      className='rounded-2xl border border-dashed p-4'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {videoPreview ? (
                        <div className='relative'>
                          <ReactPlayer
                            src={videoPreview}
                            controls
                            width='100%'
                            height='320px'
                          />
                          <Button
                            type='button'
                            className='absolute top-2 right-2'
                            onClick={(e) => {
                              e.stopPropagation()
                              field.onChange(null)
                              setVideoPreview(null)
                              if (fileInputRef.current)
                                fileInputRef.current.value = ''
                            }}
                          >
                            <Trash className='size-4' />
                          </Button>
                        </div>
                      ) : (
                        <div className='flex min-h-[180px] items-center justify-center text-slate-400'>
                          <Film className='mr-2 size-5' />
                          Загрузите видео
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='video/*'
                        className='hidden'
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          field.onChange(file)
                          setVideoPreview(URL.createObjectURL(file))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name='video_link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на видео</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://example.com/video.mp4'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='attachments'
            render={() => (
              <FormItem>
                <FormLabel>Дополнительные материалы</FormLabel>
                <FormControl>
                  <div className='rounded-2xl border border-dashed p-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => attachmentsInputRef.current?.click()}
                    >
                      <Paperclip className='mr-2 size-4' />
                      Добавить файлы
                    </Button>

                    <input
                      ref={attachmentsInputRef}
                      type='file'
                      multiple
                      accept='.pdf,.doc,.docx,.ppt,.pptx,.zip'
                      className='hidden'
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? [])
                        const current = form.getValues('attachments') ?? []
                        form.setValue('attachments', [...current, ...files], {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }}
                    />

                    {attachments.length ? (
                      <div className='mt-4 space-y-2'>
                        {attachments.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className='flex items-center justify-between rounded-xl border p-3'
                          >
                            <div className='flex items-center gap-2'>
                              <FileText className='size-4' />
                              <span className='text-sm'>{file.name}</span>
                            </div>

                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => removeAttachment(index)}
                            >
                              <Trash className='size-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}
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
