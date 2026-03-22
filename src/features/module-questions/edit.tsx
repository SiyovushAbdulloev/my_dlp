import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId.edit'
import { ModuleQuestionTypeLabel } from '@/types/module_question.ts'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/module-questions'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
import { Button } from '@/components/ui/button'
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
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  moduleQuestionFormSchema,
  type ModuleQuestionForm,
} from '@/features/module-questions/create'

export function ModuleQuestionsEdit() {
  const navigate = useNavigate()
  const { course, module, question } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<ModuleQuestionForm>({
    resolver: zodResolver(moduleQuestionFormSchema),
    defaultValues: {
      text: question.text,
      type: String(question.type),
      sort_order: question.sort_order,
    },
  })

  const onSubmit = async (data: ModuleQuestionForm) => {
    setLoading(true)
    try {
      await edit(course.id, module.id, question.id, data)
      toast.success('Вопрос успешно обновлён')
      navigate({
        to: '/courses/$courseId/modules/$moduleId/questions',
        params: { courseId: course.id, moduleId: module.id },
      })
    } catch (e) {
      if (!applyValidationErrors(form, e)) toast.error('Не валидные данные')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Редактировать вопрос
        </h1>
        <Button
          variant='outline'
          onClick={() =>
            navigate({
              to: '/courses/$courseId/modules/$moduleId/questions',
              params: { courseId: course.id, moduleId: module.id },
            })
          }
        >
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                    className={'w-full'}
                    placeholder={'Выберите тип вопроса'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={Object.keys(ModuleQuestionTypeLabel).map((key) => ({
                      value: key,
                      label: ModuleQuestionTypeLabel[key],
                    }))}
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

          <Button disabled={loading} type='submit'>
            {loading ? <Loader2 className='mr-2 animate-spin' /> : null}
            Сохранить
          </Button>
        </form>
      </Form>
    </Main>
  )
}
