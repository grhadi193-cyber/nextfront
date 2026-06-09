'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: string
  title: string
  subtitle?: string
  cta_label?: string
  cta_url?: string
  // ✅ FIX: دکمه دوم — فیلدهای اختیاری برای دکمه دوم
  cta2_label?: string
  cta2_url?: string
  image?: string
  imageUrl?: string
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'ردیاب‌های GPS پیشرفته',
    subtitle: 'راهکارهای حرفه‌ای مدیریت ناوگان با دقت بالا و پوشش سراسری ایران',
    cta_label: 'مشاهده محصولات',
    cta_url: '/products',
    cta2_label: 'مشاوره رایگان',
    cta2_url: '/contact',
  },
  {
    id: '2',
    title: 'نرم‌افزار ردیابی آنلاین',
    subtitle: 'پنل مدیریتی قدرتمند با گزارش‌دهی لحظه‌ای و هشدارهای هوشمند',
    cta_label: 'درباره نرم‌افزار',
    cta_url: '/software',
    cta2_label: 'درخواست دمو',
    cta2_url: '/contact',
  },
  {
    id: '3',
    title: 'پشتیبانی ۲۴ ساعته',
    subtitle: 'تیم متخصص آتی فرزام ایرانیان همیشه در کنار شماست',
    cta_label: 'تماس با ما',
    cta_url: '/contact',
  },
]

interface HeroSliderProps {
  banners?: Banner[]
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const slides = banners && banners.length > 0 ? banners : FALLBACK_BANNERS
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = slides[current]
  const hasImage = !!slide.imageUrl && !imgErrors[slide.id]

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-colors z-20"
        aria-label="قبلی"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-colors z-20"
        aria-label="بعدی"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="container mx-auto px-14">
        <div className="relative min-h-[520px] md:min-h-[560px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full py-16"
            >
              {/* Text — right side (RTL) */}
              <div className="text-white order-2 md:order-1">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl font-black leading-tight mb-5"
                >
                  {slide.title}
                </motion.h1>
                {slide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-md"
                  >
                    {slide.subtitle}
                  </motion.p>
                )}

                {/* ✅ FIX: دکمه‌های CTA — هم اول هم دوم از PocketBase میاد */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 flex-wrap"
                >
                  {slide.cta_url && (
                    <Button asChild size="lg" className="bg-white text-navy font-bold hover:bg-white/90 shadow-lg px-8">
                      <Link href={slide.cta_url}>{slide.cta_label ?? 'مشاهده'}</Link>
                    </Button>
                  )}
                  {/* دکمه دوم: اگه cta2_url توی PocketBase پر بود نشون بده، وگرنه fallback */}
                  <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 px-8">
                    <Link href={slide.cta2_url ?? '/contact'}>
                      {slide.cta2_label ?? 'مشاوره رایگان'}
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Image — left side */}
              <div className="order-1 md:order-2 flex items-center justify-center">
                {hasImage ? (
                  <div className="relative w-full h-64 md:h-80">
                    <Image
                      src={slide.imageUrl!}
                      alt={slide.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      unoptimized
                      onError={() => setImgErrors((prev) => ({ ...prev, [slide.id]: true }))}
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 md:w-72 md:h-72 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center text-white/60">
                      <div className="text-6xl mb-3">📡</div>
                      <p className="text-sm">ردیاب GPS</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'}`}
            aria-label={`اسلاید ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
