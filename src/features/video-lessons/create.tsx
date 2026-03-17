import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/video-lessons/create'
import { ArrowLeft, ImageIcon, Loader2, Trash } from 'lucide-react'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'
import { create } from '@/api/video-lessons'
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
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'

export const videoLessonFormSchema = z
  .object({
    title: z.object({
      ru: z.string().min(1, 'Заголовок на русском обязателен'),
      en: z.string().min(1, 'Заголовок на английском обязателен'),
      tg: z.string().min(1, 'Заголовок на таджикском обязателен'),
    }),
    subject_id: z.string().optional(),
    class_id: z.string().min(1, 'Класс обязателен'),
    video: z.instanceof(File).nullable().optional(),
    cover: z.instanceof(File).nullable().optional(),
    link: z.string().optional(),
    use_external: z.boolean(),
    is_published: z.boolean(),
  })
  .refine((data) => data.video || (data.use_external && data.link), {
    message: 'Необходимо выбрать видео-файл или ввести ссылку',
    path: ['video'],
  })

export type VideoLessonForm = z.infer<typeof videoLessonFormSchema>

const defaultLang = 'ru'

export function VideoLessonsCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const { classes, subjects } = Route.useRouteContext()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<VideoLessonForm>({
    resolver: zodResolver(videoLessonFormSchema),
    defaultValues: {
      title: { ru: '', en: '', tg: '' },
      use_external: false,
      video: null,
      cover: null,
      link: '',
      is_published: true,
    },
  })

  const onSubmit = async (data: VideoLessonForm) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title[ru]', data.title.ru)
      fd.append('title[en]', data.title.en)
      fd.append('title[tg]', data.title.tg)
      fd.append('class_id', data.class_id)
      fd.append('is_published', data.is_published ? '1' : '0')

      if (data.subject_id) {
        fd.append('subject_id', data.subject_id)
      }

      if (data.video) {
        fd.append('video', data.video)
      }

      if (data.cover) {
        fd.append('cover', data.cover)
      }

      if (data.link) {
        fd.append('link', data.link)
      }

      await create(fd)

      toast.success('Видео-урок успешно создан')
      navigate({ to: '/video-lessons' })
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    form.setValue('video', file, { shouldValidate: true, shouldDirty: true })
    setFilePreview(URL.createObjectURL(file))
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    form.setValue('cover', file, { shouldValidate: true, shouldDirty: true })
    setCoverPreview(URL.createObjectURL(file))
  }

  const removeVideo = () => {
    form.setValue('video', null, { shouldValidate: true, shouldDirty: true })
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeCover = () => {
    form.setValue('cover', null, { shouldValidate: true, shouldDirty: true })
    setCoverPreview(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <h1>Создать видео-урок</h1>
        <Button onClick={() => navigate({ to: '/video-lessons' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-6'
        >
          <Tabs defaultValue={defaultLang} className='w-full'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='ru'>RU</TabsTrigger>
                <TabsTrigger value='en'>EN</TabsTrigger>
                <TabsTrigger value='tg'>TG</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='ru' className='mt-4'>
              <FormField
                control={form.control}
                name='title.ru'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Заголовок</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='На русском' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value='en' className='mt-4'>
              <FormField
                control={form.control}
                name='title.en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='In English' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value='tg' className='mt-4'>
              <FormField
                control={form.control}
                name='title.tg'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Заголовок</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Ба тоҷикӣ' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          <div className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='class_id'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='!w-full'>Класс</FormLabel>
                  <SelectDropdown
                    className='!w-full'
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Выберите класс'
                    items={classes.data.map((cl) => ({
                      value: cl.id,
                      label: `${cl.number} ${cl.letter}`,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='subject_id'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='!w-full'>Предмет</FormLabel>
                  <SelectDropdown
                    className='!w-full'
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Выберите предмет'
                    items={subjects.data.map((s) => ({
                      value: s.id,
                      label: s.title.ru,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='is_published'
            render={({ field }) => (
              <FormItem className='flex items-center gap-3 rounded-md border p-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                </FormControl>
                <FormLabel className='!mt-0'>Опубликовано</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='use_external'
            render={({ field }) => (
              <FormItem className='flex items-center gap-3 rounded-md border p-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                </FormControl>
                <FormLabel className='!mt-0'>
                  Внешняя ссылка вместо файла
                </FormLabel>
              </FormItem>
            )}
          />

          {!form.watch('use_external') && (
            <FormField
              control={form.control}
              name='video'
              render={() => (
                <FormItem>
                  <FormLabel>Загрузить видео</FormLabel>
                  <FormControl>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className='flex min-h-[150px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 transition-colors hover:bg-gray-50'
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const file = e.dataTransfer.files[0]
                        if (!file) return
                        form.setValue('video', file, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                        setFilePreview(URL.createObjectURL(file))
                      }}
                    >
                      {filePreview ? (
                        <div className='relative w-full'>
                          <ReactPlayer
                            src={filePreview}
                            controls
                            width='100%'
                            height='250px'
                          />
                          <Button
                            type='button'
                            variant='default'
                            className='absolute top-2 right-2'
                            onClick={(e) => {
                              e.stopPropagation()
                              removeVideo()
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      ) : (
                        <p className='text-gray-400'>
                          Перетащите видео или кликните для выбора
                        </p>
                      )}

                      <input
                        type='file'
                        accept='video/*'
                        className='hidden'
                        ref={fileInputRef}
                        onChange={handleVideoChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('use_external') && (
            <FormField
              control={form.control}
              name='link'
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
            name='cover'
            render={() => (
              <FormItem>
                <FormLabel>Обложка</FormLabel>
                <FormControl>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className='flex min-h-[150px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 transition-colors hover:bg-gray-50'
                  >
                    {coverPreview ? (
                      <div className='relative w-full'>
                        <img
                          src={coverPreview}
                          alt='cover'
                          className='h-[250px] w-full rounded-md object-cover'
                        />
                        <Button
                          type='button'
                          variant='default'
                          className='absolute top-2 right-2'
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCover()
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2 text-gray-400'>
                        <ImageIcon className='size-5' />
                        Выберите обложку
                      </div>
                    )}

                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      ref={coverInputRef}
                      onChange={handleCoverChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type='submit'>
            {loading && <Loader2 className='mr-2 animate-spin' />}
            Создать
          </Button>
        </form>
      </Form>
    </Main>
  )
}
