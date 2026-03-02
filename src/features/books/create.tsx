import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, FileUp, ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/books'
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
import { Dropzone } from '@/components/dropzone.tsx'
import { Main } from '@/components/layout/main'

export const bookFormSchema = z.object({
  name: z.object({
    ru: z.string().min(1, 'Название (RU) обязательно'),
    en: z.string().min(1, 'Name (EN) required'),
    tg: z.string().min(1, 'Ном (TG) ҳатмист'),
  }),
  file: z.instanceof(File, { message: 'Файл книги обязателен' }),
  thumbnail: z.instanceof(File, { message: 'Обложка обязательна' }),
})

export type BookForm = z.infer<typeof bookFormSchema>

const defaultLang = 'ru'

export function BooksCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<BookForm>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      name: { ru: '', en: '', tg: '' },
    },
  })

  const file = form.watch('file')
  const thumbnail = form.watch('thumbnail')

  const thumbnailPreview = useMemo(() => {
    if (!thumbnail) return ''
    return URL.createObjectURL(thumbnail)
  }, [thumbnail])

  const onSubmit = async (data: BookForm) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name_ru', data.name.ru)
      fd.append('name_en', data.name.en)
      fd.append('name_tg', data.name.tg)
      fd.append('file', data.file)
      fd.append('thumbnail', data.thumbnail)

      await create(fd)

      toast.success('Книга успешно создана')
      navigate({ to: '/books' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Добавить книгу</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Загрузите файл книги и обложку. Тип (PDF/MP3) определится на сервере
            автоматически.
          </p>
        </div>

        <Button variant='outline' onClick={() => navigate({ to: '/books' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-6 lg:grid-cols-[1fr_420px]'>
            {/* Left */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <Tabs defaultValue={defaultLang} className='w-full'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>
                      Название книги
                    </p>
                    <p className='text-xs text-slate-500'>
                      Заполните все 3 языка.
                    </p>
                  </div>
                  <TabsList>
                    <TabsTrigger value='ru'>RU</TabsTrigger>
                    <TabsTrigger value='en'>EN</TabsTrigger>
                    <TabsTrigger value='tg'>TG</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='ru' className='mt-4'>
                  <FormField
                    control={form.control}
                    name='name.ru'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название (RU)</FormLabel>
                        <FormControl>
                          <Field>
                            <Input
                              {...field}
                              placeholder='Например: Геометрия — 10 класс'
                            />
                          </Field>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value='en' className='mt-4'>
                  <FormField
                    control={form.control}
                    name='name.en'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (EN)</FormLabel>
                        <FormControl>
                          <Field>
                            <Input
                              {...field}
                              placeholder='For example: Geometry — Grade 10'
                            />
                          </Field>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value='tg' className='mt-4'>
                  <FormField
                    control={form.control}
                    name='name.tg'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ном (TG)</FormLabel>
                        <FormControl>
                          <Field>
                            <Input
                              {...field}
                              placeholder='Масалан: Геометрия — синфи 10'
                            />
                          </Field>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className='mt-6 grid gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Dropzone
                          label='Файл книги (PDF или MP3)'
                          accept='.pdf,audio/mpeg,.mp3'
                          file={field.value}
                          onPick={(f) => field.onChange(f)}
                          hint='PDF для электронных книг или MP3 для аудио-книг.'
                          icon={<FileUp className='size-5' />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='thumbnail'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Dropzone
                          label='Обложка (thumbnail)'
                          accept='image/*'
                          file={field.value}
                          onPick={(f) => field.onChange(f)}
                          hint='JPG/PNG/WebP.'
                          icon={<ImageIcon className='size-5' />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right: preview */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <p className='text-sm font-semibold text-slate-900'>Превью</p>
              <p className='mt-1 text-xs text-slate-500'>Обложка и тип файла</p>

              <div className='mt-4 overflow-hidden rounded-2xl border bg-slate-50'>
                <div className='aspect-[16/10] w-full bg-slate-100'>
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt='thumbnail preview'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center text-slate-400'>
                      Нет обложки
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <p className='text-sm font-semibold text-slate-900'>
                    {form.watch('name.ru') || 'Название (RU)'}
                  </p>
                  <p className='mt-1 text-xs text-slate-500'>
                    {file ? `Файл: ${file.name}` : 'Файл: не выбран'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky actions */}
          <div className='sticky bottom-4 z-20'>
            <div className='flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate({ to: '/books' })}
              >
                Отмена
              </Button>

              <Button disabled={loading} type='submit' className='min-w-40'>
                {loading ? <Loader2 className='mr-2 animate-spin' /> : null}
                Создать
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Main>
  )
}
