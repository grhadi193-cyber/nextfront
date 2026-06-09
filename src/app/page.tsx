import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getSettings, getProducts } from '@/lib/api/django'
import { getBanners, getPartners, getSiteConfig, pbImageUrl, getProductImages } from '@/lib/api/pocketbase'
import HeroSlider from '@/components/home/HeroSlider'
import PartnersMarquee from '@/components/home/PartnersMarquee'
import StatsCounter from '@/components/home/StatsCounter'
import SectionTitle from '@/components/shared/SectionTitle'
import ProductCard from '@/components/product/ProductCard'
import {
  Shield, Zap, Headphones, Award,
  Smartphone, Monitor, Bell, BarChart3,
  MapPin
} from 'lucide-react'
import NewsletterForm from '@/components/home/NewsletterForm'

export const metadata = {
  title: 'آتی فرزام ایرانیان — سیستم‌های ردیابی GPS',
  description: 'خرید ردیاب GPS خودرو، ناوگان و اشخاص با ضمانت اصالت و پشتیبانی ۲۴ ساعته',
}

async function fetchAllData() {
  const [bannersResult, partnersResult, settingsResult, productsResult, siteConfigResult] =
    await Promise.allSettled([
      getBanners(),
      getPartners(),
      getSettings(),
      getProducts({ page_size: 6 }),
      getSiteConfig(),
    ])
  return {
    banners: bannersResult.status === 'fulfilled' ? bannersResult.value : [],
    partners: partnersResult.status === 'fulfilled' ? partnersResult.value : [],
    settings: settingsResult.status === 'fulfilled' ? settingsResult.value : null,
    products: productsResult.status === 'fulfilled'
      ? (productsResult.value?.results ?? productsResult.value ?? [])
      : [],
    siteConfig: siteConfigResult.status === 'fulfilled' ? siteConfigResult.value : null,
  }
}

const ABOUT_ICONS = [
  { icon: Shield, label: 'ضمانت اصالت کالا' },
  { icon: Zap, label: 'نصب سریع و آسان' },
  { icon: Headphones, label: 'پشتیبانی ۲۴ ساعته' },
  { icon: Award, label: 'بیش از ۱۲ سال تجربه' },
]

const SOFTWARE_FEATURES = [
  { icon: Monitor, label: 'پنل تحت وب', desc: 'دسترسی از هر مرورگر بدون نصب نرم‌افزار' },
  { icon: Smartphone, label: 'اپ موبایل', desc: 'اندروید و iOS با رابط کاربری روان' },
  { icon: Bell, label: 'هشدارهای آنی', desc: 'اعلان لحظه‌ای برای ورود/خروج از محدوده' },
  { icon: BarChart3, label: 'گزارش‌گیری', desc: 'آمار کامل مسیر، سرعت و توقف‌ها' },
]

