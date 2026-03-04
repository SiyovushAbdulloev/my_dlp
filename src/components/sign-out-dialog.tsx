import { useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { logout } from '@/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [outing, setOuting] = useState<boolean>(false)
  const { auth } = useAuthStore()

  const handleSignOut = async () => {
    setOuting(true)
    try {
      await logout()

      auth.setUser(null)
      // Preserve current location for redirect after sign-in
      const currentPath = location.href
      navigate({
        to: '/sign-in',
        search: { redirect: currentPath },
        replace: true,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setOuting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Выход'
      desc='Вы действительно хотите выйти?'
      confirmText='Выйти'
      cancelBtnText='Отмена'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
      isLoading={outing}
    />
  )
}
