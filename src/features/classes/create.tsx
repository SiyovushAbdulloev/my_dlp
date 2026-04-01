import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { create } from '@/api/classes'
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

export const classFormSchema = z.object({
  number: z.string().min(1, 'Число обязательно'),
  letter: z.string().min(1, 'Буква обязательно'),
})

export type ClassForm = z.infer<typeof classFormSchema>

export function ClassesCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<ClassForm>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      number: '',
      letter: '',
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
      await create(data)
      form.reset()
      toast.success('Класс успешно создан')
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
        title='Создать класс'
        backTo='/classes'
        actionText='Создать'
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
