import { Compass } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { EmptyState } from '@/components/ui/misc'

export default function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <div className="lj-container py-20">
      <EmptyState
        icon={<Compass size={26} />}
        title={`404 · ${t('common.notFoundTitle')}`}
        description={t('common.notFoundText')}
        actionLabel={t('common.goHome')}
        actionTo="/"
      />
    </div>
  )
}
