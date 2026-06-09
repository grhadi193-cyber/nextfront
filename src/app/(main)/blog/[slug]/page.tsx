import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlog, getBlogs, pbImageUrl } from '@/lib/api/pocketbase'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import BlogCard from '@/components/blog/BlogCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post: any = await getBlog(slug)
    return {
      title: `${post.title} | وبلاگ آتی فرزام`,
      description: post.summary ?? post.title,
      openGraph: {
        title: post.title,
        description: post.summary ?? '',
        locale: 'fa_IR',
        type: 'article',
      },
    }
  } catch {
    return { title: 'مقاله | وبلاگ آتی فرزام' }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params

  let post: any
  try {
    post = await getBlog(slug)
  } catch {
    notFound()
  }

  // پست‌های مرتبط
  let relatedPosts: any[] = []
  try {
    const related = await getBlogs(1, 4)
    relatedPosts = related.items.filter((p: any) => p.id !== post.id).slice(0, 3)
  } catch {
    // اگر خطا داشت، بدون پست مرتبط نمایش می‌دهیم
  }

  const coverSrc = post.cover ? pbImageUrl(post, post.cover) : null

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <AfiBreadcrumb
            items={[
              { label: 'خانه', href: '/' },
              { label: 'وبلاگ', href: '/blog' },
              { label: post.title },
            ]}
          />
        </div>

        <div className="max-w-3xl mx-auto">
          {/* تصویر کاور */}
          {coverSrc && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-md">
              <Image
                src={coverSrc}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
                unoptimized
              />
            </div>
          )}

          {/* عنوان و متا */}
          <h1 className="text-3xl md:text-4xl font-black text-text-primary leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-text-secondary mb-8 pb-6 border-b border-border-default">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            )}
          </div>

          {/* خلاصه */}
          {post.summary && (
            <p className="text-base text-text-secondary leading-relaxed bg-bg-secondary rounded-xl p-5 mb-8 border-r-4 border-navy">
              {post.summary}
            </p>
          )}

          {/* محتوای اصلی */}
          <div
            className="prose prose-lg max-w-none text-text-primary leading-8
              prose-headings:text-text-primary prose-headings:font-bold
              prose-a:text-navy prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-r-4 prose-blockquote:border-navy prose-blockquote:pr-4 prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>

        {/* پست‌های مرتبط */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border-default">
            <SectionTitle title="مقالات مرتبط" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p: any) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
