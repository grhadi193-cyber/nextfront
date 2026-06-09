'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Printer } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice, formatDate } from '@/lib/utils'
import { getOrder } from '@/lib/api/django'

interface PaymentReceiptProps {
  status: string
  orderId: string | null
  token: string | null
}

export default function PaymentReceipt({ status, orderId, token }: PaymentReceiptProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const isPaid = status === 'paid'

  useEffect(() => {
    if (isPaid && orderId && token) {
      setLoading(true)
      getOrder(token, orderId)
        .then(setOrder)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isPaid, orderId, token])

  if (isPaid) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 className="w-24 h-24 text-success" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-text-primary mb-2">پرداخت موفق!</h1>
          <p className="text-text-secondary">سفارش شما با موفقیت ثبت شد</p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-lg print:shadow-none"
        >
          <Card className="border-success/20 shadow-lg print:shadow-none print:border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-tertiary">شماره سفارش</p>
                  <p className="font-bold text-navy text-lg">#{orderId}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-text-tertiary">تاریخ</p>
                  <p className="font-medium text-text-primary text-sm">
                    {order?.created_at ? formatDate(order.created_at) : formatDate(new Date().toISOString())}
                  </p>
                </div>
              </div>

              <Separator />

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : order?.items?.length ? (
                <div className="space-y-3">
                  <p className="font-semibold text-text-primary text-sm">اقلام سفارش</p>
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.product?.image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product?.name ?? ''}
                            fill
                            className="object-contain p-0.5"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary line-clamp-1">
                          {item.product?.name ?? item.name}
                        </p>
                        <p className="text-text-tertiary text-xs">× {item.quantity}</p>
                      </div>
                      <p className="text-navy font-semibold text-sm flex-shrink-0">
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {(order?.address || order?.shipping_method) && (
                <>
                  <Separator />
                  {order?.address && (
                    <div>
                      <p className="text-xs text-text-tertiary mb-1">آدرس تحویل</p>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {order.address.province?.name} — {order.address.city?.name} — {order.address.street}
                      </p>
                    </div>
                  )}
                  {order?.shipping_method && (
                    <div>
                      <p className="text-xs text-text-tertiary mb-1">روش ارسال</p>
                      <p className="text-text-secondary text-xs">{order.shipping_method.name}</p>
                    </div>
                  )}
                </>
              )}

              {order?.total_price && (
                <>
                  <Separator />
                  <div className="flex justify-between font-bold text-text-primary text-base">
                    <span>جمع کل پرداخت‌شده</span>
                    <span className="text-success">{formatPrice(order.total_price)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center print:hidden">
          <Button asChild className="bg-navy hover:bg-navy-dark text-white gap-2">
            <Link href="/profile/orders">مشاهده سفارشات</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">ادامه خرید</Link>
          </Button>
          <Button
            variant="ghost"
            className="gap-2 text-text-secondary"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            چاپ رسید
          </Button>
        </div>
      </div>
    )
  }

  // Failed state
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <XCircle className="w-24 h-24 text-error" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-text-primary mb-2">پرداخت ناموفق</h1>
        <p className="text-text-secondary mb-2">متأسفانه پرداخت انجام نشد</p>
        <p className="text-success text-sm font-medium bg-success/10 rounded-xl px-4 py-2 inline-block">
          مبلغی از حساب شما کسر نشده است
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild className="bg-navy hover:bg-navy-dark text-white">
          <Link href="/checkout">تلاش مجدد</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cart">بازگشت به سبد خرید</Link>
        </Button>
      </div>
    </div>
  )
}
