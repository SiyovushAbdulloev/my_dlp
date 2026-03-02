import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/roles/$roleId.edit.tsx'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { create } from '@/api/roles'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'

const roleFormSchema = z.object({
  name: z.string().min(1, 'Название роли обязательно'),
  permission_ids: z.array(z.string({ message: 'Права обязательны' }), {
    message: 'Права обязательны',
  }),
})

export type RoleForm = z.infer<typeof roleFormSchema>

export function RolesEdit() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = React.useState(false)
  const { permissions: groups, role } = Route.useRouteContext()

  const form = useForm<RoleForm>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role.name,
      permission_ids: role.permissions.map((p) => p.id),
    },
  })

  const selected = form.watch('permission_ids')
  const selectedSet = React.useMemo(() => new Set(selected ?? []), [selected])

  const allIds = React.useMemo(() => {
    const out: string[] = []
    for (const g of groups.data) {
      const children = g.children ?? []
      if (children.length > 0) {
        for (const p of children) out.push(String(p.id))
      } else {
        out.push(String(g.id))
      }
    }
    return out
  }, [groups])

  const setSelected = (next: string[]) => {
    const set = new Set(next)
    const ordered = allIds.filter((id) => set.has(id))
    form.setValue('permission_ids', ordered, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const tri = (ids: string[]) => {
    const checkedCount = ids.reduce(
      (acc, id) => acc + (selectedSet.has(id) ? 1 : 0),
      0
    )
    if (ids.length === 0) return { checked: false, indeterminate: false }
    if (checkedCount === 0) return { checked: false, indeterminate: false }
    if (checkedCount === ids.length)
      return { checked: true, indeterminate: false }
    return { checked: false, indeterminate: true }
  }

  const toggleOne = (id: string) => {
    if (selectedSet.has(id)) setSelected(selected?.filter((x) => x !== id))
    else setSelected([...(selected ?? []), id])
  }

  const toggleMany = (ids: string[]) => {
    const s = tri(ids)
    if (s.checked) {
      // uncheck all
      setSelected(selected?.filter((x) => !ids.includes(x)))
    } else {
      // check missing
      const next = [...(selected ?? [])]
      for (const id of ids) if (!selectedSet.has(id)) next.push(id)
      setSelected(next)
    }
  }

  const globalState = tri(allIds)

  const onSubmit = async (data: RoleForm) => {
    setSubmitting(true)
    try {
      await create(data)
      toast.success('Роль успешно изменена')
      navigate({ to: '/roles' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // console.error(e)
      toast.error('Не удалось изменить роль')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'> Редактировать роль</h1>
        <Button
          type='button'
          variant='outline'
          onClick={() => navigate({ to: '/roles' })}
        >
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название роли</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Например: content_manager' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='rounded-md border p-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <div className='text-sm font-medium'>Права</div>
                <div className='text-xs text-muted-foreground'>
                  Выбрано: {selected?.length} из {allIds.length}
                </div>
              </div>

              <label className='flex cursor-pointer items-center gap-2'>
                <Checkbox
                  checked={
                    globalState.indeterminate
                      ? 'indeterminate'
                      : globalState.checked
                  }
                  onCheckedChange={() => toggleMany(allIds)}
                />
                <span className='text-sm'>Выбрать все</span>
              </label>
            </div>

            <Separator className='my-4' />

            <div className='space-y-4'>
              {groups.data.map((g) => {
                const children = g.children ?? []
                const isGroup = children.length > 0

                const groupIds = isGroup
                  ? children.map((p) => String(p.id))
                  : [String(g.id)]

                const state = tri(groupIds)

                return (
                  <div key={String(g.id)} className='rounded-md border p-3'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='flex items-center gap-2'>
                        <Checkbox
                          checked={
                            state.indeterminate
                              ? 'indeterminate'
                              : state.checked
                          }
                          onCheckedChange={() => toggleMany(groupIds)}
                        />
                        <div className='flex flex-col'>
                          <span className='text-sm font-semibold'>
                            {g.description}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {isGroup
                              ? `Выбрано: ${groupIds.filter((id) => selectedSet.has(id)).length} из ${groupIds.length}`
                              : 'Одиночное право'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isGroup ? (
                      <>
                        <Separator className='my-3' />
                        <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                          {children.map((p) => {
                            const id = String(p.id)
                            const checked = selectedSet.has(id)

                            return (
                              <label
                                key={id}
                                className={cn(
                                  'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50',
                                  checked && 'bg-muted'
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => toggleOne(id)}
                                />
                                <span className='truncate'>
                                  {p.description}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>

            <FormField
              control={form.control}
              name='permission_ids'
              render={() => (
                <FormItem className='mt-4'>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={submitting}
            type='submit'
            className='w-full sm:w-auto'
          >
            {submitting ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : null}
            Редактировать
          </Button>
        </form>
      </Form>
    </Main>
  )
}
