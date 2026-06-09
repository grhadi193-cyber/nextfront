'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import QuantitySelector from '@/components/product/QuantitySelector'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import type { CartItem as CartItemType } from '@/lib/store/cart'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <Card className="flex gap-4 p-4 items-start">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0 border border-border-default">
        <Image
          src={item.imageUrl || '/placeholder-product.svg'}
          alt={item.name}
          fill
          className="object-contain p-1"
          sizes="96px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary text-sm leading-relaxed line-clamp-2 mb-2">
          {item.name}
        </h3>
        <p className="text-text-secondary text-xs mb-3">
          قیمت واحد: {formatPrice(item.price)}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.product_id, qty)}
          />
          <p className="font-bold text-navy text-base">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-text-tertiary hover:text-error hover:bg-error/10 flex-shrink-0"
        onClick={() => removeItem(item.product_id)}
        aria-label="حذف از سبد"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  )
}
