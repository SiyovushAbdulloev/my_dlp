import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/subjects/$subjectId.edit'
import { toast } from 'sonner'
import { edit } from '@/api/subjects'
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
import { type SubjectForm, subjectFormSchema } from '@/features/subjects/create'

const defaultLang = 'en'

export function SubjectsEdit() {
  const navigate = useNavigate()
  const { subject } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<SubjectForm>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      title: {
        en: subject.title.en,
        ru: subject.title.ru,
        tg: subject.title.tg,
      },
    },
  })

  const onSubmit = async (data: SubjectForm) => {
    setLoading(true)
    try {
      await edit(subject.id, data)
      form.reset()
      toast.success('Предмет успешно изменен')
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
        title='Редактировать предмет'
        backTo='/subjects'
        actionText='Сохранить'
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
