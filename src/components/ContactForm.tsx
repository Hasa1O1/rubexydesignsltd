import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { checkRateLimit } from '@/lib/utils'

/**
 * Contact form validation schema using Zod
 * Validates name, email, phone (Zambian format), company, service interest, and message
 */
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .refine((value) => value.replace(/\D/g, '').length >= 7, 'Please enter a valid phone number'),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // Honeypot field for spam protection
  website: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Contact form component with validation and API submission
 * Includes rate limiting and spam protection
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'whatsapp'>('email')
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const serviceValue = watch('service')

  const onSubmit = async (data: ContactFormData) => {
    // Check honeypot - if filled, it's likely spam
    if (data.website) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Submission rejected. Please try again.',
      })
      return
    }

    // Check rate limit - max 3 submissions per 15 minutes
    if (!checkRateLimit('contact-form', 3, 15 * 60 * 1000)) {
      toast({
        variant: 'destructive',
        title: 'Too many requests',
        description: 'Please wait a few minutes before submitting again.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const message = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Company: ${data.company || 'Not provided'}`,
        `Service Interest: ${data.service}`,
        '',
        data.message,
      ].join('\n')

      if (deliveryMethod === 'whatsapp') {
        const whatsappNumber = '260972188566'
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        toast({
          title: 'WhatsApp opened',
          description: 'Your enquiry has been pre-filled in WhatsApp.',
        })
      } else {
        const subject = encodeURIComponent(`Website contact: ${data.service}`)
        const body = encodeURIComponent(message)
        window.location.href = `mailto:rubexydesigns@gmail.com?subject=${subject}&body=${body}`
        toast({
          title: 'Email draft opened',
          description: 'Please send the email from your mail app to complete your enquiry.',
        })
      }

      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again or email us directly.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="John Doe"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="john@example.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone field */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="+260 XXX XXXXXX"
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Company field (optional) */}
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          {...register('company')}
          placeholder="Your Company Name"
        />
      </div>

      {/* Service interest dropdown */}
      <div className="space-y-2">
        <Label htmlFor="service">Service Interest *</Label>
        <Select
          value={serviceValue}
          onValueChange={(value) => setValue('service', value)}
        >
          <SelectTrigger
            id="service"
            aria-invalid={errors.service ? 'true' : 'false'}
            aria-describedby={errors.service ? 'service-error' : undefined}
          >
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="printing">Printing</SelectItem>
            <SelectItem value="branding">Branding & Signage</SelectItem>
            <SelectItem value="corporate-wear">Corporate Wear</SelectItem>
            <SelectItem value="vehicle-branding">Vehicle Branding</SelectItem>
            <SelectItem value="photography">Photography</SelectItem>
            <SelectItem value="videography">Videography & Documentaries</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.service && (
          <p id="service-error" className="text-sm text-destructive">
            {errors.service.message}
          </p>
        )}
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Tell us about your project..."
          rows={5}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot field (hidden from users) */}
      <input
        type="text"
        {...register('website')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={deliveryMethod === 'email' ? 'default' : 'outline'}
            onClick={() => setDeliveryMethod('email')}
          >
            Email
          </Button>
          <Button
            type="button"
            size="sm"
            variant={deliveryMethod === 'whatsapp' ? 'default' : 'outline'}
            onClick={() => setDeliveryMethod('whatsapp')}
          >
            WhatsApp
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </div>
    </form>
  )
}

