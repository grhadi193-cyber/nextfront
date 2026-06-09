import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { pbImageUrl } from '@/lib/api/pocketbase'

interface BlogCardProps {
  post: {
    id: string
    slug: string
    title: string
    summary?: string
    cover?: string
    created: string
    author?: string
    tags?: string[]
  }
  className?: string
}

export default function BlogCard({ post, className }: BlogCardProps) {
  const coverSrc = post.cover ? pbImageUrl(post, post.cover) : null

  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-xl border-border-default bg-white',
        'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
        className
      )}
    >
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

      <CardContent className="p-5 flex flex-col gap-3">
        {/* تاریخ */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDate(post.created)}</span>
          {post.author && (
            <>
              <span className="mx-1">·</span>
              <span>{post.author}</span>
            </>
          )}
        </div>

        {/* عنوان */}
        <h3 className="text-base font-bold text-text-primary leading-snug line-clamp-2 group-hover:text-navy transition-colors">
          {post.title}
        </h3>

        {/* خلاصه */}
        {post.summary && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        )}

        {/* تگ‌ها */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5 bg-navy/10 text-navy border-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <Button variant="outline" size="sm" asChild className="w-full border-navy text-navy hover:bg-navy hover:text-white">
          <Link href={`/blog/${post.slug}`}>ادامه مطلب</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
