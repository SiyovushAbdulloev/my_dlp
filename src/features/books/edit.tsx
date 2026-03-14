import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/books/$bookId.edit'
import { ArrowLeft, FileUp, ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/books'
import { applyValidationErrors } from '@/lib/applyValidationErrors.ts'
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
import { type BookForm, bookFormSchema } from '@/features/books/create.tsx'

const defaultLang = 'ru'

export function BooksEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { book } = Route.useRouteContext()
  console.log({ book })

  const form = useForm<BookForm>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: {
        ru: book.title.ru ?? '',
        en: book.title.en ?? '',
        tg: book.title.tg ?? '',
      },
      is_published: !!book.is_published,
    },
  })

  const newCover = form.watch('cover')
  const newFile = form.watch('file')

  const thumbnailPreview = useMemo(() => {
    if (newCover) return URL.createObjectURL(newCover)
    return book.cover.url ?? ''
  }, [newCover, book.cover])

  const onSubmit = async (data: BookForm) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title[ru]', data.title.ru)
      fd.append('title[en]', data.title.en)
      fd.append('title[tg]', data.title.tg)
      fd.append('is_published', data.is_published ? '1' : '0')
      fd.append('_method', 'PUT')

      if (data.file) fd.append('file', data.file)
      if (data.cover) fd.append('cover', data.cover)

      await edit(book.id, fd)

      toast.success('Книга успешно обновлена')
      navigate({ to: '/books' })
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Редактировать книгу
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Вы можете заменить файл/обложку или оставить как есть.
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
                    name='title.ru'
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
                    name='title.en'
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
                    name='title.tg'
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
                          label='Заменить файл книги (опционально)'
                          accept='.pdf,audio/mpeg,.mp3'
                          file={field.value}
                          onPick={(f) => field.onChange(f ?? undefined)}
                          hint={
                            book.book.url
                              ? 'Текущий файл уже загружен.'
                              : 'Файл отсутствует.'
                          }
                          icon={<FileUp className='size-5' />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='cover'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Dropzone
                          label='Заменить обложку (опционально)'
                          accept='image/*'
                          file={field.value}
                          onPick={(f) => field.onChange(f ?? undefined)}
                          hint={
                            book.cover.url
                              ? 'Текущая обложка установлена.'
                              : 'Обложка отсутствует.'
                          }
                          icon={<ImageIcon className='size-5' />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {newFile ? (
                <p className='mt-4 text-xs text-slate-500'>
                  Новый файл выбран:{' '}
                  <span className='font-medium text-slate-700'>
                    {newFile.name}
                  </span>
                </p>
              ) : null}
            </div>

            {/* Right: preview */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <p className='text-sm font-semibold text-slate-900'>Превью</p>
              <p className='mt-1 text-xs text-slate-500'>Текущая обложка</p>

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
                    {form.watch('title.ru') || 'Название (RU)'}
                  </p>
                  <p className='mt-1 text-xs text-slate-500'>
                    {book.type === 2
                      ? 'Тип: аудио (MP3)'
                      : 'Тип: электронная книга (PDF)'}
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
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Main>
  )
}
