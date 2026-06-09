import type { Metadata } from 'next'
import '@/styles/globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'آتی فرزام ایرانیان — سیستم‌های ردیابی GPS',
  description: 'فروش و پشتیبانی ردیاب‌های GPS برای خودرو، ناوگان و اشخاص',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
