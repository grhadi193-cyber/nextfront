'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  total: number
  count: number
}

export default function CartSummary({ total, count }: CartSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-4">
        <h2 className="font-bold text-text-primary text-lg">خلاصه سبد</h2>
        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>تعداد اقلام</span>
            <span className="font-medium text-text-primary">{count} عدد</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>جمع محصولات</span>
            <span className="font-medium text-text-primary">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>هزینه ارسال</span>
            <span className="text-amber text-xs font-medium">پس از انتخاب آدرس</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-text-primary text-base">
          <span>جمع کل</span>
          <span className="text-navy">{formatPrice(total)}</span>
        </div>

        <Button asChild className="w-full bg-navy hover:bg-navy-dark text-white gap-2">
          <Link href="/checkout">
            ادامه و تکمیل سفارش
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full text-text-secondary">
          <Link href="/products">ادامه خرید</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
