'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface CountdownTimerProps {
  seconds: number
  onExpire?: () => void
  onResend: () => void
  loading?: boolean
}

function toFaDigits(n: number) {
  return n.toLocaleString('fa-IR').padStart(2, '۰')
}

export default function CountdownTimer({ seconds, onExpire, onResend, loading }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    setRemaining(seconds)
    setExpired(false)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      setExpired(true)
      onExpire?.()
      return
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining, onExpire])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  if (expired) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onResend}
        disabled={loading}
        className="text-navy hover:text-navy-dark gap-1.5 h-8"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        ارسال مجدد کد
      </Button>
    )
  }

  return (
    <p className="text-sm text-text-tertiary">
      ارسال مجدد کد تا{' '}
      <span className="font-mono font-semibold text-text-secondary" dir="ltr">
        {toFaDigits(mins)}:{toFaDigits(secs)}
      </span>
    </p>
  )
}
