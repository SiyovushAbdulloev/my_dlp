import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/subject-class/$subjectClassId.edit'
import { toast } from 'sonner'
import { edit } from '@/api/subject-class'
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
import {
  type SubjectClassForm,
  subjectClassFormSchema,
} from '@/features/subject-class/create'

export function SubjectClassEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { subjects, classes, subject } = Route.useRouteContext()

  const row = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return Object.keys(subject).map((key) => subject[key])
  }, [subject])

  const form = useForm<SubjectClassForm>({
    resolver: zodResolver(subjectClassFormSchema),
    defaultValues: {
      class_id: row[0].items[0].class.id,
      subject_ids: row[0].items.map(
        (item: { subject: { id: string } }) => item.subject.id
      ),
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
      await edit(data)
      form.reset()
      toast.success('Предмет-класс успешно редактирован')
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
        title='Редактировать предмет-класс'
        backTo='/subject-class'
        actionText='Сохранить'
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
