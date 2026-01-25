import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { changePassword } from '@/api/users'
import { toast } from 'sonner'

const schema = z
  .object({
    current_password: z.string().min(1, 'Введите текущий пароль'),
    new_password: z.string().min(6, 'Минимум 6 символов'),
    new_password_confirmation: z.string().min(1, 'Повторите новый пароль'),
  })
  .refine((v) => v.new_password === v.new_password_confirmation, {
    message: 'Пароли не совпадают',
    path: ['new_password_confirmation'],
  })

export type ChangePasswordForm = z.infer<typeof schema>

type ChangePasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [changing, setChanging] = React.useState<boolean>(false)
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  })

  React.useEffect(() => {
    if (!open) form.reset()
  }, [open, form])

  const handleSubmit = async (data: ChangePasswordForm) => {
    setChanging(true)
    try {
      await changePassword(data)
      toast.success('Пароль успешно изменен')
      onOpenChange(false)
    } finally {
      setChanging(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader>
          <DialogTitle>Изменить пароль</DialogTitle>
          <DialogDescription>
            Введите текущий пароль и задайте новый.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='current_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текущий пароль</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      autoComplete='current-password'
                      placeholder='••••••••'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='new_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      autoComplete='new-password'
                      placeholder='••••••••'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='new_password_confirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите новый пароль</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      autoComplete='new-password'
                      placeholder='••••••••'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={changing}
              >
                Отмена
              </Button>

              <Button type='submit' disabled={changing}>
                {changing ? (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                ) : null}
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
