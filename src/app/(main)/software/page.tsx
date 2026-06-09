import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteConfig, pbImageUrl } from '@/lib/api/pocketbase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import SectionTitle from '@/components/shared/SectionTitle'
import ImageSlider from '@/components/product/ImageSlider'
import {
  MonitorSmartphone, MapPin, Bell, BarChart3,
  ExternalLink, CheckCircle2, Zap, Shield, Clock,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'نرم‌افزار مدیریت ردیابی | آتی فرزام ایرانیان',
  description: 'سامانه آنلاین مدیریت ناوگان و ردیابی خودرو — مشاهده موقعیت لحظه‌ای، گزارش‌گیری و هشدار',
  openGraph: {
    title: 'نرم‌افزار مدیریت ردیابی | آتی فرزام ایرانیان',
    description: 'سامانه آنلاین مدیریت ناوگان و ردیابی خودرو',
    locale: 'fa_IR',
    type: 'website',
  },
}

const DEFAULT_FEATURES = [
  {
    icon: MapPin,
    title: 'ردیابی لحظه‌ای',
    desc: 'مشاهده موقعیت دقیق خودرو روی نقشه به صورت آنلاین و لحظه‌به‌لحظه',
  },
  {
    icon: Bell,
    title: 'هشدارهای فوری',
    desc: 'دریافت هشدار سرعت، خروج از محدوده، خاموش و روشن شدن خودرو',
  },
  {
    icon: BarChart3,
    title: 'گزارش‌گیری پیشرفته',
    desc: 'تحلیل مسیر، مصرف سوخت، کیلومتر کارکرد و گزارش‌های جامع ناوگان',
  },
  {
    icon: MonitorSmartphone,
    title: 'دسترسی از همه‌جا',
    desc: 'وب اپلیکیشن ریسپانسیو قابل استفاده در موبایل، تبلت و کامپیوتر',
  },
]

const DEFAULT_ADVANTAGES = [
  { icon: Zap, text: 'راه‌اندازی سریع در کمتر از ۵ دقیقه' },
  { icon: Shield, text: 'امنیت و رمزگذاری داده‌های شما' },
  { icon: Clock, text: 'پشتیبانی ۲۴ ساعته' },
  { icon: CheckCircle2, text: 'بدون نیاز به نصب نرم‌افزار جداگانه' },
]

export default async function SoftwarePage() {
  let config: any = null
  try {
    config = await getSiteConfig()
  } catch {
    // ادامه با داده‌های پیش‌فرض
  }

  const loginUrl: string = config?.software_login_url ?? '#'
  const features: any[] = config?.feature_cards ?? DEFAULT_FEATURES
  const pricing: any[] | undefined = config?.pricing
  const screenshotFields: string[] = config?.screenshots ?? []
  const screenshotUrls: string[] = screenshotFields.map((fname: string) =>
    config ? pbImageUrl(config, fname) : ''
  ).filter(Boolean)

  return (
    <div className="bg-bg-primary">
      {/* ─── Hero ─────────────────────────────────── */}
      <section className="bg-gradient-to-l from-navy via-[#1a3a8f] to-teal text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>سامانه مدیریت هوشمند ناوگان</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            نرم‌افزار ردیابی <br />
            <span className="text-amber">آتی فرزام ایرانیان</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            مدیریت هوشمند ناوگان خودرویی با امکانات پیشرفته ردیابی، گزارش‌گیری و هشدار آنی
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="bg-amber hover:bg-amber/90 text-white font-bold px-8">
              <Link href={loginUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 ml-2" />
                ورود به سامانه
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/contact">درخواست دمو</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── اسکرین‌شات‌ها ───────────────────────── */}
      {screenshotUrls.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <SectionTitle title="محیط نرم‌افزار" centered />
            <ImageSlider images={screenshotUrls} productName="نرم‌افزار ردیابی" />
          </div>
        </section>
      )}

      {/* ─── ویژگی‌ها ─────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle title="امکانات سامانه" subtitle="تمام ابزارهای لازم برای مدیریت حرفه‌ای ناوگان" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {(features.length > 0 ? features : DEFAULT_FEATURES).map((feature: any, i: number) => {
              const IconComp = DEFAULT_FEATURES[i % DEFAULT_FEATURES.length]?.icon ?? MapPin
              return (
                <Card key={i} className="rounded-xl border-border-default hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary mb-2">{feature.title ?? feature}</h3>
                      {feature.desc && (
                        <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── مزایا ───────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <SectionTitle title="چرا سامانه ما؟" centered />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
            {DEFAULT_ADVANTAGES.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-bg-primary border border-border-default">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm text-text-primary font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── قیمت‌گذاری ──────────────────────────── */}
      {pricing && pricing.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionTitle title="پلن‌های اشتراک" centered />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricing.map((plan: any, i: number) => (
                <Card
                  key={i}
                  className={`rounded-xl overflow-hidden transition-shadow hover:shadow-lg ${
                    plan.featured ? 'border-2 border-navy ring-2 ring-navy/20' : 'border-border-default'
                  }`}
                >
                  {plan.featured && (
                    <div className="bg-navy text-white text-center text-xs font-bold py-1.5">
                      پیشنهاد ویژه
                    </div>
                  )}
                  <CardHeader className="p-6 pb-4">
                    <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                    <div className="mt-3">
                      <span className="text-3xl font-black text-navy">
                        {formatPrice(plan.price)}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-text-secondary mr-1">/ {plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    {plan.features && (
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f: string, j: number) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      className={`w-full ${plan.featured ? 'bg-navy hover:bg-navy/90 text-white' : ''}`}
                      variant={plan.featured ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={loginUrl} target="_blank" rel="noopener noreferrer">
                        شروع کنید
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA نهایی ───────────────────────────── */}
      <section className="py-20 bg-gradient-to-l from-navy to-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">آماده شروع هستید؟</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            همین حالا وارد سامانه شوید و ناوگان خود را هوشمند مدیریت کنید.
          </p>
          <Button size="lg" asChild className="bg-amber hover:bg-amber/90 text-white font-bold px-10">
            <Link href={loginUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 ml-2" />
              ورود به سامانه
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
