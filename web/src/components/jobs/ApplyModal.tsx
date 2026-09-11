import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Send } from 'lucide-react'
import type { Job } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { backend, ApiError } from '@/services/backend'
import { isEmail } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input, Textarea, FileUpload } from '@/components/ui/field'
import { Modal } from '@/components/ui/modal'

interface Props {
  job: Job
  open: boolean
  onClose: () => void
  onApplied: () => void
}

export function ApplyModal({ job, open, onClose, onApplied }: Props) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [coverLetter, setCoverLetter] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const reset = () => {
    setCoverLetter('')
    setPortfolioUrl('')
    setResume(null)
    setErrors({})
    setDone(false)
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = t('error.required')
    if (!email.trim()) next.email = t('error.required')
    else if (!isEmail(email)) next.email = t('error.email')
    if (!phone.trim()) next.phone = t('error.required')
    if (!coverLetter.trim()) next.coverLetter = t('error.required')
    else if (coverLetter.trim().length < 20) next.coverLetter = t('error.required')
    if (portfolioUrl && !/^https?:\/\//i.test(portfolioUrl)) next.portfolioUrl = t('error.required')
    if (resume && resume.size > 5 * 1024 * 1024) next.resume = t('error.fileTooLarge')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      await backend.apply({
        job_id: job.id,
        full_name: fullName,
        email,
        phone,
        cover_letter: coverLetter,
        portfolio_url: portfolioUrl || null,
        resume_name: resume?.name ?? null,
      })
      setDone(true)
      onApplied()
      toast.success(t('apply.successTitle'))
    } catch (error) {
      const code = error instanceof ApiError ? error.code : 'generic'
      if (code === 'already_applied') toast.error(t('error.alreadyApplied'))
      else if (code === 'employer_cannot_apply') toast.error(t('error.employerCannotApply'))
      else toast.error(t('error.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Modal open={open} onClose={() => { reset(); onClose() }} title={t('apply.successTitle')} size="sm">
        <div className="flex flex-col items-center py-4 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-success/12 text-success">
            <CheckCircle2 size={26} />
          </span>
          <p className="text-sm leading-relaxed text-muted">{t('apply.successText')}</p>
          <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
            <Button onClick={() => { reset(); onClose(); navigate('/applications') }}>{t('apply.viewApplications')}</Button>
            <Button variant="secondary" onClick={() => { reset(); onClose(); navigate('/jobs') }}>
              {t('apply.backToJobs')}
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('apply.title')}
      description={t('apply.subtitle', { job: job.title, company: job.company?.name ?? 'LocalJob' })}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t('apply.cancel')}
          </Button>
          <Button onClick={() => void submit()} loading={submitting} icon={<Send size={15} />}>
            {t('apply.submit')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('apply.fullName')}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            error={errors.fullName}
            required
            autoComplete="name"
          />
          <Input
            label={t('apply.email')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />
        </div>
        <Input
          label={t('apply.phone')}
          value={phone ?? ''}
          onChange={(event) => setPhone(event.target.value)}
          error={errors.phone}
          placeholder="+998 90 123 45 67"
          required
          autoComplete="tel"
        />
        <Textarea
          label={t('apply.coverLetter')}
          hint={t('apply.coverLetterHint')}
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
          error={errors.coverLetter}
          rows={5}
          maxLength={1200}
          counter
          required
        />
        <Input
          label={t('apply.portfolio')}
          value={portfolioUrl}
          onChange={(event) => setPortfolioUrl(event.target.value)}
          placeholder="https://"
          error={errors.portfolioUrl}
        />
        <FileUpload
          label={t('apply.resume')}
          hint={t('apply.uploadHint')}
          chooseLabel={t('apply.chooseFile')}
          file={resume}
          error={errors.resume}
          onSelect={(file) => setResume(file)}
          onClear={() => setResume(null)}
        />
      </div>
    </Modal>
  )
}
