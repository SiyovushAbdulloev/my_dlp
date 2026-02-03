import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/classes'
import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown.tsx'

export const classFormSchema = z.object({
  number: z.string().min(1, 'Число обязательно'),
  letter: z.string().min(1, 'Буква обязательно'),
})

export type ClassForm = z.infer<typeof classFormSchema>

export function ClassesCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<ClassForm>({
    resolver: zodResolver(classFormSchema),
  })

  const onSubmit = async (data: ClassForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Класс успешно создан')
      navigate({ to: '/classes' })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <header className={'flex items-center justify-between'}>
          <h1>Создать класс</h1>
          <Button onClick={() => navigate({ to: '/classes' })}>
            <ArrowLeft size={18} />
            Назад
          </Button>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 px-4'
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name='number'
                render={({ field }) => (
                  <FormItem className={"w-full"}>
                    <FormLabel className={"!w-full"}>Номер</FormLabel>
                    <SelectDropdown
                      className={"!w-full"}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Выберите номер класса'
                      items={Array.from({ length: 11}).map((_, i) => ({
                        value: (i + 1) + '',
                        label: (i + 1) + '',
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='letter'
                render={({ field }) => (
                  <FormItem className={"w-full"}>
                    <FormLabel className={"!w-full"}>Буква</FormLabel>
                    <SelectDropdown
                      className={"!w-full"}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Выберите букву класса'
                      items={Array.from({ length: 32}).map((_, i) => ({
                        value: String.fromCharCode(i + 1072),
                        label: String.fromCharCode(i + 1072),
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={loading} type='submit'>
              {loading ? <Loader2 className='animate-spin' /> : null}
              Создать
            </Button>
          </form>
        </Form>
      </Main>
    </>
  )
}
