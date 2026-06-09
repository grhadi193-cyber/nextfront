import { cn } from '@/lib/utils'

type StatusKey = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const STATUS_MAP: Record<StatusKey, { label: string; className: string }> = {
  pending:    { label: 'در انتظار تأیید',   className: 'bg-amber/15 text-amber border border-amber/30'       },
  paid:       { label: 'تأیید شده',         className: 'bg-teal/12 text-teal border border-teal/30'         },
  processing: { label: 'در حال آماده‌سازی', className: 'bg-navy/10 text-navy border border-navy/25'         },
  shipped:    { label: 'تحویل به پست',      className: 'bg-purple-100 text-purple-700 border border-purple-200' },
  delivered:  { label: 'تحویل شده',         className: 'bg-success/12 text-success border border-success/30' },
  cancelled:  { label: 'لغو شده',           className: 'bg-error/10 text-error border border-error/25'      },
}

interface OrderStatusBadgeProps {
  status: string
  className?: string
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const cfg = STATUS_MAP[status as StatusKey] ?? {
    label: status,
    className: 'bg-bg-secondary text-text-secondary border border-border-default',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', cfg.className, className)}>
      {cfg.label}
    </span>
  )
}
