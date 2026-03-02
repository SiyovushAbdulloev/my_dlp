import { createFileRoute } from '@tanstack/react-router'
import { TeacherCourses } from '@/features/teacher-courses'

export const Route = createFileRoute('/_authenticated/teacher-courses/')({
  component: TeacherCourses,
})
