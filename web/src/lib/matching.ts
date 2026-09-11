import type { ExperienceLevel, Job, Profile, User } from '@/types'

const EXPERIENCE_ORDER: Record<string, number> = {
  'No experience': 0,
  Junior: 1,
  Middle: 2,
  Senior: 3,
}

const asSet = (values?: string[] | null) =>
  new Set((values || []).map((value) => String(value).trim().toLowerCase()).filter(Boolean))

/** Client-side match score (mirrors the server implementation so both agree). */
export function matchScore(
  job: Pick<Job, 'skills' | 'category' | 'location' | 'experienceLevel' | 'title'>,
  profile?: Profile | null,
  user?: Pick<User, 'location'> | null,
): number {
  let score = 30
  const jobSkills = asSet(job.skills)
  const profileSkills = asSet(profile?.skills)

  if (jobSkills.size && profileSkills.size) {
    let overlap = 0
    jobSkills.forEach((skill) => {
      if (profileSkills.has(skill)) overlap += 1
    })
    score += (overlap / jobSkills.size) * 30
  } else if (profileSkills.size) {
    score += 6
  }

  if (profile?.category && profile.category.toLowerCase() === job.category.toLowerCase()) score += 18

  const jobLocation = (job.location || '').toLowerCase()
  const profileLocation = ((profile?.location || user?.location || '') as string).toLowerCase()
  if (jobLocation.includes('remote')) score += 8
  else if (profileLocation && (profileLocation.includes(jobLocation) || jobLocation.includes(profileLocation))) score += 14

  const jobExp = EXPERIENCE_ORDER[job.experienceLevel as ExperienceLevel]
  const profileExp = profile?.experienceLevel ? EXPERIENCE_ORDER[profile.experienceLevel] : undefined
  if (jobExp !== undefined && profileExp !== undefined) {
    const delta = Math.abs(jobExp - profileExp)
    score += delta === 0 ? 12 : delta === 1 ? 8 : 2
  }

  if (profile?.title) {
    const words = profile.title
      .toLowerCase()
      .replace(/[()]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3)
    const title = job.title.toLowerCase()
    if (words.some((word) => title.includes(word))) score += 12
  }

  if (profile?.bio) score += 3
  if (profile?.experience?.length) score += 4

  return Math.max(12, Math.min(99, Math.round(score)))
}

export function profileCompletion(
  user: Pick<User, 'name' | 'location'> | null,
  profile: Profile | null,
): number {
  if (!user) return 0
  if (!profile) return user.name ? 15 : 5
  const checks = [
    !!user.name,
    !!profile.title,
    !!profile.bio && profile.bio.length > 30,
    !!(profile.location || user.location),
    !!profile.phone,
    profile.skills?.length > 0,
    profile.experience?.length > 0,
    profile.education?.length > 0,
    !!(profile.portfolio || profile.github || profile.linkedin || profile.telegram),
    !!profile.category,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
