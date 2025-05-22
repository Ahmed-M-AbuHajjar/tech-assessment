'use client'

import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface MonthSelectorProps {
  currentMonth: Date
}

export function MonthSelector({ currentMonth }: MonthSelectorProps) {
  const router = useRouter()

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = new URL(window.location.href)
    url.searchParams.set('month', e.target.value)
    router.push(url.toString())
  }

  return (
    <input
      type="month"
      defaultValue={format(currentMonth, 'yyyy-MM')}
      onChange={handleMonthChange}
      className="border rounded-md px-3 py-2 bg-white text-black"
    />
  )
} 