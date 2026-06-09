'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import OrderStatusBadge from '@/components/profile/OrderStatusBadge'
import { useAuthStore } from '@/lib/store/auth'
import { getOrders } from '@/lib/api/django'
import { formatPrice, formatDate } from '@/lib/utils'

export default function OrdersPage() {
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getOrders(token)
      .then(setOrders)
      .catch(() => setError('خطا در بارگذاری سفارشات'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>سفارشات من</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-error">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 flex flex-col items-center gap-4">
          <ShoppingBag className="w-16 h-16 text-text-tertiary" />
          <p className="text-text-secondary font-medium">هنوز سفارشی ندارید</p>
          <p className="text-text-tertiary text-sm">محصولات GPS ما را کشف کنید</p>
          <Button asChild className="bg-navy hover:bg-navy-dark text-white mt-2">
            <Link href="/products">مشاهده محصولات</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-text-primary">سفارشات من</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شماره سفارش</TableHead>
                <TableHead className="text-right">تاریخ</TableHead>
                <TableHead className="text-right">مبلغ کل</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">جزئیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-bg-secondary/50"
                >
                  <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                  <TableCell className="text-text-secondary text-sm">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="font-semibold text-navy text-sm">
                    {formatPrice(order.total_price ?? order.total ?? 0)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-navy">
                      <Link href={`/profile/orders/${order.id}`}>
                        مشاهده
                        <ChevronLeft className="w-3 h-3" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border-default">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/profile/orders/${order.id}`}
              className="flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="font-mono text-sm text-text-primary">#{order.id}</p>
                <p className="text-xs text-text-tertiary">{formatDate(order.created_at)}</p>
                <p className="text-sm font-semibold text-navy">
                  {formatPrice(order.total_price ?? order.total ?? 0)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <OrderStatusBadge status={order.status} />
                <ChevronLeft className="w-4 h-4 text-text-tertiary" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
