import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Send } from 'lucide-react'

const QUICK_LINKS = [
  { href: '/products', label: 'محصولات' },
  { href: '/software', label: 'نرم‌افزار ردیابی' },
  { href: '/blog',     label: 'وبلاگ' },
  { href: '/about',    label: 'درباره ما' },
  { href: '/contact',  label: 'تماس با ما' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F2460' }} className="text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold leading-tight">آتی فرزام ایرانیان</p>
                <p className="text-xs text-white/60 leading-tight">ATI Farzam Iranian</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              ارائه‌دهنده راهکارهای هوشمند ردیابی GPS برای خودروهای شخصی، ناوگان تجاری و اشخاص. با ما موقعیت همه چیز را بدانید.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">دسترسی سریع</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">اطلاعات تماس</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4 shrink-0 text-teal" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4 shrink-0 text-teal" />
                <span>info@atifarzam.ir</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-teal" />
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">شبکه‌های اجتماعی</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="تلگرام"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-white/50 leading-relaxed">
              برای اطلاع از جدیدترین محصولات و تخفیف‌ها ما را دنبال کنید.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            © ۱۴۰۳ آتی فرزام ایرانیان — تمامی حقوق محفوظ است
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              قوانین استفاده
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
