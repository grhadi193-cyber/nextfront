'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/store/auth'
import { getProfile, updateProfile } from '@/lib/api/django'
import { useState } from 'react'

const schema = z.object({
  full_name:   z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email:       z.string().email('ایمیل نامعتبر').or(z.literal('')).optional(),
  national_id: z.string().length(10, 'کد ملی باید ۱۰ رقم باشد').or(z.literal('')).optional(),
})
type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const { token, user, setAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', email: '', national_id: '' },
  })

  useEffect(() => {
    if (!token) return
    getProfile(token)
      .then((p) => {
        form.reset({
          full_name:   p.full_name   ?? '',
          email:       p.email       ?? '',
          national_id: p.national_id ?? '',
        })
      })
      .catch(() => toast.error('خطا در بارگذاری اطلاعات'))
      .finally(() => setLoading(false))
  }, [token])

  const onSubmit = async (data: FormData) => {
    if (!token) return
    setSaving(true)
    try {
      const updated = await updateProfile(token, data)
      if (user) setAuth(token, { ...user, ...updated })
      toast.success('اطلاعات با موفقیت ذخیره شد')
    } catch {
      toast.error('خطا در ذخیره اطلاعات')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>اطلاعات حساب</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-text-primary">اطلاعات حساب</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Phone — readonly */}
            <div className="space-y-2">
              <Label className="text-text-secondary">شماره موبایل</Label>
              <Input
                value={user?.phone_number ?? ''}
                disabled
                className="bg-bg-secondary text-text-tertiary cursor-not-allowed"
                dir="ltr"
              />
              <p className="text-xs text-text-tertiary">شماره موبایل قابل ویرایش نیست</p>
            </div>

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input placeholder="علی محمدی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ایمیل <span className="text-text-tertiary text-xs">(اختیاری)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="national_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>کد ملی <span className="text-text-tertiary text-xs">(اختیاری)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="۱۰ رقم" maxLength={10} dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-navy hover:bg-navy-dark text-white px-8 gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
