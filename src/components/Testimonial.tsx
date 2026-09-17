import { Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EditText } from '@/components/EditText'

interface TestimonialProps {
  quote: string
  author: string
  role: string
  company: string
  quoteKey?: string
  authorKey?: string
  roleKey?: string
  companyKey?: string
}

/**
 * Testimonial card component
 * Displays client testimonials with quote, author info
 */
export function Testimonial({
  quote,
  author,
  role,
  company,
  quoteKey,
  authorKey,
  roleKey,
  companyKey,
}: TestimonialProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <Quote className="h-8 w-8 text-primary/20 mb-4" aria-hidden="true" />
        <blockquote className="text-muted-foreground mb-6">
          "{quoteKey ? (
            <EditText
              contentKey={quoteKey}
              fallback={quote}
              render={(value) => <>{value}</>}
            />
          ) : (
            quote
          )}"
        </blockquote>
        <div className="border-t pt-4">
          <div className="font-semibold">
            {authorKey ? (
              <EditText
                contentKey={authorKey}
                fallback={author}
                render={(value) => <>{value}</>}
              />
            ) : (
              author
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {roleKey ? (
              <EditText
                contentKey={roleKey}
                fallback={role}
                render={(value) => <>{value}</>}
              />
            ) : (
              role
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {companyKey ? (
              <EditText
                contentKey={companyKey}
                fallback={company}
                render={(value) => <>{value}</>}
              />
            ) : (
              company
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

