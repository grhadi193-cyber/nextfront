import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    compare_price?: number
    in_stock?: boolean
    slug?: string
  }
  imageUrl?: string
  variant?: 'grid' | 'featured'
}

export default function ProductCard({ product, imageUrl, variant = 'grid' }: ProductCardProps) {
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_price!) * 100)
    : 0

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="overflow-hidden border border-border-default rounded-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-navy)] bg-white h-full">
        {/* Image */}
        <div className={`relative bg-bg-secondary overflow-hidden ${variant === 'featured' ? 'h-64' : 'h-48'}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-border-default" />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="bg-amber text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {discountPercent}٪ تخفیف
              </Badge>
            )}
            {product.in_stock === false && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5 rounded-full">
                ناموجود
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-text-primary text-sm leading-6 line-clamp-2 mb-3 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-navy font-bold text-base">{formatPrice(product.price)}</p>
              {hasDiscount && (
                <p className="text-text-tertiary text-xs line-through">{formatPrice(product.compare_price!)}</p>
              )}
            </div>
            <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
