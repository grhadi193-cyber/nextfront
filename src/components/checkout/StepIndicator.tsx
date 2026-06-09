import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'آدرس تحویل' },
  { id: 2, label: 'روش ارسال' },
  { id: 3, label: 'تأیید و پرداخت' },
]

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-10" dir="rtl">
      {STEPS.map((step, idx) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all',
                  isCompleted && 'bg-success border-success text-white',
                  isActive && 'bg-navy border-navy text-white shadow-[0_0_0_4px_rgba(26,86,219,0.15)]',
                  !isCompleted && !isActive && 'bg-white border-border-default text-text-tertiary'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-navy' : isCompleted ? 'text-success' : 'text-text-tertiary'
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all',
                  step.id < currentStep ? 'bg-success' : 'bg-border-default'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
