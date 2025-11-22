'use client'

import { useState } from 'react'
import JobSearch from './components/JobSearch'
import CVUpload from './components/CVUpload'
import ApplicationDashboard from './components/ApplicationDashboard'

export default function Home() {
  const [cvContent, setCvContent] = useState<string>('')
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [] as string[],
    experience: [] as any[],
  })
  const [applications, setApplications] = useState<any[]>([])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Healthcare Job Agent
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Job Search & Auto-Application for Healthcare Managers
          </p>
        </div>

        {/* CV Upload Section */}
        <div className="mb-8">
          <CVUpload
            onCVProcessed={(content, profile) => {
              setCvContent(content)
              setUserProfile(profile)
            }}
          />
        </div>

        {/* Job Search Section */}
        {cvContent && (
          <div className="mb-8">
            <JobSearch
              cvContent={cvContent}
              userProfile={userProfile}
              onApplicationsFound={(apps) => setApplications(apps)}
            />
          </div>
        )}

        {/* Applications Dashboard */}
        {applications.length > 0 && (
          <ApplicationDashboard applications={applications} />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>© 2025 Healthcare Job Agent - Automated Job Search Platform</p>
      </footer>
    </main>
  )
}
