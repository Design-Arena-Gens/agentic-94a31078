'use client'

import { useState } from 'react'

interface CVUploadProps {
  onCVProcessed: (content: string, profile: any) => void
}

export default function CVUpload({ onCVProcessed }: CVUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('cv', file)

    try {
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        onCVProcessed(data.cvContent, data.profile)
        setUploaded(true)
      }
    } catch (error) {
      console.error('Error uploading CV:', error)
      alert('Error processing CV. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
          1
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Upload Your CV/Resume</h2>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
          id="cv-upload"
          disabled={uploading || uploaded}
        />
        <label
          htmlFor="cv-upload"
          className={`cursor-pointer ${uploaded ? 'opacity-50' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Processing your CV...</p>
            </div>
          ) : uploaded ? (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-600 font-semibold">CV Uploaded Successfully!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg text-gray-700 mb-2">
                Click to upload your CV
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX, TXT
              </p>
            </div>
          )}
        </label>
      </div>

      {uploaded && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            ✓ Your CV has been analyzed and is ready for job matching
          </p>
        </div>
      )}
    </div>
  )
}
