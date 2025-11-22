'use client'

import { useState } from 'react'

interface JobSearchProps {
  cvContent: string
  userProfile: any
  onApplicationsFound: (applications: any[]) => void
}

export default function JobSearch({
  cvContent,
  userProfile,
  onApplicationsFound,
}: JobSearchProps) {
  const [searching, setSearching] = useState(false)
  const [searchParams, setSearchParams] = useState({
    jobTitle: 'Healthcare Manager',
    location: 'United States',
    keywords: 'healthcare management, hospital administration',
    autoApply: true,
  })
  const [progress, setProgress] = useState('')

  const handleSearch = async () => {
    setSearching(true)
    setProgress('Searching for jobs...')

    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchParams,
          cvContent,
          userProfile,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProgress(`Found ${data.jobs.length} matching jobs`)

        if (searchParams.autoApply) {
          setProgress('Customizing CV and applying to jobs...')

          const applyResponse = await fetch('/api/auto-apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobs: data.jobs,
              cvContent,
              userProfile,
            }),
          })

          const applyData = await applyResponse.json()
          onApplicationsFound(applyData.applications)
          setProgress(`Applied to ${applyData.applications.length} jobs successfully!`)
        } else {
          onApplicationsFound(data.jobs)
        }
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
      alert('Error searching for jobs. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
          2
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Search & Apply for Jobs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={searchParams.jobTitle}
            onChange={(e) =>
              setSearchParams({ ...searchParams, jobTitle: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Healthcare Manager"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={searchParams.location}
            onChange={(e) =>
              setSearchParams({ ...searchParams, location: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., United States"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={searchParams.keywords}
            onChange={(e) =>
              setSearchParams({ ...searchParams, keywords: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., healthcare management, hospital administration"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.autoApply}
              onChange={(e) =>
                setSearchParams({ ...searchParams, autoApply: e.target.checked })
              }
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700 font-medium">
              Automatically apply with customized CV
            </span>
          </label>
          <p className="ml-8 mt-1 text-sm text-gray-500">
            The agent will customize your CV for each job and automatically submit applications
          </p>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={searching}
        className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${
          searching
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {searching ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {progress}
          </span>
        ) : (
          'Search & Apply for Jobs'
        )}
      </button>

      {progress && !searching && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{progress}</p>
        </div>
      )}
    </div>
  )
}
