'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'

interface AddToCartButtonProps {
  product: {
    id: string | number
    name: string
    price: number
  }
  quantity: number
  imageUrl?: string
  inStock?: boolean
}

export default function AddToCartButton({ product, quantity, imageUrl, inStock = true }: AddToCartButtonProps) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/products/${product.id}`)
      return
    }

    addItem({
      product_id: String(product.id),
      name: product.name,
      price: product.price,
      quantity,
      imageUrl,
    })

    setAdded(true)
    toast.success(`«${product.name}» به سبد خرید اضافه شد`, {
      description: `تعداد: ${quantity} عدد`,
      duration: 3000,
    })
    setTimeout(() => setAdded(false), 2500)
  }

  if (!inStock) {
    return (
      <Button disabled className="w-full h-12 text-base rounded-xl" size="lg">
        ناموجود
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAdd}
      className="w-full h-12 text-base rounded-xl bg-navy hover:bg-navy/90 gap-2 transition-all"
      size="lg"
    >
      {added ? (
        <>
          <CheckCircle className="w-5 h-5" />
          افزوده شد
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          افزودن به سبد خرید
        </>
      )}
    </Button>
  )
}
