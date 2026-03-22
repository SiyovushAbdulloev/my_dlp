import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/lessons/$lessonId.edit'
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
import { edit } from '@/api/course-lessons'
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
import {
  courseLessonFormSchema,
  type CourseLessonForm,
} from '@/features/course-lessons/create'

export function CourseLessonsEdit() {
  const navigate = useNavigate()
  const { course, module, lesson } = Route.useRouteContext()

  const [loading, setLoading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [deleteFileIds, setDeleteFileIds] = useState<string[]>([])

  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const attachmentsInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CourseLessonForm>({
    resolver: zodResolver(courseLessonFormSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description ?? { ru: '', en: '', tg: '' },
      sort_order: lesson.sort_order,
      duration_minutes: lesson.duration_minutes ?? undefined,
      text_content: lesson.text_content ?? { ru: '', en: '', tg: '' },
      use_external_video: !lesson.video?.url && !!lesson.video_link,
      video: null,
      video_link: lesson.video_link ?? '',
      video_description: lesson.video_description ?? { ru: '', en: '', tg: '' },
      attachments: [],
    },
  })

  const newFiles = form.watch('attachments') ?? []

  const visibleExistingFiles = useMemo(() => {
    return (lesson.files ?? []).filter(
      (file) => !deleteFileIds.includes(String(file.id))
    )
  }, [lesson.files, deleteFileIds])

  const currentVideo =
    videoPreview || lesson.video?.url || lesson.video_link || ''

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
      fd.append('_method', 'PUT')

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

      for (const file of newFiles) {
        fd.append('attachments[]', file)
      }

      for (const id of deleteFileIds) {
        fd.append('delete_file_ids[]', id)
      }

      await edit(course.id, module.id, lesson.id, fd)

      toast.success('Урок успешно обновлён')
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

  const removeNewFile = (index: number) => {
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
          <h1 className='text-2xl font-bold tracking-tight'>
            Редактировать урок
          </h1>
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
                      onClick={() => videoInputRef.current?.click()}
                    >
                      {currentVideo ? (
                        <div className='relative'>
                          <ReactPlayer
                            src={currentVideo}
                            controls
                            width='100%'
                            height='320px'
                          />
                          {videoPreview ? (
                            <Button
                              type='button'
                              className='absolute top-2 right-2'
                              onClick={(e) => {
                                e.stopPropagation()
                                field.onChange(null)
                                setVideoPreview(null)
                                if (videoInputRef.current)
                                  videoInputRef.current.value = ''
                              }}
                            >
                              <Trash className='size-4' />
                            </Button>
                          ) : null}
                        </div>
                      ) : (
                        <div className='flex min-h-[180px] items-center justify-center text-slate-400'>
                          <Film className='mr-2 size-5' />
                          Загрузите видео
                        </div>
                      )}

                      <input
                        ref={videoInputRef}
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

                    {visibleExistingFiles.length ? (
                      <div className='mt-4 space-y-2'>
                        {visibleExistingFiles.map((file) => (
                          <div
                            key={file.id}
                            className='flex items-center justify-between rounded-xl border p-3'
                          >
                            <div className='flex items-center gap-2'>
                              <FileText className='size-4' />
                              <a
                                href={file.url}
                                target='_blank'
                                rel='noreferrer'
                                className='text-sm underline'
                              >
                                {file.name}
                              </a>
                            </div>

                            <Button
                              type='button'
                              variant='outline'
                              onClick={() =>
                                setDeleteFileIds((prev) => [
                                  ...prev,
                                  String(file.id),
                                ])
                              }
                            >
                              <Trash className='size-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {newFiles.length ? (
                      <div className='mt-4 space-y-2'>
                        {newFiles.map((file, index) => (
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
                              onClick={() => removeNewFile(index)}
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
            Сохранить
          </Button>
        </form>
      </Form>
    </Main>
  )
}
