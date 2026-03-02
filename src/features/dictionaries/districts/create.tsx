import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/dictionaries/districts/create.tsx'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/dictionaries/districts'
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
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown.tsx'

export const districtFormSchema = z.object({
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
  region_id: z
    .string({ message: 'Регион обязателен' })
    .min(1, 'Регион обязателен'),
})

export type DistrictForm = z.infer<typeof districtFormSchema>

const defaultLang = 'en'

export function DistrictsCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { regions } = Route.useRouteContext()

  const form = useForm<DistrictForm>({
    resolver: zodResolver(districtFormSchema),
    defaultValues: {
      name: {
        en: '',
        ru: '',
        tg: '',
      },
    },
  })

  const onSubmit = async (data: DistrictForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Район успешно создан')
      navigate({ to: '/dictionaries/districts' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <header className={'flex items-center justify-between'}>
          <h1>Создать район</h1>
          <Button onClick={() => navigate({ to: '/dictionaries/districts' })}>
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
              name='region_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Регион</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Выберите регион'
                    items={regions.data.map((region) => ({
                      label: region.name_ru,
                      value: region.id,
                    }))}
                  />
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
