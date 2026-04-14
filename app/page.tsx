import { redirect } from 'next/navigation'

// Middleware handles language detection and redirect.
// This is a fallback in case middleware doesn't run.
export default function RootPage() {
  redirect('/en')
}
