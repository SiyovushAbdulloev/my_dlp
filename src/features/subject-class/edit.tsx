import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/_authenticated/subject-class/$subjectClassId.edit';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { create } from '@/api/subject-class';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { MultiSelect } from '@/components/ui/multi-select.tsx';
import { Main } from '@/components/layout/main';
import { SelectDropdown } from '@/components/select-dropdown.tsx';
import { type SubjectClassForm, subjectClassFormSchema } from '@/features/subject-class/create.tsx';



































export function SubjectClassEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const { subjects, classes, subject } = Route.useRouteContext()

  const form = useForm<SubjectClassForm>({
    resolver: zodResolver(subjectClassFormSchema),
    defaultValues: {
      class_id: subject.class_id,
      subject_ids: []
    }
  })

  const onSubmit = async (data: SubjectClassForm) => {
    setLoading(true)
    try {
      await create(data)
      form.reset()
      toast.success('Предмет-класс успешно редактирован')
      navigate({ to: '/subject-class' })
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
                      placeholder={"Выберите предметы"}
                      options={subjects.data.map((s) => ({
                        value: s.id,
                        label: s.name_ru,
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
              Создать
            </Button>
          </form>
        </Form>
      </Main>
    </>
  )
}