export default async function RootPage() {
  const { banners, partners, settings, products, siteConfig } = await fetchAllData()

  const bannersWithImages = banners.map((b: any) => ({
    ...b,
    imageUrl: b.image ? pbImageUrl(b, b.image) : undefined,
  }))

  const stats = siteConfig?.stats ?? null
  const appLinks = {
    googlePlay: siteConfig?.google_play_url ?? '#',
    appStore: siteConfig?.app_store_url ?? '#',
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-var(--navbar-height))]">
        <div dir="rtl">
          <HeroSlider banners={bannersWithImages} />
          <PartnersMarquee partners={partners} />

          {/* درباره ما */}
          <section className="py-20 bg-bg-primary">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
                <div>
                  <SectionTitle
                    title="درباره آتی فرزام ایرانیان"
                    subtitle={settings?.about_us ?? 'آتی فرزام ایرانیان با بیش از یک دهه تجربه در حوزه ردیابی GPS، راهکارهای جامع مدیریت ناوگان و امنیت خودرو را به سازمان‌ها و افراد ارائه می‌دهد.'}
                  />
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {ABOUT_ICONS.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border-default">
                        <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-navy" />
                        </div>
                        <span className="text-text-secondary text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                    <Link href="/about">بیشتر درباره ما</Link>
                  </Button>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-navy/10 to-teal/10 border border-border-default flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-navy/5 animate-pulse" />
                      <div className="absolute inset-4 rounded-full bg-navy/8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="absolute inset-8 rounded-full bg-navy/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-navy" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-white rounded-xl shadow-[var(--shadow-md)] px-4 py-3 border border-border-default">
                    <p className="text-xs text-text-tertiary">موقعیت زنده</p>
                    <p className="text-sm font-bold text-navy">تهران، ولیعصر</p>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-[var(--shadow-md)] px-4 py-3 border border-border-default">
                    <p className="text-xs text-text-tertiary">سرعت</p>
                    <p className="text-sm font-bold text-success">۶۵ km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* محصولات */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <SectionTitle title="محصولات سخت‌افزاری" subtitle="انواع ردیاب GPS برای خودروهای شخصی، موتورسیکلت و ناوگان تجاری" className="mb-0" />
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/products">مشاهده همه محصولات</Link>
                </Button>
              </div>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 6).map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-72 rounded-xl" />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* نرم‌افزار */}
          <section className="py-20 bg-bg-primary">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
                <div className="flex items-center justify-center order-1">
                  <div className="relative w-full max-w-sm">
                    <div className="rounded-2xl overflow-hidden border border-border-default shadow-[var(--shadow-lg)] bg-white">
                      <div className="bg-navy p-4 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-white/30" />
                          <div className="w-3 h-3 rounded-full bg-white/30" />
                          <div className="w-3 h-3 rounded-full bg-white/30" />
                        </div>
                        <div className="flex-1 bg-white/10 rounded-md h-6 mx-2" />
                      </div>
                      <div className="p-4 bg-bg-secondary h-52 flex items-center justify-center">
                        <div className="text-center text-text-tertiary">
                          <Monitor className="w-16 h-16 mx-auto mb-3 text-navy/40" />
                          <p className="text-sm">نقشه ردیابی زنده</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-2">
                  <SectionTitle
                    title="نرم‌افزار ردیابی پیشرفته"
                    subtitle={siteConfig?.software_description ?? 'پلتفرم جامع مدیریت ناوگان با قابلیت ردیابی لحظه‌ای، گزارش‌دهی دقیق و هشدارهای هوشمند'}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {SOFTWARE_FEATURES.map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex gap-3 p-4 rounded-xl bg-white border border-border-default">
                        <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-teal" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{label}</p>
                          <p className="text-text-tertiary text-xs mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Button asChild className="bg-navy hover:bg-navy-dark text-white px-6">
                      <Link href="/software">درباره نرم‌افزار</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white px-6">
                      <Link href="/contact">درخواست دمو</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <StatsCounter stats={stats} />

          {/* اپلیکیشن */}
          <section className="py-20 bg-bg-secondary">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <SectionTitle title="اپلیکیشن موبایل" subtitle="ردیابی ناوگان در کف دست شما — همیشه و همه‌جا" centered />
                <div className="flex gap-4 justify-center flex-wrap">
                  <a href={appLinks.googlePlay} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3.5 bg-text-primary text-white rounded-xl hover:bg-text-secondary transition-colors">
                    <span className="text-2xl">▶</span>
                    <div className="text-right">
                      <p className="text-[10px] text-white/70">دانلود از</p>
                      <p className="font-bold text-sm">Google Play</p>
                    </div>
                  </a>
                  <a href={appLinks.appStore} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3.5 bg-text-primary text-white rounded-xl hover:bg-text-secondary transition-colors">
                    <span className="text-2xl">🍎</span>
                    <div className="text-right">
                      <p className="text-[10px] text-white/70">دانلود از</p>
                      <p className="font-bold text-sm">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* خبرنامه */}
          <section className="py-20" style={{ background: 'linear-gradient(135deg, #B45309 0%, #D97706 60%, #F59E0B 100%)' }}>
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">عضویت در خبرنامه</h2>
                <p className="text-white/80 mb-8">از آخرین محصولات، تخفیف‌ها و اخبار GPS باخبر شوید</p>
                <NewsletterForm />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
