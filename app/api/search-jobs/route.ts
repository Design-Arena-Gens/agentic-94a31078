import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobTitle, location, keywords, cvContent, userProfile } = body

    // Simulate job search results
    // In production, integrate with job boards APIs (LinkedIn, Indeed, etc.)
    const mockJobs = generateMockJobs(jobTitle, location, keywords)

    // Filter jobs based on CV match
    const matchedJobs = mockJobs.filter(job => {
      const matchScore = calculateMatchScore(job, cvContent, userProfile)
      return matchScore > 60 // Only return jobs with >60% match
    })

    return NextResponse.json({
      success: true,
      jobs: matchedJobs,
      totalFound: matchedJobs.length,
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    return NextResponse.json({
      success: false,
      error: 'Error searching for jobs',
    })
  }
}

function generateMockJobs(title: string, location: string, keywords: string) {
  const companies = [
    'Mayo Clinic',
    'Cleveland Clinic',
    'Johns Hopkins Medicine',
    'Massachusetts General Hospital',
    'Kaiser Permanente',
    'UnitedHealth Group',
    'HCA Healthcare',
    'Ascension Health',
    'CommonSpirit Health',
    'Trinity Health',
  ]

  const positions = [
    'Healthcare Operations Manager',
    'Clinical Services Manager',
    'Hospital Administrator',
    'Healthcare Program Manager',
    'Patient Services Manager',
    'Healthcare Quality Manager',
    'Medical Practice Manager',
    'Healthcare Facility Manager',
  ]

  const jobs = []
  for (let i = 0; i < 20; i++) {
    const company = companies[i % companies.length]
    const position = positions[i % positions.length]

    jobs.push({
      id: `job-${i + 1}`,
      jobTitle: position,
      company,
      location: getRandomLocation(location),
      salary: `$${80000 + i * 5000} - $${120000 + i * 8000}`,
      description: generateJobDescription(position, company),
      requirements: generateRequirements(),
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      jobUrl: `https://careers.${company.toLowerCase().replace(/\s+/g, '')}.com/job-${i + 1}`,
      matchScore: Math.floor(60 + Math.random() * 40),
    })
  }

  return jobs
}

function getRandomLocation(baseLocation: string): string {
  const cities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'Boston, MA',
  ]
  return cities[Math.floor(Math.random() * cities.length)]
}

function generateJobDescription(position: string, company: string): string {
  return `${company} is seeking an experienced ${position} to join our healthcare team.

The successful candidate will oversee daily operations, manage staff, ensure regulatory compliance,
and drive quality improvement initiatives. This role requires strong leadership skills, healthcare
industry knowledge, and the ability to work in a fast-paced environment.

Responsibilities include:
- Managing healthcare operations and staff
- Ensuring compliance with healthcare regulations (HIPAA, Joint Commission)
- Implementing quality improvement programs
- Budget management and financial oversight
- Collaborating with medical staff and department heads
- Analyzing operational metrics and implementing improvements`
}

function generateRequirements(): string[] {
  return [
    "Bachelor's degree in Healthcare Administration or related field",
    '5+ years of healthcare management experience',
    'Knowledge of healthcare regulations and compliance',
    'Strong leadership and communication skills',
    'Experience with EMR/EHR systems',
    'Budget management experience',
    "Master's degree preferred (MHA, MBA, or MPH)",
  ]
}

function calculateMatchScore(job: any, cvContent: string, userProfile: any): number {
  let score = 60 // Base score

  // Check for healthcare keywords
  const healthcareKeywords = ['healthcare', 'hospital', 'clinical', 'medical', 'patient']
  healthcareKeywords.forEach(keyword => {
    if (cvContent.toLowerCase().includes(keyword)) {
      score += 5
    }
  })

  // Check for management experience
  if (cvContent.toLowerCase().includes('manager') || cvContent.toLowerCase().includes('management')) {
    score += 10
  }

  // Cap at 100
  return Math.min(score, 100)
}
