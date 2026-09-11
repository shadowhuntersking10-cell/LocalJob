/** Renders every important route on the server to catch runtime crashes. */
import { renderPath } from '../dist-ssr/ssr-smoke.js'

const routes = [
  '/',
  '/jobs',
  '/jobs?search=react&location=tashkent',
  '/jobs/1',
  '/companies',
  '/company/1',
  '/login',
  '/register',
  '/how-it-works',
  '/for-employers',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/notifications',
  '/dashboard',
  '/applications',
  '/saved',
  '/profile',
  '/settings',
  '/employer',
  '/employer/jobs',
  '/employer/jobs/new',
  '/employer/applications',
  '/employer/company',
  '/admin',
  '/unknown-route',
]

let failed = 0
for (const route of routes) {
  try {
    const html = renderPath(route)
    if (!html || html.length < 200) throw new Error(`suspiciously short output (${html.length} chars)`)
    console.log(`OK   ${route.padEnd(38)} ${String(html.length).padStart(6)} chars`)
  } catch (error) {
    failed += 1
    console.error(`FAIL ${route} -> ${error.message}`)
  }
}

if (failed) {
  console.error(`\n${failed} route(s) failed to render`)
  process.exit(1)
}
console.log('\nAll routes rendered without runtime errors.')
