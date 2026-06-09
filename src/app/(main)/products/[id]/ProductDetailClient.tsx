'use client'
import { useState } from 'react'
import QuantitySelector from '@/components/product/QuantitySelector'
import AddToCartButton from '@/components/product/AddToCartButton'

interface ProductDetailClientProps {
  product: {
    id: string | number
    name: string
    price: number
    in_stock?: boolean
    stock?: number
  }
  images: string[]
}

export default function ProductDetailClient({ product, images }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const maxQty = product.stock ?? 99

  return (
    <div className="flex flex-col gap-4">
      {product.in_stock !== false && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary font-medium">تعداد:</span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={maxQty}
          />
        </div>
      )}
      <AddToCartButton
        product={product}
        quantity={quantity}
        imageUrl={images[0]}
        inStock={product.in_stock !== false}
      />
    </div>
  )
}
