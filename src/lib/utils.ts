import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** عدد را به فارسی با کاما تبدیل می‌کند */
export function toFa(n: number | string): string {
  return Number(n).toLocaleString('fa-IR')
}

/** قیمت را به تومان فارسی فرمت می‌کند */
export function formatPrice(price: number): string {
  return `${toFa(price)} تومان`
}

/** slug از عنوان فارسی/انگلیسی می‌سازد */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/** تاریخ میلادی به شمسی (ساده) */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}
