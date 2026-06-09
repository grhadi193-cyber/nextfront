'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ کاراکتر باشد'),
  phone: z
    .string()
    .regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۱۲۳۴۵۶۷)'),
  message: z.string().min(10, 'پیام حداقل ۱۰ کاراکتر باشد'),
})

type FormValues = z.infer<typeof schema>

export default function ContactForm() {
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', message: '' },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    // شبیه‌سازی ارسال فرم — در فاز آینده به API متصل می‌شود
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    form.reset()
    toast.success('پیام شما با موفقیت ارسال شد', {
      description: 'کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام و نام خانوادگی</FormLabel>
              <FormControl>
                <Input placeholder="محمد احمدی" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>شماره موبایل</FormLabel>
              <FormControl>
                <Input placeholder="09121234567" dir="ltr" className="text-left" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>پیام</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="پیام خود را بنویسید..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy/90 text-white">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 ml-2" />
              ارسال پیام
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
