'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, PackageX } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductSkeletonGrid } from '@/components/product/ProductSkeleton'
import AfiPagination from '@/components/shared/Pagination'

interface Category {
  id: number | string
  name: string
}

interface Product {
  id: string | number
  name: string
  price: number
  compare_price?: number
  in_stock?: boolean
}

interface ProductsClientProps {
  initialProducts: Product[]
  initialTotal: number
  initialTotalPages: number
  categories: Category[]
  pbImageMap: Record<string, string>
  initialPage: number
  initialCategory: string
  initialSearch: string
}

const PAGE_SIZE = 12
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function ProductsClient({
  initialProducts,
  initialTotal,
  initialTotalPages,
  categories,
  pbImageMap,
  initialPage,
  initialCategory,
  initialSearch,
}: ProductsClientProps) {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [page, setPage] = useState(initialPage)

  // debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(t)
  }, [search])

  // track if it's the first render (skip fetch — server already loaded initial data)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const controller = new AbortController()

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('page_size', String(PAGE_SIZE))
        if (activeCategory) params.set('category_id', activeCategory)
        if (debouncedSearch) params.set('search', debouncedSearch)

        const res = await fetch(`${API_URL}/api/products?${params}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const list: Product[] = Array.isArray(data) ? data : (data.results ?? [])
        const count: number = data.count ?? list.length
        setProducts(list)
        setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)))
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error('Products fetch error:', err)
        // در صورت خطا محصولات فعلی را نگه دار
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    return () => controller.abort()
  }, [page, activeCategory, debouncedSearch])

  // sync URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (activeCategory) params.set('category', activeCategory)
    if (debouncedSearch) params.set('search', debouncedSearch)
    const qs = params.toString()
    router.replace(`/products${qs ? '?' + qs : ''}`, { scroll: false })
  }, [page, activeCategory, debouncedSearch, router])

  const handleCategory = (catId: string) => {
    setActiveCategory(catId)
    setPage(1)
  }

  const handlePageChange = (pg: number) => {
    setPage(pg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* جستجو */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="جستجوی محصول..."
          className="pr-9 bg-white border-border-default focus-visible:ring-navy"
        />
      </div>

      {/* دسته‌بندی‌ها */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategory('')}
            className={activeCategory === '' ? 'bg-navy hover:bg-navy/90' : 'border-border-default'}
          >
            همه
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === String(cat.id) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategory(String(cat.id))}
              className={activeCategory === String(cat.id) ? 'bg-navy hover:bg-navy/90' : 'border-border-default'}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      )}

      {/* محتوا */}
      {loading ? (
        <ProductSkeletonGrid count={PAGE_SIZE} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-text-secondary">
          <PackageX className="w-16 h-16 text-border-default" />
          <p className="text-lg font-medium">محصولی یافت نشد</p>
          <p className="text-sm">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={pbImageMap[String(product.id)]}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <AfiPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
