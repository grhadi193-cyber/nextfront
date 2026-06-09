'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, LogOut, Menu, MapPin, Settings } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'
import MobileMenu from './MobileMenu'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',          label: 'خانه' },
  { href: '/products',  label: 'محصولات' },
  { href: '/software',  label: 'نرم‌افزار' },
  { href: '/blog',      label: 'وبلاگ' },
  { href: '/about',     label: 'درباره ما' },
  { href: '/contact',   label: 'تماس با ما' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalCount = useCartStore((s) => s.totalCount())
  const { user, token, logout } = useAuthStore()

  // نام نمایشی: full_name یا phone_number
  const displayName = user?.full_name || user?.phone_number || ''

  return (
    <>
      <header className="sticky top-0 z-[300] bg-white border-b border-border-default shadow-sm">
        <div className="container mx-auto px-4 h-[var(--navbar-height)] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-deeper to-navy flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-text-primary leading-tight">آتی فرزام ایرانیان</p>
              <p className="text-[10px] text-text-tertiary leading-tight">سیستم‌های ردیابی GPS</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors relative',
                    isActive
                      ? 'text-navy font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 right-3 left-3 h-0.5 bg-navy rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-navy"
              aria-label="سبد خرید"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalCount > 99 ? '۹۹+' : totalCount.toLocaleString('fa-IR')}
                </span>
              )}
            </Link>

            {/* Auth */}
            {token && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-navy">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                      {displayName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      پروفایل
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      سفارش‌ها
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-error focus:text-error flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-dark transition-colors shadow-navy"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">ورود</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary"
              onClick={() => setMobileOpen(true)}
              aria-label="منو"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
