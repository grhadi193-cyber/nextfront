'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { toFa } from '@/lib/utils'

interface Stat {
  label: string
  value: number
  suffix?: string
}

const DEFAULT_STATS: Stat[] = [
  { label: 'مشتری فعال', value: 5000, suffix: '+' },
  { label: 'دستگاه نصب‌شده', value: 25000, suffix: '+' },
  { label: 'سال تجربه', value: 12, suffix: '' },
  { label: 'شهر تحت پوشش', value: 31, suffix: '' },
]

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {toFa(count)}{suffix}
    </span>
  )
}

interface StatsCounterProps {
  stats?: Stat[]
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  const items = stats && stats.length > 0 ? stats : DEFAULT_STATS

  return (
    <section className="py-20" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-black mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/75 text-sm md:text-base font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
