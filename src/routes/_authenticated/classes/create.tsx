import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { ClassesCreate } from '@/features/classes/create.tsx'

export const Route = createFileRoute('/_authenticated/classes/create')({
  component: ClassesCreate,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'school_classes')
    }
  },
})
