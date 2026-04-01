import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/subject-class/create'
import { toast } from 'sonner'
import { create } from '@/api/subject-class'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import { AdminFormCard } from '@/components/admin/form-card'
import { SelectDropdown } from '@/components/select-dropdown'

export const subjectClassFormSchema = z.object({
  class_id: z
    .string({ message: 'Класс обязателен' })
    .min(1, 'Класс обязателен'),
  subject_ids: z
    .array(z.string({ message: 'Предметы обязательны' }))
    .min(1, { message: 'Укажите хотя бы 1 предмет' }),
})

export type SubjectClassForm = z.infer<typeof subjectClassFormSchema>

export function SubjectClassCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { subjects, classes } = Route.useRouteContext()

  const form = useForm<SubjectClassForm>({
    resolver: zodResolver(subjectClassFormSchema),
    defaultValues: {
      class_id: '',
      subject_ids: [],
    },
  })

  const classItems = useMemo(
    () =>
      classes.data.map((cl) => ({
        value: cl.id,
        label: `${cl.number} ${cl.letter}`,
      })),
    [classes]
  )

  const subjectOptions = useMemo(
    () =>
      subjects.data.map((s) => ({
        value: s.id,
        label: s.title.ru,
      })),
    [subjects]
  )

  const onSubmit = async (data: SubjectClassForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Предмет-класс успешно создан')
      navigate({ to: '/subject-class' })
    } catch (err) {
      if (!applyValidationErrors(form, err)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <AdminFormCard
        title='Прикрепить предмет к классу'
        backTo='/subject-class'
        actionText='Создать'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='class_id'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Класс</FormLabel>
                <SelectDropdown
                  className='w-full'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Выберите класс'
                  items={classItems}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='subject_ids'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Предметы</FormLabel>
                <MultiSelect
                  placeholder='Выберите предметы'
                  options={subjectOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AdminFormCard>
    </Form>
  )
}
