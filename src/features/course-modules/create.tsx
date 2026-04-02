import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/create'
import { toast } from 'sonner'
import { create } from '@/api/course-modules'
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

export const courseModuleFormSchema = z.object({
  title: z.object({
    ru: z.string().min(1),
    en: z.string().min(1),
    tg: z.string().min(1),
  }),
  description: z.object({
    ru: z.string().optional(),
    en: z.string().optional(),
    tg: z.string().optional(),
  }),
  sort_order: z.number().min(1),
  passing_score: z.number().min(1).max(100),
  attempts_allowed: z.number().min(1),
  randomize_questions: z.boolean(),
})

export type CourseModuleForm = z.infer<typeof courseModuleFormSchema>

export function CourseModulesCreate() {
  const navigate = useNavigate()
  const { course } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<CourseModuleForm>({
    resolver: zodResolver(courseModuleFormSchema),
    defaultValues: {
      title: { ru: '', en: '', tg: '' },
      description: { ru: '', en: '', tg: '' },
      sort_order: 1,
      passing_score: 70,
      attempts_allowed: 3,
      randomize_questions: false,
    },
  })

  const onSubmit = async (data: CourseModuleForm) => {
    setLoading(true)
    try {
      await create(course.id, data)
      toast.success('Модуль успешно создан')
      navigate({
        to: '/courses/$courseId/modules',
        params: { courseId: course.id },
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
        title='Создать модуль'
        backTo={`/courses/${course.id}/modules`}
        actionText='Создать'
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
              <TabsContent key={lang} value={lang} className='mt-4 space-y-4'>
                <FormField
                  control={form.control}
                  name={`title.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`description.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
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

          <div className='grid gap-4 md:grid-cols-3'>
            <FormField
              control={form.control}
              name='sort_order'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порядок</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passing_score'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Проходной балл</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='attempts_allowed'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество попыток</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='randomize_questions'
            render={({ field }) => (
              <FormItem className='flex items-center gap-3 rounded-md border p-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                </FormControl>
                <FormLabel className='!mt-0'>
                  Случайный порядок вопросов
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </AdminFormCard>
    </Form>
  )
}
