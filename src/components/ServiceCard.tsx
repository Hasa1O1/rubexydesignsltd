import { LucideIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { EditText } from '@/components/EditText'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  items: string[]
  contentKey?: string
  itemKeys?: string[]
}

/**
 * Service card component to display individual services
 * Shows an icon, title, description, and list of service items
 */
export function ServiceCard({ icon: Icon, title, description, items, contentKey, itemKeys }: ServiceCardProps) {
  return (
    <Card className="card-lift reveal-up h-full border border-orange-100/80 bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle>
          {contentKey ? (
            <EditText
              contentKey={`${contentKey}.title`}
              fallback={title}
              render={(value) => <>{value}</>}
            />
          ) : (
            title
          )}
        </CardTitle>
        <CardDescription>
          {contentKey ? (
            <EditText
              contentKey={`${contentKey}.description`}
              fallback={description}
              render={(value) => <>{value}</>}
            />
          ) : (
            description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((item, index) => {
            const itemKey = itemKeys?.[index]
            return (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {itemKey ? (
                  <EditText
                    contentKey={itemKey}
                    fallback={item}
                    render={(value) => <>{value}</>}
                  />
                ) : (
                  <span>{item}</span>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

