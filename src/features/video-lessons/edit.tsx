import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/video-lessons/$videoLessonId.edit'
import { ArrowLeft, Loader2, Trash } from 'lucide-react'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'
import { edit } from '@/api/video-lessons'
import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown.tsx'
import {
  type VideoLessonForm,
  videoLessonFormSchema,
} from '@/features/video-lessons/create.tsx'

const defaultLang = 'en'

export function VideoLessonsEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { lesson, classes, subjects } = Route.useRouteContext()
  const [filePreview, setFilePreview] = useState<string | null>(null)
  console.log({ lesson })
  console.log(
    'True:',
    (lesson.video_url || lesson.external_url) && !filePreview
  )
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<VideoLessonForm>({
    resolver: zodResolver(videoLessonFormSchema),
    defaultValues: {
      title: {
        ru: lesson.title_ru,
        en: lesson.title_en,
        tg: lesson.title_tg,
      },
      class_id: lesson.class_id,
      subject_id: lesson.subject_id,
      use_external: lesson.video_url.length === 0,
      video: null,
      external_url: lesson.external_url,
    },
  })

  const onSubmit = async (data: VideoLessonForm) => {
    setLoading(true)
    try {
      await edit(lesson.id, data)
      form.reset()
      setFilePreview(null)
      toast.success('Видео-урок успешно редактирован')
      navigate({ to: '/video-lessons' })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('video', file)
      setFilePreview(URL.createObjectURL(file))
    }
  }

  const removeFile = () => {
    form.setValue('video', null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
          {/* Tabs для трёх языков */}
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

          {/* SelectDropdowns */}
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
                      label: s.name_ru,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Выбор источника видео */}
          <FormField
            control={form.control}
            name='use_external'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  id='use_external'
                  className='rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500'
                />
                <FormLabel htmlFor='use_external' className='text-sm'>
                  Внешняя ссылка вместо файла
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Drag & Drop / File Upload */}
          {!form.watch('use_external') && (
            <FormField
              control={form.control}
              name='video'
              render={() => (
                <FormItem>
                  <FormLabel>Загрузить видео</FormLabel>
                  <FormControl>
                    <>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className='flex min-h-[150px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 transition-colors hover:bg-gray-50'
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const file = e.dataTransfer.files[0]
                          if (file) {
                            form.setValue('video', file)
                            setFilePreview(URL.createObjectURL(file))
                          }
                        }}
                      >
                        <div className='relative w-full'>
                          {filePreview ? (
                            <ReactPlayer
                              src={filePreview}
                              controls
                              width='100%'
                              height='250px'
                            />
                          ) : (
                            <p className='text-center text-gray-400'>
                              Перетащите файл или кликните для выбора
                            </p>
                          )}
                          {filePreview && (
                            <Button
                              type='button'
                              variant='default'
                              className='absolute top-2 right-2'
                              onClick={removeFile}
                            >
                              <Trash />
                            </Button>
                          )}
                          <input
                            type='file'
                            accept='video/*'
                            className='hidden'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      {(lesson.video_url || lesson.external_url) &&
                      !filePreview ? (
                        <ReactPlayer
                          src={lesson.video_url ?? lesson.external_url}
                          controls
                          width='100%'
                          height='250px'
                        />
                      ) : null}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Внешняя ссылка */}
          {form.watch('use_external') && (
            <FormField
              control={form.control}
              name='external_url'
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

          <Button disabled={loading} type='submit'>
            {loading && <Loader2 className='mr-2 animate-spin' />}
            Редактировать
          </Button>
        </form>
      </Form>
    </Main>
  )
}
