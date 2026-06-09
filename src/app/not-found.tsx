import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg-primary text-text-primary">
      <h1 className="text-6xl font-bold text-navy">۴۰۴</h1>
      <p className="text-xl text-text-secondary">صفحه مورد نظر یافت نشد</p>
      <Link
        href="/"
        className="px-6 py-3 bg-navy text-white rounded-md hover:bg-navy-dark transition-colors"
      >
        بازگشت به خانه
      </Link>
    </div>
  )
}
