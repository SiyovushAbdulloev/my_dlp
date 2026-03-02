import { useState } from 'react'
import { format, parse } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/webinars/$webinarId.edit'
import { ArrowLeft, CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/webinars'
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
  type WebinarForm,
  webinarFormSchema,
} from '@/features/webinars/create.tsx'

const defaultLang = 'en'

export function WebinarsEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { webinar } = Route.useRouteContext()

  const form = useForm<WebinarForm>({
    resolver: zodResolver(webinarFormSchema),
    defaultValues: {
      topic: {
        en: webinar.topic_en,
        ru: webinar.topic_ru,
        tg: webinar.topic_tg,
      },
      start_date: parse(webinar.start_date, 'dd.MM.yyyy', new Date()),
      start_time: webinar.start_time,
    },
  })

  const onSubmit = async (data: WebinarForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Вебинар успешно редактирован')
      navigate({ to: '/webinars' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <header className={'flex items-center justify-between'}>
          <h1>Редактировать вебинар</h1>
          <Button onClick={() => navigate({ to: '/webinars' })}>
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
                  name='topic.ru'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>Тема</FormLabel>
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
                  name='topic.en'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>Topic</FormLabel>
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
                  name='topic.tg'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>Мавзуъ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Ба тоҷикӣ' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className='flex items-center gap-3'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Дата начала</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            data-empty={!field.value}
                            className='w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground'
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Выберите дату</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
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
                name='start_time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Время начала</FormLabel>
                    <FormControl>
                      <Field className='w-32'>
                        <Input
                          type='time'
                          id='time-picker-optional'
                          step='1'
                          onChange={field.onChange}
                          defaultValue={field.value}
                          className='appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                        />
                      </Field>
                    </FormControl>
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
