'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuthStore } from '@/lib/store/auth'
import { changePassword } from '@/lib/api/django'

const schema = z.object({
  old_password:        z.string().min(1, 'رمز فعلی الزامی است'),
  new_password:        z.string().min(8, 'رمز جدید باید حداقل ۸ کاراکتر باشد'),
  confirm_password:    z.string().min(1, 'تأیید رمز الزامی است'),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'رمز جدید و تأیید آن یکسان نیستند',
  path: ['confirm_password'],
})
type FormData = z.infer<typeof schema>

function PasswordField({
  label, name, form, placeholder,
}: {
  label: string; name: keyof FormData; form: any; placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                dir="ltr"
                className="pl-10"
                {...field}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default function ChangePasswordPage() {
  const { token } = useAuthStore()
  const [saving, setSaving] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { old_password: '', new_password: '', confirm_password: '' },
  })

  const onSubmit = async (data: FormData) => {
    if (!token) return
    setSaving(true)
    try {
      await changePassword(token, {
        old_password: data.old_password,
        new_password: data.new_password,
      })
      toast.success('رمز عبور با موفقیت تغییر کرد')
      form.reset()
    } catch {
      toast.error('رمز فعلی اشتباه است یا خطایی رخ داده')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-text-primary">تغییر رمز عبور</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <PasswordField label="رمز عبور فعلی"  name="old_password"     form={form} />
            <PasswordField label="رمز عبور جدید"  name="new_password"     form={form} placeholder="حداقل ۸ کاراکتر" />
            <PasswordField label="تأیید رمز جدید" name="confirm_password" form={form} />
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-navy hover:bg-navy-dark text-white px-8 gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'در حال ذخیره...' : 'تغییر رمز'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
