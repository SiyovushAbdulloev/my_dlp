import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { create } from '@/api/dictionaries/regions'
import { applyValidationErrors } from '@/lib/applyValidationErrors.ts'
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

export const regionFormSchema = z.object({
  name_ru: z
    .string({ message: 'Наименование на русском обязательно' })
    .min(1, 'Наименование на русском обязательно'),
  name_tj: z
    .string({ message: 'Наименование на таджикском обязательно' })
    .min(1, 'Наименование на таджикском обязательно'),
  name_en: z
    .string({ message: 'Наименование на английском обязательно' })
    .min(1, 'Наименование на английском обязательно'),
})

export type RegionForm = z.infer<typeof regionFormSchema>

const defaultLang = 'en'

export function RegionsCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<RegionForm>({
    resolver: zodResolver(regionFormSchema),
  })

  const onSubmit = async (data: RegionForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Регион успешно создан')
      navigate({ to: '/dictionaries/regions' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      if (!applyValidationErrors(form, err)) {
        toast.error('Ошибка запроса')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <AdminFormCard
          title='Создать регион'
          backTo='/dictionaries/regions'
          actionText='Создать'
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
