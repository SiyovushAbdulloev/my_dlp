import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/classes/$classId.edit'
import { toast } from 'sonner'
import { edit } from '@/api/classes'
import { applyValidationErrors } from '@/lib/applyValidationErrors'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AdminFormCard } from '@/components/admin/form-card'
import { SelectDropdown } from '@/components/select-dropdown'
import { type ClassForm, classFormSchema } from '@/features/classes/create'

export function ClassesEdit() {
  const navigate = useNavigate()
  const { classObj } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<ClassForm>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      number: String(classObj.number),
      letter: classObj.letter,
    },
  })

  const numberItems = useMemo(
    () =>
      Array.from({ length: 11 }).map((_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      })),
    []
  )

  const letterItems = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => {
        const letter = String.fromCharCode(i + 1072)
        return {
          value: letter,
          label: letter,
        }
      }),
    []
  )

  const onSubmit = async (data: ClassForm) => {
    setLoading(true)
    try {
      await edit(classObj.id, data)
      form.reset()
      toast.success('Класс успешно изменен')
      navigate({ to: '/classes' })
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
        title='Редактировать класс'
        backTo='/classes'
        actionText='Сохранить'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='number'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Номер</FormLabel>
                <SelectDropdown
                  className='w-full'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Выберите номер класса'
                  items={numberItems}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='letter'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Буква</FormLabel>
                <SelectDropdown
                  className='w-full'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Выберите букву класса'
                  items={letterItems}
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
