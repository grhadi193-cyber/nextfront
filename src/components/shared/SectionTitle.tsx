import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export default function SectionTitle({ title, subtitle, centered = false, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-10', centered && 'text-center', className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 relative inline-block">
        {title}
        <span
          className={cn(
            'absolute -bottom-1 h-1 rounded-full bg-navy',
            centered ? 'right-1/2 translate-x-1/2 w-12' : 'right-0 w-12'
          )}
        />
      </h2>
      {subtitle && (
        <p className="mt-4 text-text-secondary text-base leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
