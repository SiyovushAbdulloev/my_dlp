import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/lesson-topics/create'
import { type SerializedEditorState } from 'lexical'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/lesson-topics'
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
import { Textarea } from '@/components/ui/textarea'
import { Editor } from '@/components/blocks/editor-00/editor'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'

export const lessonTopicFormSchema = z.object({
  class_id: z.string().min(1, 'Класс обязателен'),
  subject_id: z.string().min(1, 'Предмет обязателен'),
  topic: z.string().min(2, 'Тема обязательна'),
  content: z.string().min(1, 'Контент обязателен'),
})

export type LessonTopicForm = z.infer<typeof lessonTopicFormSchema>

export function LessonTopicCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { subjects, classes } = Route.useRouteContext()

  const form = useForm<LessonTopicForm>({
    resolver: zodResolver(lessonTopicFormSchema),
    defaultValues: {
      class_id: '',
      subject_id: '',
      topic: '',
      content: '',
    },
  })

  const classItems = useMemo(
    () =>
      classes.data.map((c) => ({
        value: c.id,
        label: `${c.number} ${c.letter}`,
      })),
    [classes]
  )

  const subjectItems = useMemo(
    () =>
      subjects.data.map((s) => ({
        value: s.id,
        label: s.name_ru,
      })),
    [subjects]
  )

  const onSubmit = async (data: LessonTopicForm) => {
    setLoading(true)
    try {
      await create(data)
      toast.success('Тема урока успешно создана')
      navigate({ to: '/lesson-topics' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* empty */
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Создать тему урока
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Выберите класс и предмет, укажите тему и наполните урок контентом.
          </p>
        </div>

        <Button
          variant='outline'
          onClick={() => navigate({ to: '/lesson-topics' })}
        >
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
            {/* Left side: meta */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-2'>
                <div className='inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50'>
                  <Sparkles className='size-4 text-slate-700' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>
                    Параметры урока
                  </p>
                  <p className='text-xs text-slate-500'>
                    Класс / предмет / тема
                  </p>
                </div>
              </div>

              <div className='mt-6 space-y-4'>
                <FormField
                  control={form.control}
                  name='class_id'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Класс</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          className='w-full'
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Выберите класс'
                          items={classItems}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='subject_id'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Предмет</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          className='w-full'
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Выберите предмет'
                          items={subjectItems}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='topic'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тема</FormLabel>
                      <FormControl>
                        <Field>
                          <Textarea
                            {...field}
                            placeholder='Например: Площадь многоугольников'
                            className='min-h-[96px] resize-none'
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right side: content */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        editorSerializedState={
                          field.value
                            ? (JSON.parse(field.value) as SerializedEditorState)
                            : ('' as unknown as SerializedEditorState)
                        }
                        onSerializedChange={(value) => {
                          field.onChange(JSON.stringify(value))
                        }}
                        // placeholder='Напишите содержание урока...'
                        // className='min-h-[420px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sticky actions */}
          <div className='sticky bottom-4 z-20'>
            <div className='flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate({ to: '/lesson-topics' })}
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
