'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { sendOtp, verifyOtp, getProfile } from '@/lib/api/django'
import { useAuthStore } from '@/lib/store/auth'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OtpInput from './OtpInput'
import CountdownTimer from './CountdownTimer'
import { ArrowLeft, Phone } from 'lucide-react'

const phoneSchema = z.object({
  phone: z
    .string()
    .min(11, 'شماره موبایل ۱۱ رقمی وارد کنید')
    .max(11, 'شماره موبایل ۱۱ رقمی وارد کنید')
    .regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'),
})

interface OtpFormProps {
  redirectTo: string
}

export default function OtpForm({ redirectTo }: OtpFormProps) {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  })

  async function handleSendOtp(values: z.infer<typeof phoneSchema>) {
    setSendLoading(true)
    try {
      await sendOtp(values.phone)
      setPhone(values.phone)
      setOtp('')
      setStep('otp')
      setTimerKey((k) => k + 1)
      toast.success('کد تأیید ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد — لطفاً دوباره تلاش کنید')
    } finally {
      setSendLoading(false)
    }
  }

  async function handleResend() {
    setSendLoading(true)
    try {
      await sendOtp(phone)
      setOtp('')
      setTimerKey((k) => k + 1)
      toast.success('کد جدید ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد')
    } finally {
      setSendLoading(false)
    }
  }

  async function handleVerify() {
    if (otp.length < 6) {
      toast.error('کد ۶ رقمی را کامل وارد کنید')
      return
    }
    setVerifyLoading(true)
    try {
      // ۱. توکن بگیر
      const { access } = await verifyOtp(phone, otp)
      // ۲. پروفایل بگیر تا user object داشته باشیم
      const user = await getProfile(access)
      // ۳. در store ذخیره کن
      setAuth(access, user)
      toast.success('ورود موفق')
      router.push(redirectTo)
    } catch {
      toast.error('کد وارد شده اشتباه یا منقضی شده است')
      setOtp('')
    } finally {
      setVerifyLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        {/* Phone display */}
        <div className="flex items-center justify-between bg-bg-secondary rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Phone className="w-4 h-4" />
            <span dir="ltr" className="font-mono font-medium">{phone}</span>
          </div>
          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp('') }}
            className="text-sm text-navy hover:text-navy-dark font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            ویرایش
          </button>
        </div>

        {/* OTP Input */}
        <div className="space-y-3">
          <p className="text-sm text-text-secondary text-center">
            کد ۶ رقمی ارسال‌شده را وارد کنید
          </p>
          <OtpInput value={otp} onChange={setOtp} disabled={verifyLoading} />
        </div>

        {/* Timer */}
        <div className="flex justify-center">
          <CountdownTimer
            key={timerKey}
            seconds={120}
            onResend={handleResend}
            loading={sendLoading}
          />
        </div>

        {/* Verify button */}
        <Button
          type="button"
          className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-semibold text-base"
          onClick={handleVerify}
          disabled={verifyLoading || otp.length < 6}
        >
          {verifyLoading ? 'در حال تأیید...' : 'تأیید و ورود'}
        </Button>
      </div>
    )
  }

  return (
    <Form {...phoneForm}>
      <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-5" noValidate>
        <FormField
          control={phoneForm.control}
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
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-semibold text-base"
          disabled={sendLoading}
        >
          {sendLoading ? 'در حال ارسال...' : 'دریافت کد تأیید'}
        </Button>
      </form>
    </Form>
  )
}
