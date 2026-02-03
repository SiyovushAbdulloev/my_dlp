import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/dictionaries/cities'
import { fetchIndex } from '@/api/dictionaries/districts'
import { Button } from '@/components/ui/button.tsx'
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
import { Combobox } from '@/components/combobox.tsx'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown.tsx'
import { CityTypeLabel } from '@/types/city.ts'

export const cityFormSchema = z.object({
  name: z.object({
    ru: z
      .string({ message: 'Наименование на русском обязательно' })
      .min(1, 'Минимум 1 буква'),
    en: z
      .string({ message: 'Наименование на русском обязательно' })
      .min(1, 'Минимум 1 буква'),
    tg: z
      .string({ message: 'Наименование на русском обязательно' })
      .min(1, 'Минимум 1 буква'),
  }),
  district_id: z
    .string({ message: 'Район обязателен' })
    .min(1, 'Район обязателен'),
  type: z.string({ message: 'Тип обязателен' }).min(1, 'Тип обязателен'),
})

export type CityForm = z.infer<typeof cityFormSchema>

const defaultLang = 'en'

export function CitiesCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<CityForm>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: {
        en: '',
        ru: '',
        tg: '',
      },
    },
  })

  const onSubmit = async (data: CityForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Город успешно создан')
      navigate({ to: '/dictionaries/cities' })
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
          <h1>Создать город</h1>
          <Button onClick={() => navigate({ to: '/dictionaries/cities' })}>
            <ArrowLeft size={18} />
            Назад
          </Button>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 px-4'
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
                  name='name.ru'
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
                  name='name.en'
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
                  name='name.tg'
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
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Выберите регион'
                    items={Object.keys(CityTypeLabel).map(key => ({
                      value: key,
                      label: CityTypeLabel[key]
                    }))}
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
                      load={async ({ q, page }) => {
                        console.log({ q, page })
                        const res = await fetchIndex(page)
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
