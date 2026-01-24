import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/_authenticated/dictionaries/cities/$cityId.edit.tsx';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { edit } from '@/api/dictionaries/cities';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Main } from '@/components/layout/main';
import { SelectDropdown } from '@/components/select-dropdown.tsx';
import { type CityForm, cityFormSchema } from '@/features/dictionaries/cities/create.tsx';
import { CityTypeLabel } from '@/types/city.ts'
import { Combobox } from '@/components/combobox.tsx'
import { fetchIndex } from '@/api/dictionaries/districts'



















const defaultLang = 'en'

export function CitiesEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { city } = Route.useRouteContext()

  const form = useForm<CityForm>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: {
        en: city.name_en,
        ru: city.name_ru,
        tg: city.name_tg,
      },
      type: city.type,
      district_id: city.district.id
    },
  })

  const onSubmit = async (data: CityForm) => {
    setLoading(true)
    try {
      await edit(city.id, data)
      form.reset()
      toast.success('Город успешно изменен')
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
          <h1>Редактировать город</h1>
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
                      placeholder="Выберите район"
                      searchPlaceholder="Поиск по районам..."
                      load={({ q, page }) => fetchIndex(page)} // позже добавишь q в API
                      getValue={(d) => String(d.id)}
                      getLabel={(d) => d.name_ru}
                      initialSelected={city.district} // ✅ объект выбранного района
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} type='submit'>
              {loading ? <Loader2 className='animate-spin' /> : null}
              Сохранить
            </Button>
          </form>
        </Form>
      </Main>
    </>
  )
}
