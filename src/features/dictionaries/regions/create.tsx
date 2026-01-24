import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { create } from '@/api/dictionaries/regions';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Main } from '@/components/layout/main';
import { toast } from 'sonner'















export const regionFormSchema = z.object({
  name: z.object({
    ru: z.string().min(1, 'Наименование на русском обязательно'),
    en: z.string().min(1, 'Наименование на английском обязательно'),
    tg: z.string().min(1, 'Наименование на таджикском обязательно'),
  }),
})

export type RegionForm = z.infer<typeof regionFormSchema>

const defaultLang = 'en'

export function RegionsCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<RegionForm>({
    resolver: zodResolver(regionFormSchema),
    defaultValues: {
      name: {
        en: '',
        ru: '',
        tg: '',
      }
    },
  })

  const onSubmit = async (data: RegionForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Регион успешно создан')
      navigate({to: '/dictionaries/regions'})
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <header className={"flex items-center justify-between"}>
          <h1>Создать регион</h1>
          <Button onClick={() => navigate({to: '/dictionaries/regions'})}>
            <ArrowLeft size={18} />
            Назад
          </Button>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
            <Tabs defaultValue={defaultLang} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="ru">RU</TabsTrigger>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="tg">TG</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="ru" className="mt-4">
                <FormField
                  control={form.control}
                  name="name.ru"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Наименование</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="На русском" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="en" className="mt-4">
                <FormField
                  control={form.control}
                  name="name.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Наименование</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="In English" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="tg" className="mt-4">
                <FormField
                  control={form.control}
                  name="name.tg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Наименование</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ба тоҷикӣ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Button disabled={loading} type="submit">
              {loading ? <Loader2 className='animate-spin' /> : null}
              Создать
            </Button>
          </form>
        </Form>

      </Main>
    </>
  )
}
