'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingBag, MapPin, Lock, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/auth'

const NAV_ITEMS = [
  { href: '/profile',                 label: 'اطلاعات حساب',  icon: User       },
  { href: '/profile/orders',          label: 'سفارشات من',    icon: ShoppingBag },
  { href: '/profile/addresses',       label: 'آدرس‌ها',       icon: MapPin     },
  { href: '/profile/change-password', label: 'تغییر رمز',    icon: Lock       },
]

function initials(name?: string | null): string {
  if (!name) return 'کا'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0] ?? 'کا'
  return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-bg-primary" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-border-default overflow-hidden shadow-sm">

              {/* User info */}
              <div className="p-5 bg-gradient-to-br from-navy/5 to-teal/5 border-b border-border-default">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-navy text-white">
                    <AvatarFallback className="bg-navy text-white font-bold text-sm">
                      {initials(user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary text-sm truncate">
                      {user?.full_name || 'کاربر'}
                    </p>
                    <p className="text-text-tertiary text-xs mt-0.5 dir-ltr text-right">
                      {user?.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = href === '/profile'
                    ? pathname === '/profile'
                    : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        'border-r-[3px]',
                        active
                          ? 'bg-navy/8 text-navy border-navy'
                          : 'text-text-secondary border-transparent hover:bg-bg-secondary hover:text-text-primary'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="p-3 border-t border-border-default">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-error hover:bg-error/8 hover:text-error text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج از حساب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>خروج از حساب</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-error hover:bg-error/90 text-white"
                      >
                        بله، خارج شو
                      </AlertDialogAction>
                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
