import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/edit'
import { ModuleQuestionTypeLabel } from '@/types/module_question'
import { toast } from 'sonner'
import { edit } from '@/api/module-questions'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
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
import { SelectDropdown } from '@/components/select-dropdown'
import {
  moduleQuestionFormSchema,
  type ModuleQuestionForm,
  type ModuleQuestionFormInput,
} from '@/features/module-questions/create'

export function ModuleQuestionsEdit() {
  const navigate = useNavigate()
  const { course, module, question } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<ModuleQuestionFormInput, undefined, ModuleQuestionForm>({
    resolver: zodResolver(moduleQuestionFormSchema),
    defaultValues: {
      text: question.text,
      type: String(question.type),
      sort_order: question.sort_order,
    },
  })

  const typeItems = useMemo(
    () =>
      (Object.keys(ModuleQuestionTypeLabel) as Array<string>).map((key) => ({
        value: String(key),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        label: ModuleQuestionTypeLabel[String(key)],
      })),
    []
  )

  const onSubmit = async (data: ModuleQuestionForm) => {
    setLoading(true)
    try {
      await edit(course.id, module.id, question.id, {
        ...data,
        sort_order: String(data.sort_order),
      })
      toast.success('Вопрос успешно обновлён')
      navigate({
        to: '/courses/$courseId/modules/$moduleId/questions',
        params: { courseId: course.id, moduleId: module.id },
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
        title='Редактировать вопрос'
        backTo={`/courses/${course.id}/modules/${module.id}/questions`}
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
                      <FormLabel>Текст вопроса</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} />
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
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип вопроса</FormLabel>
                  <SelectDropdown
                    className='w-full'
                    placeholder='Выберите тип вопроса'
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={typeItems}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>
        </div>
      </AdminFormCard>
    </Form>
  )
}
