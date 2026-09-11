import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import JobsPage from '@/pages/JobsPage'
import JobDetailPage from '@/pages/JobDetailPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ApplicationsPage from '@/pages/ApplicationsPage'
import SavedPage from '@/pages/SavedPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import NotificationsPage from '@/pages/NotificationsPage'
import CompaniesPage from '@/pages/CompaniesPage'
import CompanyPage from '@/pages/CompanyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PostJob from '@/pages/employer/PostJob'
import EmployerDashboard from '@/pages/employer/EmployerDashboard'
import EmployerJobs from '@/pages/employer/EmployerJobs'
import EmployerApplications from '@/pages/employer/EmployerApplications'
import EmployerCompany from '@/pages/employer/EmployerCompany'
import CandidateDetail from '@/pages/employer/CandidateDetail'
import AdminOverview from '@/pages/admin/AdminOverview'
import { AdminApplications, AdminJobs, AdminUsers } from '@/pages/admin/AdminManagement'
import { AdminActivity, AdminBroadcast } from '@/pages/admin/AdminTools'
import { AboutPage, ContactPage, ForEmployersPage, HowItWorksPage, PrivacyPage, TermsPage } from '@/pages/StaticPages'

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/company/:id" element={<CompanyPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/for-employers" element={<ForEmployersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/post-job" element={<Navigate to="/employer/jobs/new" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Job seeker area */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Employer area */}
      <Route
        element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/jobs/new" element={<PostJob />} />
        <Route path="/employer/jobs/:id/edit" element={<PostJob />} />
        <Route path="/employer/applications" element={<EmployerApplications />} />
        <Route path="/employer/company" element={<EmployerCompany />} />
        <Route path="/employer/candidates/:id" element={<CandidateDetail />} />
      </Route>

      {/* Admin area */}
      <Route
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/broadcast" element={<AdminBroadcast />} />
        <Route path="/admin/activity" element={<AdminActivity />} />
      </Route>
    </Routes>
  )
}
