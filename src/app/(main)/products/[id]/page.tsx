import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProduct } from '@/lib/api/django'
import { getProductImages, pbImageUrl } from '@/lib/api/pocketbase'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import ImageSlider from '@/components/product/ImageSlider'
import AddToCartButton from '@/components/product/AddToCartButton'
import QuantitySelector from '@/components/product/QuantitySelector'
import ProductDetailClient from './ProductDetailClient'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, Truck, ShieldCheck, Headphones } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await getProduct(id)
    return {
      title: `${product.name} | ATI Farzam Iranian`,
      description: product.description?.slice(0, 155) ?? '',
    }
  } catch {
    return { title: 'محصول | ATI Farzam Iranian' }
  }
}

const FEATURES = [
  'ردیابی آنی با دقت بالا',
  'پشتیبانی از شبکه‌های ۲G/۳G/۴G',
  'عمر باتری طولانی',
  'ضدآب و مقاوم در برابر ضربه',
  'نصب آسان و سریع',
]

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let product: any
  try {
    product = await getProduct(id)
  } catch {
    notFound()
  }

  // تصاویر: اول PocketBase، بعد بک‌اند
  let images: string[] = []
  try {
    const pbImgs = await getProductImages(id)
    images = pbImgs.map((rec: any) => pbImageUrl(rec, rec.image))
  } catch { /* ignore */ }

  if (product.images && Array.isArray(product.images)) {
    images = [...images, ...product.images]
  }

  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0

  const features: string[] = product.features ?? FEATURES

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <AfiBreadcrumb
          items={[
            { label: 'خانه', href: '/' },
            { label: 'محصولات', href: '/products' },
            { label: product.name },
          ]}
        />
      </div>

      {/* محتوای اصلی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* چپ: اسلایدر تصاویر */}
        <div className="order-2 lg:order-1">
          <Suspense fallback={<Skeleton className="aspect-square rounded-2xl w-full" />}>
            <ImageSlider images={images} productName={product.name} />
          </Suspense>
        </div>

        {/* راست: اطلاعات */}
        <div className="order-1 lg:order-2 flex flex-col gap-6">
          {/* نام */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary leading-tight mb-2">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-xs text-text-tertiary">کد محصول: {product.sku}</p>
            )}
          </div>

          {/* وضعیت موجودی */}
          <div>
            {product.in_stock !== false ? (
              <Badge className="bg-success/10 text-success border border-success/20 text-sm px-3 py-1">
                ✓ موجود در انبار
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                ناموجود
              </Badge>
            )}
          </div>

          {/* قیمت */}
          <div className="bg-bg-secondary rounded-2xl p-5 border border-border-default">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-navy">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <>
                  <Badge className="bg-amber text-white border-0 font-bold">
                    {discountPercent}٪ تخفیف
                  </Badge>
                  <span className="text-text-tertiary text-sm line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p className="text-success text-sm mt-1 font-medium">
                {formatPrice(product.compare_price - product.price)} صرفه‌جویی
              </p>
            )}
          </div>

          {/* ویژگی‌ها */}
          {features.length > 0 && (
            <div>
              <h3 className="font-semibold text-text-primary mb-3 text-sm">ویژگی‌های کلیدی</h3>
              <ul className="space-y-2">
                {features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-navy flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* تعداد + افزودن به سبد */}
          <ProductDetailClient product={product} images={images} />

          {/* ضمانت‌ها */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: 'ارسال سریع' },
              { icon: ShieldCheck, label: 'ضمانت اصالت' },
              { icon: Headphones, label: 'پشتیبانی ۲۴/۷' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 bg-bg-secondary rounded-xl p-3 border border-border-default text-center"
              >
                <Icon className="w-5 h-5 text-navy" />
                <span className="text-xs text-text-secondary font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* توضیحات */}
      {product.description && (
        <div className="mt-12 border-t border-border-default pt-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">توضیحات محصول</h2>
          <p className="text-text-secondary leading-8 whitespace-pre-wrap text-sm">
            {product.description}
          </p>
        </div>
      )}
    </div>
  )
}
