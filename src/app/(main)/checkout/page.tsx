'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import StepIndicator from '@/components/checkout/StepIndicator'
import AddressStep from '@/components/checkout/AddressStep'
import ShippingStep from '@/components/checkout/ShippingStep'
import ConfirmStep from '@/components/checkout/ConfirmStep'
import { useAuthStore } from '@/lib/store/auth'
import { useCartStore } from '@/lib/store/cart'

export default function CheckoutPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const { items } = useCartStore()

  const [step, setStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(null)

  if (!token) {
    router.replace('/login?redirect=/checkout')
    return null
  }

  if (items.length === 0) {
    router.replace('/cart')
    return null
  }

  const handleAddressSelect = (id: number, addressObj?: any) => {
    setSelectedAddressId(id)
    if (addressObj) setSelectedAddress(addressObj)
  }

  const handleAddressNext = () => {
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-bg-primary" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <AfiBreadcrumb
            items={[
              { label: 'خانه', href: '/' },
              { label: 'سبد خرید', href: '/cart' },
              { label: 'تکمیل سفارش' },
            ]}
          />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-8 text-center">تکمیل سفارش</h1>

        <StepIndicator currentStep={step} />

        {step === 1 && (
          <AddressStep
            token={token}
            selectedId={selectedAddressId}
            onSelect={handleAddressSelect}
            onNext={handleAddressNext}
          />
        )}

        {step === 2 && selectedAddressId && (
          <ShippingStep
            addressId={selectedAddressId}
            selectedMethodId={selectedShippingMethod?.id ?? null}
            onSelect={(method) => setSelectedShippingMethod(method)}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && selectedShippingMethod && (
          <ConfirmStep
            token={token}
            address={selectedAddress ?? { id: selectedAddressId }}
            shippingMethod={selectedShippingMethod}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  )
}
