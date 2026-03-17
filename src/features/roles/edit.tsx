import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/roles/$roleId.edit.tsx'
import { type Permission } from '@/types/role.ts'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { edit } from '@/api/roles'
import { applyValidationErrors } from '@/lib/applyValidationErrors.ts'
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
import { type RoleForm, roleFormSchema } from '@/features/roles/create.tsx'

export function RolesEdit() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = React.useState(false)
  const { permissions: groups, role } = Route.useRouteContext()

  const form = useForm<RoleForm>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      description: role.description ?? '',
      permissions: [],
    },
  })

  // Flatten only real selectable permissions:
  // - children if parent has children
  // - parent itself if no children
  const normalizedGroups = React.useMemo(() => {
    return groups.data.map((g: Permission) => {
      const children = g.children ?? []

      if (children.length > 0) {
        return {
          id: String(g.name),
          title: g.description,
          items: children.map((p: Permission) => ({
            id: String(p.name),
            description: p.description,
          })),
        }
      }

      return {
        id: String(g.name),
        title: g.description,
        items: [
          {
            id: String(g.name),
            description: g.description,
          },
        ],
      }
    })
  }, [groups])

  const allIds = React.useMemo(() => {
    return normalizedGroups.flatMap((g) => g.items.map((i) => i.id))
  }, [normalizedGroups])

  // Fill selected permissions from backend role once groups are ready
  React.useEffect(() => {
    const rolePermissions =
      role.permissions?.map((p: { name: string }) => String(p.name)) ?? []

    const allowed = rolePermissions.filter((name: string) =>
      allIds.includes(name)
    )

    form.reset({
      description: role.description ?? '',
      permissions: allowed,
    })
  }, [role, allIds, form])

  const selected = form.watch('permissions')
  const selectedSet = React.useMemo(() => new Set(selected ?? []), [selected])

  const setSelected = (next: string[]) => {
    const set = new Set(next)
    const ordered = allIds.filter((id: string) => set.has(id))
    form.setValue('permissions', ordered, {
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
    if (selectedSet.has(id)) {
      setSelected((selected ?? []).filter((x) => x !== id))
    } else {
      setSelected([...(selected ?? []), id])
    }
  }

  const toggleMany = (ids: string[]) => {
    const s = tri(ids)

    if (s.checked) {
      setSelected((selected ?? []).filter((x) => !ids.includes(x)))
    } else {
      const next = [...(selected ?? [])]
      for (const id of ids) {
        if (!selectedSet.has(id)) next.push(id)
      }
      setSelected(next)
    }
  }

  const globalState = tri(allIds)

  const onSubmit = async (data: RoleForm) => {
    setSubmitting(true)
    try {
      await edit(role.id, data)
      toast.success('Роль успешно обновлена')
      navigate({ to: '/roles' })
    } catch (e) {
      if (!applyValidationErrors(form, e)) {
        toast.error('Не валидные данные')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Редактировать роль</h1>
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
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание роли</FormLabel>
                <FormControl>
                  <Input
                    disabled={role.is_systemic}
                    {...field}
                    placeholder='Например: Контент менеджер'
                  />
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
              {normalizedGroups.map((group) => {
                const groupIds = group.items.map((i) => i.id)
                const state = tri(groupIds)
                const selectedCount = groupIds.filter((id: string) =>
                  selectedSet.has(id)
                ).length

                return (
                  <div key={group.id} className='rounded-md border p-3'>
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
                            {group.title}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            Выбрано: {selectedCount} из {groupIds.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className='my-3' />

                    <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                      {group.items.map((item) => {
                        const checked = selectedSet.has(item.id)

                        return (
                          <label
                            key={item.id}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50',
                              checked && 'bg-muted'
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleOne(item.id)}
                            />
                            <span className='truncate'>{item.description}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <FormField
              control={form.control}
              name='permissions'
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
            Сохранить
          </Button>
        </form>
      </Form>
    </Main>
  )
}
