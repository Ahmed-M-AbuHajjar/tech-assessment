'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { handleSignOut } from '@/lib/actions/auth'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="border-b mx-4">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold text-xl">
            Blurr.so | HR Portal
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {!session && pathname !== "/login" && pathname !== "/register" && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}

        {session?.user && (
          <div className="flex gap-2 items-center">
            <span className="text-sm mr-2">{session.user.name || session.user.email}</span>
            <form action={handleSignOut}>
              <Button variant="outline" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
} 