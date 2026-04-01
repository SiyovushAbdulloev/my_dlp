import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { create } from '@/api/subjects'
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
import { AdminFormCard } from '@/components/admin/form-card'

export const subjectFormSchema = z.object({
  title: z.object({
    ru: z.string().min(1, 'Наименование на русском обязательно'),
    en: z.string().min(1, 'Наименование на английском обязательно'),
    tg: z.string().min(1, 'Наименование на таджикском обязательно'),
  }),
})

export type SubjectForm = z.infer<typeof subjectFormSchema>

const defaultLang = 'en'

export function SubjectsCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<SubjectForm>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      title: {
        en: '',
        ru: '',
        tg: '',
      },
    },
  })

  const onSubmit = async (data: SubjectForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Предмет успешно создан')
      navigate({ to: '/subjects' })
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
        title='Создать предмет'
        backTo='/subjects'
        actionText='Создать'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Tabs defaultValue={defaultLang} className='w-full'>
          <div className='flex items-center justify-between'>
            <TabsList>
              <TabsTrigger value='ru'>RU</TabsTrigger>
              <TabsTrigger value='en'>EN</TabsTrigger>
              <TabsTrigger value='tg'>TG</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='ru' className='mt-4'>
            <FormField
              control={form.control}
              name='title.ru'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Наименование</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='На русском' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value='en' className='mt-4'>
            <FormField
              control={form.control}
              name='title.en'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Наименование</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='In English' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value='tg' className='mt-4'>
            <FormField
              control={form.control}
              name='title.tg'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Наименование</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ба тоҷикӣ' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </AdminFormCard>
    </Form>
  )
}
