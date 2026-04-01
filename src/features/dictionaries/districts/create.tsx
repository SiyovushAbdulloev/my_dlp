import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/dictionaries/districts/create'
import { toast } from 'sonner'
import { create } from '@/api/dictionaries/districts'
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
import { SelectDropdown } from '@/components/select-dropdown'

export const districtFormSchema = z.object({
  name_ru: z
    .string({ message: 'Наименование на русском обязательно' })
    .min(1, 'Минимум 1 буква'),
  name_tj: z
    .string({ message: 'Наименование на таджикском обязательно' })
    .min(1, 'Минимум 1 буква'),
  name_en: z
    .string({ message: 'Наименование на английском обязательно' })
    .min(1, 'Минимум 1 буква'),
  region_id: z
    .string({ message: 'Регион обязателен' })
    .min(1, 'Регион обязателен'),
})

export type DistrictForm = z.infer<typeof districtFormSchema>

const defaultLang = 'en'

export function DistrictsCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { regions } = Route.useRouteContext()

  const form = useForm<DistrictForm>({
    resolver: zodResolver(districtFormSchema),
    defaultValues: {
      name_ru: '',
      name_tj: '',
      name_en: '',
      region_id: '',
    },
  })

  const regionItems = useMemo(
    () =>
      regions.map((region) => ({
        label: region.name_ru,
        value: region.id,
      })),
    [regions]
  )

  const onSubmit = async (data: DistrictForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Район успешно создан')
      navigate({ to: '/dictionaries/districts' })
    } catch (err) {
      if (!applyValidationErrors(form, err)) {
        toast.error('Невалидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <AdminFormCard
        title='Создать район'
        backTo='/dictionaries/districts'
        actionText='Создать'
        loading={loading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='space-y-6'>
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

          <FormField
            control={form.control}
            name='region_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Регион</FormLabel>
                <SelectDropdown
                  className='w-full'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Выберите регион'
                  items={regionItems}
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
