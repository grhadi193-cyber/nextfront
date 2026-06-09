'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import OrderStatusBadge from '@/components/profile/OrderStatusBadge'
import OrderTimeline from '@/components/profile/OrderTimeline'
import { useAuthStore } from '@/lib/store/auth'
import { getOrder, cancelOrder } from '@/lib/api/django'
import { formatPrice, formatDate } from '@/lib/utils'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuthStore()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getOrder(token, id)
      .then(setOrder)
      .catch(() => setError('خطا در بارگذاری سفارش'))
      .finally(() => setLoading(false))
  }, [token, id])

  const handleCancel = async () => {
    if (!token) return
    setCancelling(true)
    try {
      await cancelOrder(token, id)
      setOrder((o: any) => ({ ...o, status: 'cancelled' }))
      toast.success('سفارش با موفقیت لغو شد')
    } catch {
      toast.error('خطا در لغو سفارش')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-error">{error || 'سفارش یافت نشد'}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/profile/orders">بازگشت به سفارشات</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const provinceName = typeof order.address?.province === 'object'
    ? order.address?.province?.name
    : order.address?.province ?? ''
  const cityName = typeof order.address?.city === 'object'
    ? order.address?.city?.name
    : order.address?.city ?? ''

  return (
    <div className="space-y-5">
      <AfiBreadcrumb
        items={[
          { label: 'خانه',       href: '/'               },
          { label: 'سفارشات من', href: '/profile/orders' },
          { label: `سفارش #${order.id}` },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary">سفارش #{order.id}</h1>
          <p className="text-sm text-text-tertiary mt-1">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {order.status === 'pending' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-error border-error/40 hover:bg-error/8">
                  لغو سفارش
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>لغو سفارش #{order.id}</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-error hover:bg-error/90 text-white gap-2"
                  >
                    {cancelling && <Loader2 className="w-3 h-3 animate-spin" />}
                    بله، لغو کن
                  </AlertDialogAction>
                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: items + address + shipping */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <Card>
            <CardHeader><CardTitle className="text-base">اقلام سفارش</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">محصول</TableHead>
                    <TableHead className="text-right">تعداد</TableHead>
                    <TableHead className="text-right">قیمت واحد</TableHead>
                    <TableHead className="text-right">جمع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(order.items ?? []).map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="text-sm">
                        {item.product_name ?? item.name ?? `محصول ${item.product_id}`}
                      </TableCell>
                      <TableCell className="text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-sm">{formatPrice(item.price ?? item.unit_price ?? 0)}</TableCell>
                      <TableCell className="text-sm font-semibold text-navy">
                        {formatPrice((item.price ?? item.unit_price ?? 0) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t border-border-default space-y-2">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>جمع محصولات</span>
                  <span>{formatPrice(order.subtotal ?? 0)}</span>
                </div>
                {order.shipping_cost !== undefined && (
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>هزینه ارسال</span>
                    <span>{formatPrice(order.shipping_cost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-text-primary">
                  <span>جمع کل</span>
                  <span className="text-navy">{formatPrice(order.total_price ?? order.total ?? 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          {order.address && (
            <Card>
              <CardHeader><CardTitle className="text-base">آدرس تحویل</CardTitle></CardHeader>
              <CardContent>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {provinceName}{provinceName && cityName ? ' — ' : ''}{cityName}
                  {order.address.street ? ` — ${order.address.street}` : ''}
                </p>
                {order.address.postal_code && (
                  <p className="text-text-tertiary text-xs mt-1">
                    کد پستی: {order.address.postal_code}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Shipping tracking */}
          {order.tracking_code && (
            <Card>
              <CardHeader><CardTitle className="text-base">اطلاعات ارسال</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-text-secondary text-sm">کد رهگیری پستی</p>
                  <p className="font-mono font-semibold text-text-primary mt-1">
                    {order.tracking_code}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-2 text-teal border-teal/40">
                  <a
                    href={`https://tracking.post.ir/?code=${order.tracking_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    رهگیری مرسوله
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: timeline */}
        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">مراحل سفارش</CardTitle></CardHeader>
            <CardContent>
              <OrderTimeline
                currentStatus={order.status}
                history={order.history ?? order.status_history ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
