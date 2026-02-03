import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/schools/$schoolId.edit.tsx'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/dictionaries/regions'
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
import {
  type SchoolForm,
  schoolFormSchema,
} from '@/features/schools/create.tsx'

const defaultLang = 'en'

export function SchoolsEdit() {
  const navigate = useNavigate()
  const { school } = Route.useRouteContext()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<SchoolForm>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: {
        en: school.name_en,
        ru: school.name_ru,
        tg: school.name_tg,
      },
    },
  })

  const onSubmit = async (data: SchoolForm) => {
    setLoading(true)
    try {
      await edit(school.id, data)
      form.reset()
      toast.success('Школа успешно изменена')
      navigate({ to: '/schools' })
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
          <h1>Редактировать школу</h1>
          <Button onClick={() => navigate({ to: '/dictionaries/regions' })}>
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
