'use client'
import { useEffect, useState } from 'react'
import { Plus, MapPin, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuthStore } from '@/lib/store/auth'
import { getAddresses, addAddress, getProvinces, getCities } from '@/lib/api/django'

const EMPTY_FORM = {
  title: '', province_id: '', province_name: '',
  city_id: '', city_name: '', street: '', postal_code: '',
}

export default function AddressesPage() {
  const { token } = useAuthStore()
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return
    Promise.all([getAddresses(token), getProvinces()])
      .then(([addrs, provs]) => { setAddresses(addrs); setProvinces(provs) })
      .catch(() => toast.error('خطا در بارگذاری اطلاعات'))
      .finally(() => setLoading(false))
  }, [token])

  const handleProvinceChange = async (provinceId: string) => {
    const province = provinces.find((p) => String(p.id) === provinceId)
    setForm((f) => ({ ...f, province_id: provinceId, province_name: province?.name ?? '', city_id: '', city_name: '' }))
    setCities([])
    try { setCities(await getCities(Number(provinceId))) } catch {}
  }

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => String(c.id) === cityId)
    setForm((f) => ({ ...f, city_id: cityId, city_name: city?.name ?? '' }))
  }

  const handleSave = async () => {
    if (!form.province_name || !form.city_name || !form.street || !form.postal_code) {
      setSaveError('لطفاً تمام فیلدهای ستاره‌دار را پر کنید')
      return
    }
    if (!token) return
    setSaving(true); setSaveError('')
    try {
      const newAddr = await addAddress(token, {
        title: form.title || 'آدرس جدید',
        province: form.province_name,
        city: form.city_name,
        street: form.street,
        postal_code: form.postal_code,
        is_default: addresses.length === 0,
      })
      setAddresses((prev) => [...prev, newAddr])
      setShowDialog(false)
      setForm(EMPTY_FORM)
      setCities([])
      toast.success('آدرس جدید اضافه شد')
    } catch {
      setSaveError('خطا در ذخیره آدرس. لطفاً دوباره تلاش کنید.')
    } finally {
      setSaving(false)
    }
  }

  // NOTE: Django API currently doesn't expose a delete endpoint in django.ts
  // We handle delete optimistically and show a toast. Update when API is ready.
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    // Optimistic UI remove
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.success('آدرس حذف شد')
    setDeletingId(null)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>آدرس‌های من</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1,2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-text-primary">آدرس‌های من</CardTitle>
          <Button
            size="sm"
            className="bg-navy hover:bg-navy-dark text-white gap-2"
            onClick={() => { setShowDialog(true); setSaveError(''); setForm(EMPTY_FORM); setCities([]) }}
          >
            <Plus className="w-4 h-4" />
            افزودن آدرس
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <MapPin className="w-14 h-14 text-text-tertiary" />
              <p className="text-text-secondary font-medium">هنوز آدرسی ثبت نشده</p>
              <Button
                variant="outline"
                className="border-navy/40 text-navy hover:bg-navy/5 gap-2 mt-2"
                onClick={() => setShowDialog(true)}
              >
                <Plus className="w-4 h-4" />
                افزودن اولین آدرس
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border-default hover:border-navy/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{addr.title || 'آدرس'}</p>
                      <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                        {addr.province} — {addr.city} — {addr.street}
                      </p>
                      {addr.postal_code && (
                        <p className="text-text-tertiary text-xs mt-0.5">کد پستی: {addr.postal_code}</p>
                      )}
                      {addr.is_default && (
                        <span className="inline-block mt-1.5 text-xs bg-success/10 text-success border border-success/25 px-2 py-0.5 rounded-full">
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-text-tertiary hover:text-error hover:bg-error/8 flex-shrink-0"
                        disabled={deletingId === addr.id}
                      >
                        {deletingId === addr.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف آدرس</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-row-reverse gap-2">
                        <AlertDialogAction
                          onClick={() => handleDelete(addr.id)}
                          className="bg-error hover:bg-error/90 text-white"
                        >
                          حذف
                        </AlertDialogAction>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add address dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>افزودن آدرس جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عنوان آدرس</Label>
                <Input
                  placeholder="خانه، محل کار..."
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>کد پستی *</Label>
                <Input
                  placeholder="۱۰ رقم"
                  maxLength={10}
                  dir="ltr"
                  value={form.postal_code}
                  onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>استان *</Label>
                <Select value={form.province_id} onValueChange={handleProvinceChange}>
                  <SelectTrigger><SelectValue placeholder="انتخاب استان" /></SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>شهر *</Label>
                <Select
                  value={form.city_id}
                  onValueChange={handleCityChange}
                  disabled={!form.province_id || cities.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={form.province_id ? 'انتخاب شهر' : 'اول استان'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>آدرس دقیق *</Label>
              <Textarea
                placeholder="خیابان، کوچه، پلاک، واحد..."
                rows={3}
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              />
            </div>
            {saveError && (
              <p className="text-error text-sm bg-error/8 rounded-lg p-2.5">{saveError}</p>
            )}
            <Button
              className="w-full bg-navy hover:bg-navy-dark text-white gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'در حال ذخیره...' : 'ذخیره آدرس'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
