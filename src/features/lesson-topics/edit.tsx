import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/lesson-topics/$lessonTopicId.edit'
import { type SerializedEditorState } from 'lexical'
import { toast } from 'sonner'
import { edit } from '@/api/lesson-topics'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
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
import { AdminFormCard } from '@/components/admin/form-card'
import { Editor } from '@/components/blocks/editor-00/editor'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  type LessonTopicForm,
  lessonTopicFormSchema,
} from '@/features/lesson-topics/create'

export function LessonTopicEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { subjects, classes, topic } = Route.useRouteContext()

  const form = useForm<LessonTopicForm>({
    resolver: zodResolver(lessonTopicFormSchema),
    defaultValues: {
      class_id: topic.class?.id ?? '',
      subject_id: topic.subject?.id ?? '',
      topic: topic.topic,
      content: topic.content,
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
        label: s.title.ru,
      })),
    [subjects]
  )

  const onSubmit = async (data: LessonTopicForm) => {
    setLoading(true)
    try {
      await edit(topic.id, data)
      toast.success('Тема урока успешно редактирована')
      navigate({ to: '/lesson-topics' })
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <AdminFormCard
        title='Редактировать тему урока'
        backTo='/lesson-topics'
        actionText='Сохранить'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
          <div className='space-y-4'>
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

          <div>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контент урока</FormLabel>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </AdminFormCard>
    </Form>
  )
}
