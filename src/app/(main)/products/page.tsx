import { Suspense } from 'react'
import { getProducts, getCategories } from '@/lib/api/django'
import { getProductImages, pbImageUrl } from '@/lib/api/pocketbase'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import ProductsClient from './ProductsClient'
import { ProductSkeletonGrid } from '@/components/product/ProductSkeleton'

export const metadata = {
  title: 'محصولات | ATI Farzam Iranian',
  description: 'ردیاب GPS حرفه‌ای برای خودرو، موتورسیکلت و ناوگان',
}

export const dynamic = 'force-dynamic'

async function prefetchImages(products: any[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {}
  await Promise.allSettled(
    products.map(async (p) => {
      try {
        const imgs = await getProductImages(String(p.id))
        if (imgs.length > 0) {
          // ✅ FIX: imgs[0] یه RecordModel کامل PocketBase هست که collectionId داره
          // pbImageUrl باید record کامل و filename رو بگیره
          map[String(p.id)] = pbImageUrl(imgs[0], imgs[0].image)
        }
      } catch { /* ignore */ }
    })
  )
  return map
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page ?? 1))
  const category = sp.category ?? ''
  const search = sp.search ?? ''

  const params: Record<string, string | number> = { page, page_size: 12 }
  if (category) params.category_id = category
  if (search) params.search = search

  let products: any[] = []
  let totalCount = 0
  let categories: any[] = []

  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(params),
      getCategories(),
    ])
    const list = Array.isArray(productsData) ? productsData : (productsData.results ?? [])
    totalCount = productsData.count ?? list.length
    products = list
    categories = categoriesData ?? []
  } catch (err) {
    console.error('Products fetch error:', err)
  }

  const pbImageMap = await prefetchImages(products)
  const totalPages = Math.max(1, Math.ceil(totalCount / 12))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <AfiBreadcrumb items={[{ label: 'خانه', href: '/' }, { label: 'محصولات' }]} />
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">محصولات</h1>
        <p className="text-text-secondary text-sm mt-1">ردیاب GPS حرفه‌ای برای انواع کاربردها</p>
      </div>
      <Suspense fallback={<ProductSkeletonGrid />}>
        <ProductsClient
          initialProducts={products}
          initialTotal={totalCount}
          initialTotalPages={totalPages}
          categories={categories}
          pbImageMap={pbImageMap}
          initialPage={page}
          initialCategory={category}
          initialSearch={search}
        />
      </Suspense>
    </div>
  )
}
