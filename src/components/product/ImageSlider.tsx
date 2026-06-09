'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLACEHOLDER = '/placeholder-product.svg'

interface ImageSliderProps {
  images: string[]
  productName: string
}

function isValidSrc(src: string | undefined | null): boolean {
  return typeof src === 'string' && src.trim().length > 0
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
  const validImages = images.filter(isValidSrc)
  const safeImages = validImages.length > 0 ? validImages : [PLACEHOLDER]

  const [activeIdx, setActiveIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const total = safeImages.length
  const prev = () => setActiveIdx((i) => (i - 1 + total) % total)
  const next = () => setActiveIdx((i) => (i + 1) % total)

  const currentSrc = safeImages[activeIdx] ?? PLACEHOLDER

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* تصویر اصلی */}
      <div
        className="relative bg-bg-secondary rounded-2xl overflow-hidden aspect-square border border-border-default group cursor-zoom-in"
        onClick={() => setZoomed((z) => !z)}
      >
        <Image
          src={currentSrc}
          alt={`${productName} — تصویر ${activeIdx + 1}`}
          fill
          className={cn(
            'object-contain p-6 transition-transform duration-300',
            zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized={currentSrc === PLACEHOLDER}
        />

        {/* دکمه‌های ناوبری */}
        {total > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 border-border-default shadow-sm hover:bg-navy hover:text-white hover:border-navy"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 border-border-default shadow-sm hover:bg-navy hover:text-white hover:border-navy"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
              {activeIdx + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 justify-center flex-wrap">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'relative w-16 h-16 rounded-lg border-2 overflow-hidden bg-bg-secondary flex-shrink-0 transition-all',
                idx === activeIdx
                  ? 'border-navy ring-2 ring-navy/30'
                  : 'border-border-default hover:border-teal'
              )}
            >
              <Image
                src={src}
                alt={`thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
                unoptimized={src === PLACEHOLDER}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
