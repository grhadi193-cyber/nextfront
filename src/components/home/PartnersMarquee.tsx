'use client'
import Image from 'next/image'
import { pbImageUrl } from '@/lib/api/pocketbase'

interface Partner {
  id: string
  name: string
  logo?: string
}

const FALLBACK_PARTNERS = [
  { id: '1', name: 'تاکسیرانی تهران' },
  { id: '2', name: 'شرکت حمل و نقل پارس' },
  { id: '3', name: 'ناوگان آریا' },
  { id: '4', name: 'لجستیک ستاره' },
  { id: '5', name: 'باربری ایران' },
  { id: '6', name: 'خدمات شهری البرز' },
]

interface PartnersMarqueeProps {
  partners?: Partner[]
}

export default function PartnersMarquee({ partners }: PartnersMarqueeProps) {
  const items = partners && partners.length > 0 ? partners : FALLBACK_PARTNERS
  const doubled = [...items, ...items]

  return (
    <section className="py-12 bg-white border-y border-border-default overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-sm font-medium text-text-tertiary uppercase tracking-widest">
          مورد اعتماد کسب‌وکارهای برتر
        </p>
      </div>

      <div className="relative">
        {/* fade edges */}
        <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {doubled.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-border-default bg-bg-primary shrink-0"
            >
              {p.logo ? (
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src={pbImageUrl(p, p.logo)}
                    alt={p.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <span className="text-navy font-bold text-sm">{p.name.charAt(0)}</span>
                </div>
              )}
              <span className="text-text-secondary font-medium text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
