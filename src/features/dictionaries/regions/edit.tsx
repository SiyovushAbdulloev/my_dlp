import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/dictionaries/regions/$regionId.edit.tsx'
import { toast } from 'sonner'
import { edit } from '@/api/dictionaries/regions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { AdminFormCard } from '@/components/admin/form-card.tsx'
import {
  type RegionForm,
  regionFormSchema,
} from '@/features/dictionaries/regions/create.tsx'

const defaultLang = 'en'

export function RegionsEdit() {
  const navigate = useNavigate()
  const { region } = Route.useRouteContext()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<RegionForm>({
    resolver: zodResolver(regionFormSchema),
    defaultValues: {
      name_ru: region.name_ru,
      name_tj: region.name_tj,
      name_en: region.name_en,
    },
  })

  const onSubmit = async (data: RegionForm) => {
    setLoading(true)
    try {
      await edit(region.id, data)
      form.reset()
      toast.success('Регион успешно изменен')
      navigate({ to: '/dictionaries/regions' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <AdminFormCard
          title='Редактировать регион'
          backTo='/dictionaries/regions'
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
    </>
  )
}
