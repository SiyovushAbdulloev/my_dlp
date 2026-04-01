import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { CityTypeLabel } from '@/types/city'
import { toast } from 'sonner'
import { create } from '@/api/dictionaries/cities'
import { fetchIndex } from '@/api/dictionaries/districts'
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
import { Combobox } from '@/components/combobox'
import { SelectDropdown } from '@/components/select-dropdown'

export const cityFormSchema = z.object({
  name_ru: z
    .string({ message: 'Наименование на русском обязательно' })
    .min(1, 'Минимум 1 буква'),
  name_en: z
    .string({ message: 'Наименование на английском обязательно' })
    .min(1, 'Минимум 1 буква'),
  name_tj: z
    .string({ message: 'Наименование на таджикском обязательно' })
    .min(1, 'Минимум 1 буква'),
  district_id: z
    .string({ message: 'Район обязателен' })
    .min(1, 'Район обязателен'),
  type: z.string({ message: 'Тип обязателен' }).min(1, 'Тип обязателен'),
})

export type CityForm = z.infer<typeof cityFormSchema>

const defaultLang = 'en'

export function CitiesCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<CityForm>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name_ru: '',
      name_en: '',
      name_tj: '',
      district_id: '',
      type: '',
    },
  })

  const cityTypeItems = useMemo(
    () =>
      Object.keys(CityTypeLabel).map((key) => ({
        value: key,
        label: CityTypeLabel[key as keyof typeof CityTypeLabel],
      })),
    []
  )

  const onSubmit = async (data: CityForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Город успешно создан')
      navigate({ to: '/dictionaries/cities' })
    } catch (err) {
      if (!applyValidationErrors(form, err)) {
        toast.error('Неверные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <AdminFormCard
        title='Создать город'
        backTo='/dictionaries/cities'
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
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип</FormLabel>
                <SelectDropdown
                  className='w-full'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Выберите тип'
                  items={cityTypeItems}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='district_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Район</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Выберите район'
                    searchPlaceholder='Поиск по районам...'
                    load={async ({ page, q }) => {
                      const res = await fetchIndex(page, q)
                      return res
                    }}
                    getValue={(r) => String(r.id)}
                    getLabel={(r) => r.name_ru}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AdminFormCard>
    </Form>
  )
}
