import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { checkRateLimit } from '@/lib/utils'

/**
 * RFQ (Request for Quote) form validation schema
 * More detailed than contact form, includes quantity and file upload
 */
const rfqFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .refine((value) => value.replace(/\D/g, '').length >= 7, 'Please enter a valid phone number'),
  deadline: z.string().optional(),
  specifications: z.string().optional(),
  // Honeypot field
  website: z.string().optional(),
})

type RFQFormData = z.infer<typeof rfqFormSchema>

/**
 * Request for Quote form component
 * Includes file upload capability for artwork/specifications
 */
export function RFQForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'whatsapp'>('email')
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqFormSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const onSubmit = async (data: RFQFormData) => {
    // Honeypot check
    if (data.website) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Submission rejected. Please try again.',
      })
      return
    }

    // Rate limit check
    if (!checkRateLimit('rfq-form', 2, 15 * 60 * 1000)) {
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
        `Deadline: ${data.deadline || 'Not specified'}`,
        selectedFile ? `Attachment to add manually: ${selectedFile.name}` : 'Attachment: none',
        '',
        data.specifications || 'No project specifications provided.',
      ].join('\n')

      if (deliveryMethod === 'whatsapp') {
        const whatsappNumber = '260972188566'
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        toast({
          title: 'WhatsApp opened',
          description: 'Your quote request has been pre-filled in WhatsApp.',
        })
      } else {
        const subject = encodeURIComponent('Quote request')
        const body = encodeURIComponent(message)
        window.location.href = `mailto:rubexydesigns@gmail.com?subject=${subject}&body=${body}`
        toast({
          title: 'Email draft opened',
          description: selectedFile
            ? 'Please attach your selected file before sending the email.'
            : 'Please send the email from your mail app to complete your quote request.',
        })
      }

      reset()
      setSelectedFile(null)
    } catch (error) {
      console.error('RFQ submission error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit request. Please try again or contact us directly.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="rfq-name">Name *</Label>
          <Input
            id="rfq-name"
            {...register('name')}
            placeholder="John Doe"
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="rfq-email">Email *</Label>
          <Input
            id="rfq-email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="rfq-phone">Phone *</Label>
          <Input
            id="rfq-phone"
            type="tel"
            {...register('phone')}
            placeholder="+260 XXX XXXXXX"
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Deadline */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="rfq-deadline">Deadline (optional)</Label>
          <Input
            id="rfq-deadline"
            type="date"
            {...register('deadline')}
          />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-2">
        <Label htmlFor="rfq-specifications">Project Specifications</Label>
        <Textarea
          id="rfq-specifications"
          {...register('specifications')}
          placeholder="Please provide detailed specifications: dimensions, materials, colors, finishing, etc."
          rows={6}
          aria-invalid={errors.specifications ? 'true' : 'false'}
        />
        {errors.specifications && (
          <p className="text-sm text-destructive">{errors.specifications.message}</p>
        )}
      </div>

      {/* File upload */}
      <div className="space-y-2">
        <Label htmlFor="rfq-file">Upload Artwork/Specifications (optional, max 10MB)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="rfq-file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ai,.psd"
            className="flex-1"
          />
          {selectedFile && (
            <span className="text-sm text-muted-foreground">
              {selectedFile.name}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX, JPG, PNG, AI, PSD
        </p>
      </div>

      {/* Honeypot */}
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

        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit Quote Request
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

