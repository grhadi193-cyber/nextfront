'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, MapPin, User, LogOut, ShoppingCart } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const NAV_LINKS = [
  { href: '/',          label: 'خانه' },
  { href: '/products',  label: 'محصولات' },
  { href: '/software',  label: 'نرم‌افزار' },
  { href: '/blog',      label: 'وبلاگ' },
  { href: '/about',     label: 'درباره ما' },
  { href: '/contact',   label: 'تماس با ما' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { user, token, logout } = useAuthStore()
  const totalCount = useCartStore((s) => s.totalCount())

  // بستن منو با تغییر مسیر
  useEffect(() => {
    onClose()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // بستن با ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // قفل scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[400] bg-black/50 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[500] w-[280px] bg-white shadow-xl transition-transform duration-300 lg:hidden flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-deeper to-navy flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text-primary text-sm">آتی فرزام ایرانیان</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-navy/10 text-navy font-semibold'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-border-default space-y-2">
          <Link
            href="/cart"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-bg-tertiary transition-colors text-text-primary text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              سبد خرید
            </div>
            {totalCount > 0 && (
              <span className="min-w-[20px] h-5 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {totalCount}
              </span>
            )}
          </Link>

          {token && user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-bg-tertiary transition-colors text-text-primary text-sm font-medium"
              >
                <User className="w-4 h-4" />
                {user.first_name ?? user.phone}
              </Link>
              <button
                onClick={() => { logout(); onClose() }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-error hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-dark transition-colors"
            >
              <User className="w-4 h-4" />
              ورود به حساب
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
