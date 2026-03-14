import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/books/$bookId.show.tsx'
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  Headphones,
  LoaderCircle,
  Minus,
  PenLine,
  Plus,
} from 'lucide-react'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AudioPlayer } from '@/components/audio-player/Player.tsx'
import { Main } from '@/components/layout/main'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function BookShow() {
  const navigate = useNavigate()
  const { book } = Route.useRouteContext()
  console.log({ book })

  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.1)

  const isPdf = book.type === 1

  const titleRu = book.title.ru || '—'
  const titleEn = book.title.en || '—'
  const titleTg = book.title.tg || '—'

  const typeBadge = useMemo(() => {
    if (book.type === 2) {
      return (
        <Badge className='gap-1'>
          <Headphones className='size-3.5' />
          Audio
        </Badge>
      )
    }
    return (
      <Badge variant='secondary' className='gap-1'>
        <BookOpen className='size-3.5' />
        PDF
      </Badge>
    )
  }, [book.type])

  const pdfFile = useMemo(
    () => ({
      url: `${import.meta.env.VITE_API_URL}libraries/${book.id}/file`,
      withCredentials: true,
    }),
    [book.id]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {/* Header */}
      <header className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{titleRu}</h1>
          <div className='mt-2 flex flex-wrap items-center gap-2'>
            {typeBadge}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='outline' onClick={() => navigate({ to: '/books' })}>
            <ArrowLeft size={18} />
            Назад
          </Button>

          <Button
            variant='outline'
            onClick={() =>
              navigate({
                to: '/books/$bookId/edit',
                params: { bookId: book.id },
              })
            }
          >
            <PenLine className='mr-2 size-4' />
            Редактировать
          </Button>

          <Button
            variant='outline'
            onClick={() =>
              window.open(book.book.url, '_blank', 'noopener,noreferrer')
            }
          >
            <ExternalLink className='mr-2 size-4' />
            Открыть
          </Button>

          <Button asChild>
            <a href={book.book.url} download>
              <Download className='mr-2 size-4' />
              Скачать
            </a>
          </Button>
        </div>
      </header>

      <div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
        {/* Left panel */}
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <p className='text-sm font-semibold text-slate-900'>Информация</p>
          <p className='mt-1 text-xs text-slate-500'>Название и обложка</p>

          <div className='mt-4 overflow-hidden rounded-2xl border bg-slate-50'>
            <div className='aspect-[16/10] w-full bg-slate-100'>
              {book.cover.url ? (
                <img
                  src={book.cover.url}
                  alt={titleRu}
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              ) : (
                <div className='flex h-full items-center justify-center text-slate-400'>
                  No thumbnail
                </div>
              )}
            </div>
          </div>

          <Separator className='my-5' />

          <Tabs defaultValue='ru'>
            <TabsList className='w-full'>
              <TabsTrigger value='ru' className='flex-1'>
                RU
              </TabsTrigger>
              <TabsTrigger value='en' className='flex-1'>
                EN
              </TabsTrigger>
              <TabsTrigger value='tg' className='flex-1'>
                TG
              </TabsTrigger>
            </TabsList>

            <TabsContent value='ru' className='mt-4'>
              <p className='text-sm font-semibold text-slate-900'>{titleRu}</p>
            </TabsContent>
            <TabsContent value='en' className='mt-4'>
              <p className='text-sm font-semibold text-slate-900'>{titleEn}</p>
            </TabsContent>
            <TabsContent value='tg' className='mt-4'>
              <p className='text-sm font-semibold text-slate-900'>{titleTg}</p>
            </TabsContent>
          </Tabs>

          <Separator className='my-5' />

          <div className='space-y-2 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-slate-500'>Тип</span>
              <span className='font-medium text-slate-900'>
                {book.type === 2 ? 'Аудио (MP3)' : 'Электронная (PDF)'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-slate-500'>Файл</span>
              <span className='max-w-[240px] truncate font-medium text-slate-900'>
                {book.book.url}
              </span>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          {!isPdf ? (
            <div className='flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed text-slate-500'>
              <AudioPlayer
                tracks={[
                  {
                    id: book.id,
                    audioUrl: book.book.url,
                    cover: book.cover.url,
                    title: book.title.ru,
                  },
                ]}
              />
            </div>
          ) : (
            <>
              {/* PDF controls */}
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>
                    PDF Reader
                  </p>
                  <p className='text-xs text-slate-500'>
                    Страницы: {numPages ? `${page} / ${numPages}` : '—'}
                  </p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                  <Button
                    variant='outline'
                    onClick={() =>
                      setPage((p) => clamp(p - 1, 1, numPages || 1))
                    }
                    disabled={page <= 1}
                  >
                    Назад
                  </Button>

                  <Button
                    variant='outline'
                    onClick={() =>
                      setPage((p) => clamp(p + 1, 1, numPages || 1))
                    }
                    disabled={!!numPages && page >= numPages}
                  >
                    Вперёд
                  </Button>

                  <Separator orientation='vertical' className='mx-1 h-9' />

                  <Button
                    variant='outline'
                    onClick={() =>
                      setScale((s) =>
                        clamp(Number((s - 0.1).toFixed(2)), 0.6, 2)
                      )
                    }
                  >
                    <Minus className='size-4' />
                  </Button>

                  <div className='min-w-16 text-center text-sm font-medium text-slate-900'>
                    {Math.round(scale * 100)}%
                  </div>

                  <Button
                    variant='outline'
                    onClick={() =>
                      setScale((s) =>
                        clamp(Number((s + 0.1).toFixed(2)), 0.6, 2)
                      )
                    }
                  >
                    <Plus className='size-4' />
                  </Button>
                </div>
              </div>

              <Separator className='my-4' />

              {/* PDF canvas */}
              <div className='relative flex min-h-[520px] justify-center overflow-hidden rounded-2xl border bg-slate-50 p-4'>
                <Document
                  file={pdfFile}
                  onLoadSuccess={(pdf) => {
                    setNumPages(pdf.numPages)
                    setPage(1)
                  }}
                  loading={
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <LoaderCircle className='size-10 animate-spin text-slate-700' />
                    </div>
                  }
                  error={
                    <div className='p-6 text-center text-sm text-slate-600'>
                      Не удалось загрузить PDF. Проверьте доступность URL и
                      CORS/авторизацию.
                    </div>
                  }
                >
                  <Page
                    pageNumber={page}
                    scale={scale}
                    renderAnnotationLayer
                    renderTextLayer
                  />
                </Document>
              </div>

              <p className='mt-3 text-xs text-slate-500'>
                Если PDF хранится на Laravel под авторизацией, может
                понадобиться передавать cookies/headers (мы настроим, если
                покажешь как отдаёшь file_url).
              </p>
            </>
          )}
        </div>
      </div>
    </Main>
  )
}
