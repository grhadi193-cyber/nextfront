'use client'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCartStore } from '@/lib/store/cart'

export default function CartPage() {
  const { items, totalCount, totalPrice } = useCartStore()
  const count = totalCount()
  const total = totalPrice()

  return (
    <div className="min-h-screen bg-bg-primary" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <AfiBreadcrumb items={[{ label: 'خانه', href: '/' }, { label: 'سبد خرید' }]} />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-8">
          سبد خرید
          {count > 0 && (
            <span className="mr-2 text-base font-normal text-text-secondary">
              ({count} کالا)
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-text-tertiary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">سبد خرید شما خالی است</h2>
              <p className="text-text-secondary text-sm">محصولات مورد نظرتان را به سبد اضافه کنید</p>
            </div>
            <Button asChild className="bg-navy hover:bg-navy-dark text-white px-8">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CartSummary total={total} count={count} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
