import { Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

type StepStatus = 'completed' | 'current' | 'pending'

interface TimelineStep {
  status: string
  label: string
  date?: string
  stepStatus: StepStatus
}

const ALL_STEPS = [
  { status: 'pending',    label: 'ثبت سفارش'         },
  { status: 'paid',       label: 'تأیید پرداخت'       },
  { status: 'processing', label: 'آماده‌سازی'          },
  { status: 'shipped',    label: 'تحویل به پست'       },
  { status: 'delivered',  label: 'تحویل به مشتری'     },
]

const STATUS_ORDER = ['pending', 'paid', 'processing', 'shipped', 'delivered']

interface OrderTimelineProps {
  currentStatus: string
  history?: Array<{ status: string; created_at: string }>
}

export default function OrderTimeline({ currentStatus, history = [] }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  const isCancelled = currentStatus === 'cancelled'

  const historyMap = history.reduce<Record<string, string>>((acc, h) => {
    acc[h.status] = h.created_at
    return acc
  }, {})

  const steps: TimelineStep[] = ALL_STEPS.map((s, idx) => {
    let stepStatus: StepStatus = 'pending'
    if (!isCancelled) {
      if (idx < currentIndex) stepStatus = 'completed'
      else if (idx === currentIndex) stepStatus = 'current'
    }
    return { ...s, date: historyMap[s.status], stepStatus }
  })

  return (
    <div className="relative">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        return (
          <div key={step.status} className="flex gap-4">
            {/* dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 transition-all',
                  step.stepStatus === 'completed' && 'bg-success border-success',
                  step.stepStatus === 'current'   && 'bg-navy border-navy',
                  step.stepStatus === 'pending'   && 'bg-white border-border-default',
                )}
              >
                {step.stepStatus === 'completed' && <Check className="w-4 h-4 text-white" />}
                {step.stepStatus === 'current'   && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                {step.stepStatus === 'pending'   && <div className="w-2.5 h-2.5 rounded-full bg-border-default" />}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[2rem]',
                    step.stepStatus === 'completed' ? 'bg-success' : 'bg-border-default'
                  )}
                />
              )}
            </div>

            {/* content */}
            <div className={cn('pb-6 flex-1', isLast && 'pb-0')}>
              <p
                className={cn(
                  'font-semibold text-sm mt-1',
                  step.stepStatus === 'completed' && 'text-success',
                  step.stepStatus === 'current'   && 'text-navy',
                  step.stepStatus === 'pending'   && 'text-text-tertiary',
                )}
              >
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-text-tertiary mt-0.5">{formatDate(step.date)}</p>
              )}
            </div>
          </div>
        )
      })}

      {isCancelled && (
        <div className="mt-4 p-3 bg-error/8 rounded-xl border border-error/20">
          <p className="text-error text-sm font-medium text-center">سفارش لغو شده است</p>
        </div>
      )}
    </div>
  )
}
