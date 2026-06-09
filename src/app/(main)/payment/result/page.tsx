'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import PaymentReceipt from '@/components/checkout/PaymentReceipt'
import { useAuthStore } from '@/lib/store/auth'

function PaymentResultInner() {
  const searchParams = useSearchParams()
  const { token } = useAuthStore()
  const status = searchParams.get('status') ?? 'failed'
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen bg-bg-primary" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <AfiBreadcrumb
            items={[
              { label: 'خانه', href: '/' },
              { label: 'نتیجه پرداخت' },
            ]}
          />
        </div>
        <PaymentReceipt status={status} orderId={orderId} token={token} />
      </div>
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResultInner />
    </Suspense>
  )
}
