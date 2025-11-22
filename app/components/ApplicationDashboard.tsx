'use client'

interface Application {
  id: string
  jobTitle: string
  company: string
  location: string
  status: string
  appliedAt: string
  customizations: string[]
  jobUrl?: string
}

interface ApplicationDashboardProps {
  applications: Application[]
}

export default function ApplicationDashboard({
  applications,
}: ApplicationDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
          3
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Application Dashboard</h2>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-semibold">Total Applications</p>
          <p className="text-3xl font-bold text-blue-800">{applications.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-semibold">Successfully Applied</p>
          <p className="text-3xl font-bold text-green-800">
            {applications.filter((a) => a.status === 'applied').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-semibold">Pending</p>
          <p className="text-3xl font-bold text-yellow-800">
            {applications.filter((a) => a.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {app.jobTitle}
                </h3>
                <p className="text-gray-600">
                  {app.company} • {app.location}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  app.status
                )}`}
              >
                {app.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Applied: {new Date(app.appliedAt).toLocaleString()}
              </p>
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  View Job Posting →
                </a>
              )}
            </div>

            {app.customizations && app.customizations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  CV Customizations:
                </p>
                <ul className="space-y-1">
                  {app.customizations.map((customization, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {customization}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications yet. Start your job search above!</p>
        </div>
      )}
    </div>
  )
}
