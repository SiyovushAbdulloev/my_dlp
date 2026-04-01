import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/head-directorates/$directorateId.edit'
import { toast } from 'sonner'
import { edit } from '@/api/head-directorates'
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
import {
  type HeadDirectorateForm,
  headDirectorateFormSchema,
} from '@/features/head-directorate/create'

const defaultLang = 'en'

export function HeadDirectoratesEdit() {
  const navigate = useNavigate()
  const { directorate } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)

  const form = useForm<HeadDirectorateForm>({
    resolver: zodResolver(headDirectorateFormSchema),
    defaultValues: {
      name_ru: directorate.name_ru,
      name_en: directorate.name_en,
      name_tj: directorate.name_tj,
    },
  })

  const onSubmit = async (data: HeadDirectorateForm) => {
    setLoading(true)
    try {
      await edit(directorate.id, data)
      form.reset()
      toast.success('Сарраёсат успешно изменен')
      navigate({ to: '/head-directorates' })
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
        title='Редактировать сарраёсат'
        backTo='/head-directorates'
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
              name='name_ru'
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
              name='name_en'
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
              name='name_tj'
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
