import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/subject-class/$subjectClassId.edit'
import { type Item } from '@/types/subject_class.ts'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/subject-class'
import { applyValidationErrors } from '@/lib/applyValidationErrors.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { MultiSelect } from '@/components/ui/multi-select.tsx'
import { Main } from '@/components/layout/main'
import { SelectDropdown } from '@/components/select-dropdown.tsx'
import {
  type SubjectClassForm,
  subjectClassFormSchema,
} from '@/features/subject-class/create.tsx'

export function SubjectClassEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { subjects, classes, subject } = Route.useRouteContext()
  const row = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    return Object.keys(subject).map((key) => subject[key])
  }, [subject])

  const form = useForm<SubjectClassForm>({
    resolver: zodResolver(subjectClassFormSchema),
    defaultValues: {
      class_id: row[0].items[0].class.id,
      subject_ids: row[0].items.map((item: Item) => item.subject.id),
    },
  })

  const onSubmit = async (data: SubjectClassForm) => {
    setLoading(true)
    try {
      await edit(data)
      form.reset()
      toast.success('Предмет-класс успешно редактирован')
      navigate({ to: '/subject-class' })
    } catch (err) {
      if (!applyValidationErrors(form, err)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <header className={'flex items-center justify-between'}>
          <h1>Прикрепить класс предмету</h1>
          <Button onClick={() => navigate({ to: '/subject-class' })}>
            <ArrowLeft size={18} />
            Назад
          </Button>
        </header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 px-4'
          >
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='class_id'
                render={({ field }) => (
                  <FormItem className={'w-full'}>
                    <FormLabel className={'!w-full'}>Класс</FormLabel>
                    <SelectDropdown
                      className={'!w-full'}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Выберите класс'
                      items={classes.data.map((cl) => ({
                        value: cl.id,
                        label: `${cl.number} ${cl.letter}`,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subject_ids'
                render={({ field }) => (
                  <FormItem className={'w-full'}>
                    <FormLabel className={'!w-full'}>Предметы</FormLabel>
                    <MultiSelect
                      placeholder={'Выберите предметы'}
                      options={subjects.data.map((s) => ({
                        value: s.id,
                        label: s.title.ru,
                      }))}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={loading} type='submit'>
              {loading ? <Loader2 className='animate-spin' /> : null}
              Редактировать
            </Button>
          </form>
        </Form>
      </Main>
    </>
  )
}
