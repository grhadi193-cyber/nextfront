'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error('لطفاً یک ایمیل معتبر وارد کنید')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    toast.success('عضویت شما با موفقیت ثبت شد! 🎉')
    setEmail('')
    setLoading(false)
  }

  return (
    <div className="flex gap-2 flex-col sm:flex-row">
      <div className="relative flex-1">
        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
        <Input
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white h-12"
          dir="ltr"
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-white text-amber font-bold hover:bg-white/90 h-12 px-8 shrink-0 shadow-[var(--shadow-amber)]"
      >
        {loading ? 'در حال ثبت...' : 'عضویت'}
      </Button>
    </div>
  )
}
