import type { Metadata } from 'next'
import { getDjangoBlogs, type DjangoBlogPost } from '@/lib/api/django'
import SectionTitle from '@/components/shared/SectionTitle'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'وبلاگ | آتی فرزام ایرانیان',
  description: 'آخرین مقالات، اخبار و راهنماهای ردیاب GPS از تیم آتی فرزام ایرانیان',
}

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function BlogCard({ post }: { post: DjangoBlogPost }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
  // featured_image از Django میاد — اگه relative path باشه base رو ضمیمه کن
  const coverSrc = post.featured_image
    ? post.featured_image.startsWith('http')
      ? post.featured_image
      : `${apiBase}${post.featured_image}`
    : null

  return (
    <div className="group overflow-hidden rounded-xl border border-border-default bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* تصویر کاور */}
      <div className="relative aspect-[16/9] bg-bg-secondary overflow-hidden">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy/10 to-teal/10 flex items-center justify-center">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* تاریخ */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDate(post.published_at ?? post.created_at)}</span>
        </div>

        {/* عنوان */}
        <h3 className="text-base font-bold text-text-primary leading-snug line-clamp-2 group-hover:text-navy transition-colors">
          {post.title}
        </h3>

        <div className="mt-auto pt-3">
          <Button variant="outline" size="sm" asChild className="w-full border-navy text-navy hover:bg-navy hover:text-white">
            <Link href={`/blog/${post.slug}`}>ادامه مطلب</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default async function BlogPage() {
  let posts: DjangoBlogPost[] = []
  let error = false

  try {
    posts = await getDjangoBlogs()
  } catch {
    error = true
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* هدر */}
      <div className="bg-gradient-to-l from-navy to-teal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">وبلاگ</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            آخرین مقالات، اخبار و راهنماهای تخصصی ردیابی خودرو
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <SectionTitle title="جدیدترین مطالب" />

        {error && (
          <div className="text-center py-24 text-text-secondary">
            <p className="text-lg">خطا در دریافت مقالات. لطفاً مطمئن شوید بک‌اند روشن است.</p>
          </div>
        )}

        {!error && posts.length === 0 && (
          <div className="text-center py-24 text-text-secondary">
            <p className="text-lg">هنوز مقاله‌ای منتشر نشده است.</p>
          </div>
        )}

        {!error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
