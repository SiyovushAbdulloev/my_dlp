import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/answers/$answerId.edit'
import { toast } from 'sonner'
import { edit } from '@/api/module-question-answers'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
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
import { AdminFormCard } from '@/components/admin/form-card'
import {
  questionAnswerFormSchema,
  type QuestionAnswerForm,
  type QuestionAnswerFormInput,
} from '@/features/module-question-answer/create'

export function ModuleQuestionAnswersEdit() {
  const navigate = useNavigate()
  const { course, module, question, answer } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<QuestionAnswerFormInput, undefined, QuestionAnswerForm>({
    resolver: zodResolver(questionAnswerFormSchema),
    defaultValues: {
      text: answer.text,
      is_correct: answer.is_correct,
      sort_order: answer.sort_order,
    },
  })

  const onSubmit = async (data: QuestionAnswerForm) => {
    setLoading(true)
    try {
      await edit(course.id, module.id, question.id, answer.id, data)
      toast.success('Ответ успешно обновлён')
      navigate({
        to: '/courses/$courseId/modules/$moduleId/questions/$questionId/answers',
        params: {
          courseId: course.id,
          moduleId: module.id,
          questionId: question.id,
        },
      })
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
        title='Редактировать ответ'
        backTo={`/courses/${course.id}/modules/${module.id}/questions/${question.id}/answers`}
        actionText='Сохранить'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='space-y-6'>
          <Tabs defaultValue='ru'>
            <TabsList>
              <TabsTrigger value='ru'>RU</TabsTrigger>
              <TabsTrigger value='en'>EN</TabsTrigger>
              <TabsTrigger value='tg'>TG</TabsTrigger>
            </TabsList>

            {(['ru', 'en', 'tg'] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className='mt-4'>
                <FormField
                  control={form.control}
                  name={`text.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Текст ответа</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
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
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='is_correct'
              render={({ field }) => (
                <FormItem className='flex items-center gap-3 rounded-md border p-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <FormLabel className='!mt-0'>Правильный ответ</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </AdminFormCard>
    </Form>
  )
}
