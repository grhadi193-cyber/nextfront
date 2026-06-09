'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, getProfile } from '@/lib/api/django'
import { useAuthStore } from '@/lib/store/auth'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  phone: z
    .string()
    .min(11, 'شماره موبایل ۱۱ رقمی وارد کنید')
    .regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد'),
})

interface PasswordFormProps {
  redirectTo: string
}

export default function PasswordForm({ redirectTo }: PasswordFormProps) {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true)
    try {
      // ۱. توکن بگیر
      const { access } = await login(values.phone, values.password)
      // ۲. پروفایل بگیر
      const user = await getProfile(access)
      // ۳. ذخیره
      setAuth(access, user)
      toast.success('ورود موفق')
      router.push(redirectTo)
    } catch {
      toast.error('شماره موبایل یا رمز عبور اشتباه است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-text-primary">شماره موبایل</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  className="h-12 text-base text-left placeholder:text-right"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-text-primary">رمز عبور</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-navy hover:text-navy-dark font-medium"
                  tabIndex={-1}
                >
                  فراموشی رمز؟
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    placeholder="••••••••"
                    className="h-12 text-base pl-10 text-left"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                    aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-semibold text-base"
          disabled={loading}
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </Button>
      </form>
    </Form>
  )
}
