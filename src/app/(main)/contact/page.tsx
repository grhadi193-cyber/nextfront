import type { Metadata } from 'next'
import { getSettings } from '@/lib/api/django'
import ContactForm from '@/components/contact/ContactForm'
import { Card, CardContent } from '@/components/ui/card'
import SectionTitle from '@/components/shared/SectionTitle'
import { Phone, Instagram, Send, MapPin, Clock, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'تماس با ما | آتی فرزام ایرانیان',
  description: 'با تیم پشتیبانی آتی فرزام ایرانیان تماس بگیرید — تلفن، ایمیل، اینستاگرام و تلگرام',
  openGraph: {
    title: 'تماس با ما | آتی فرزام ایرانیان',
    description: 'ما اینجاییم تا کمک کنیم!',
    locale: 'fa_IR',
    type: 'website',
  },
}

export default async function ContactPage() {
  let settings: any = null
  try {
    settings = await getSettings()
  } catch {}

  const phone: string = settings?.support_phone ?? '۰۲۱-۱۲۳۴۵۶۷۸'
  const email: string = settings?.support_email ?? 'info@atifarzam.ir'
  const instagram: string = settings?.social_instagram ?? ''
  const telegram: string = settings?.social_telegram ?? ''
  const address: string = settings?.address ?? 'تهران، ایران'
  const workHours: string = settings?.work_hours ?? 'شنبه تا چهارشنبه — ۸ تا ۱۷'

  const contactCards = [
    {
      icon: Phone,
      title: 'تلفن پشتیبانی',
      value: phone,
      href: `tel:${phone.replace(/[-\s]/g, '')}`,
      color: 'text-navy',
      bg: 'bg-navy/10',
    },
    {
      icon: Mail,
      title: 'ایمیل',
      value: email,
      href: `mailto:${email}`,
      color: 'text-teal',
      bg: 'bg-teal/10',
    },
    ...(instagram ? [{
      icon: Instagram,
      title: 'اینستاگرام',
      value: `@${instagram.replace('@', '')}`,
      href: `https://instagram.com/${instagram.replace('@', '')}`,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    }] : []),
    ...(telegram ? [{
      icon: Send,
      title: 'تلگرام',
      value: `@${telegram.replace('@', '')}`,
      href: `https://t.me/${telegram.replace('@', '')}`,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    }] : []),
    {
      icon: MapPin,
      title: 'آدرس',
      value: address,
      href: null,
      color: 'text-amber',
      bg: 'bg-amber/10',
    },
    {
      icon: Clock,
      title: 'ساعت کاری',
      value: workHours,
      href: null,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ]

  return (
    <div className="bg-bg-primary">
      {/* ─── Hero ──────────────────────────────── */}
      <section className="bg-gradient-to-l from-navy to-teal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">تماس با ما</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            سوال، پیشنهاد یا نیاز به پشتیبانی دارید؟ ما اینجاییم.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ─── اطلاعات تماس ───────────────────── */}
          <div>
            <SectionTitle title="راه‌های ارتباطی" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactCards.map(({ icon: Icon, title, value, href, color, bg }, i) => (
                <Card key={i} className="rounded-xl border-border-default hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-text-secondary mb-1">{title}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className={`font-semibold text-sm ${color} hover:underline break-all`}
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-semibold text-sm text-text-primary">{value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ─── فرم تماس ──────────────────────── */}
          <div>
            <SectionTitle title="ارسال پیام" />
            <Card className="rounded-xl border-border-default shadow-sm">
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
