import { useAuthStore } from '@/stores/auth-store.ts'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { ChangePasswordDialog } from '@/components/change-password.tsx'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  // const [openChangePassword, setOpenChangePassword] = useDialogState()
  const { auth } = useAuthStore()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={auth.user?.avatar} alt={auth.fullName()} />
              <AvatarFallback>{auth.fullName()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>
                {auth.fullName()}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {auth.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/*<DropdownMenuItem onClick={() => setOpenChangePassword(true)}>*/}
            {/*  Изменить пароль*/}
            {/*  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
            {/*</DropdownMenuItem>*/}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            Выйти
            <DropdownMenuShortcut className='text-current'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
      {/*<ChangePasswordDialog*/}
      {/*  open={!!openChangePassword}*/}
      {/*  onOpenChange={setOpenChangePassword}*/}
      {/*/>*/}
    </>
  )
}
