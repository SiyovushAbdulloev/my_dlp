import { useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/video-lessons/$videoLessonId.edit'
import { ArrowLeft, CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import { Field } from '@/components/ui/field.tsx'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { Main } from '@/components/layout/main'
import {
  type VideoLessonForm,
  videoLessonFormSchema,
} from '@/features/video-lessons/create.tsx'
import { edit } from '@/api/video-lessons'
import { SelectDropdown } from '@/components/select-dropdown.tsx'

const defaultLang = 'en'

export function VideoLessonsEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { lesson, classes, subjects } = Route.useRouteContext()

  const form = useForm<VideoLessonForm>({
    resolver: zodResolver(videoLessonFormSchema),
    defaultValues: {
      title: {
        en: lesson.title_en,
        ru: lesson.title_ru,
        tg: lesson.title_tg,
      },
      class_id: lesson.class_id,
      subject_id: lesson.subject_id,
    },
  })

  const onSubmit = async (data: VideoLessonForm) => {
    setLoading(true)
    try {
      await edit(lesson.id, data)
      form.reset()
      toast.success('Видео-урок успешно редактирован')
      navigate({ to: '/video-lessons' })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <header className={'flex items-center justify-between'}>
          <h1>Редактировать видео-урок</h1>
          <Button onClick={() => navigate({ to: '/video-lessons' })}>
            <ArrowLeft size={18} />
            Назад
          </Button>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 px-4'
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
                  <FormItem className={'w-full'}>
                    <FormLabel className={'!w-full'}>Класс</FormLabel>
                    <SelectDropdown
                      className={'!w-full'}
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
                  <FormItem className={'w-full'}>
                    <FormLabel className={'!w-full'}>Предмет</FormLabel>
                    <SelectDropdown
                      className={'!w-full'}
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

            <Button disabled={loading} type='submit'>
              {loading ? <Loader2 className='animate-spin' /> : null}
              Редактировать
            </Button>
          </form>
        </Form>
      </Main>
    </>
  )
}
