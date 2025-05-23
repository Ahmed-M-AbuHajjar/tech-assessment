'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
  },
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: Calendar,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">HR Management</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 