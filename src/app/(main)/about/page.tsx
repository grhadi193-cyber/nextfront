import type { Metadata } from 'next'
import Image from 'next/image'
import { getPage, getSiteConfig, pbImageUrl } from '@/lib/api/pocketbase'
import { getSettings } from '@/lib/api/django'
import SectionTitle from '@/components/shared/SectionTitle'
import { toFa } from '@/lib/utils'
import { Award, Users, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'درباره ما | آتی فرزام ایرانیان',
  description: 'آتی فرزام ایرانیان — پیشگام در ارائه راهکارهای هوشمند ردیابی و مدیریت ناوگان',
  openGraph: {
    title: 'درباره ما | آتی فرزام ایرانیان',
    description: 'بیش از یک دهه تجربه در صنعت ردیابی خودرو',
    locale: 'fa_IR',
    type: 'website',
  },
}

const DEFAULT_STATS = [
  { icon: Users, label: 'مشتری فعال', value: 5000, suffix: '+' },
  { icon: MapPin, label: 'دستگاه نصب‌شده', value: 25000, suffix: '+' },
  { icon: Clock, label: 'سال تجربه', value: 12, suffix: '' },
  { icon: Award, label: 'شهر تحت پوشش', value: 31, suffix: '' },
]

export default async function AboutPage() {
  let pageData: any = null
  let settings: any = null
  let siteConfig: any = null

  try { pageData = await getPage('about') } catch {}
  try { settings = await getSettings() } catch {}
  try { siteConfig = await getSiteConfig() } catch {}

  const teamMembers: any[] = siteConfig?.team ?? []

  const stats = DEFAULT_STATS.map((s) => ({
    ...s,
    value: settings?.[s.label] ?? s.value,
  }))

  return (
    <div className="bg-bg-primary">
      {/* ─── Hero ──────────────────────────────── */}
      <section className="bg-gradient-to-l from-navy to-teal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">درباره ما</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            آتی فرزام ایرانیان — پیشگام در راهکارهای هوشمند مدیریت ناوگان
          </p>
        </div>
      </section>

      {/* ─── محتوای اصلی ───────────────────────── */}
      {pageData?.content && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div
              className="prose prose-lg max-w-none text-text-primary leading-8
                prose-headings:text-text-primary prose-headings:font-bold
                prose-a:text-navy prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        </section>
      )}

      {!pageData?.content && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <SectionTitle title="شرکت آتی فرزام ایرانیان" />
            <div className="prose prose-lg max-w-none text-text-secondary leading-8">
              <p>
                شرکت آتی فرزام ایرانیان با بیش از یک دهه سابقه در حوزه ردیابی خودرو و مدیریت
                هوشمند ناوگان، یکی از پیشروان این صنعت در ایران است. ما با ارائه راهکارهای
                یکپارچه سخت‌افزاری و نرم‌افزاری، به کسب‌وکارها کمک می‌کنیم تا ناوگان
                خود را با دقت و کارایی بالاتری مدیریت کنند.
              </p>
              <p>
                تیم متخصص ما متشکل از مهندسان و کارشناسان با تجربه است که با تکنولوژی‌های
                روز دنیا آشنا هستند و همواره در حال بهبود محصولات و خدمات شرکت می‌باشند.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── آمار ──────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value, suffix }, i) => (
              <div key={i} className="text-center text-white">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2">
                  {toFa(value)}{suffix}
                </div>
                <p className="text-white/75 text-sm md:text-base font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── تیم ───────────────────────────────── */}
      {teamMembers.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionTitle title="تیم ما" centered />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member: any, i: number) => {
                const avatarSrc = member.avatar
                  ? pbImageUrl(member, member.avatar)
                  : null
                return (
                  <Card key={i} className="rounded-xl border-border-default text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-bg-secondary border-2 border-border-default">
                        {avatarSrc ? (
                          <Image
                            src={avatarSrc}
                            alt={member.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-navy/10">
                            <Users className="w-8 h-8 text-navy/40" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-text-primary mb-1">{member.name}</h3>
                      {member.role && (
                        <p className="text-sm text-text-secondary">{member.role}</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
