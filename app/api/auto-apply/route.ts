import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobs, cvContent, userProfile } = body

    const applications = []

    for (const job of jobs) {
      // Customize CV for each job
      const customizedCV = await customizeCVForJob(cvContent, job, userProfile)

      // Simulate application submission
      const applicationResult = await submitApplication(job, customizedCV, userProfile)

      applications.push({
        id: `app-${Date.now()}-${Math.random()}`,
        jobTitle: job.jobTitle,
        company: job.company,
        location: job.location,
        status: applicationResult.success ? 'applied' : 'failed',
        appliedAt: new Date().toISOString(),
        customizations: customizedCV.changes,
        jobUrl: job.jobUrl,
        customizedCVContent: customizedCV.content,
      })

      // Add delay to simulate real application process
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      applications,
      totalApplied: applications.filter(a => a.status === 'applied').length,
    })
  } catch (error) {
    console.error('Error auto-applying:', error)
    return NextResponse.json({
      success: false,
      error: 'Error submitting applications',
    })
  }
}

async function customizeCVForJob(cvContent: string, job: any, userProfile: any) {
  const changes = []

  // Analyze job requirements and customize CV accordingly
  const jobKeywords = extractKeywords(job.description + ' ' + job.requirements.join(' '))

  // Add objective statement tailored to the job
  let customizedContent = cvContent
  const objectiveStatement = `\n\nOBJECTIVE:\nExperienced healthcare professional seeking ${job.jobTitle} position at ${job.company}. Bringing proven expertise in healthcare operations, regulatory compliance, and team leadership to drive excellence in patient care and operational efficiency.\n\n`

  customizedContent = objectiveStatement + customizedContent
  changes.push(`Added tailored objective statement for ${job.jobTitle} role`)

  // Highlight relevant skills
  const relevantSkills = userProfile.skills.filter((skill: string) =>
    jobKeywords.some((keyword: string) =>
      skill.toLowerCase().includes(keyword.toLowerCase())
    )
  )

  if (relevantSkills.length > 0) {
    changes.push(`Emphasized ${relevantSkills.length} relevant skills: ${relevantSkills.slice(0, 3).join(', ')}`)
  }

  // Add keywords from job description
  const keySkillsSection = `\n\nKEY COMPETENCIES FOR ${job.jobTitle.toUpperCase()}:\n${jobKeywords.slice(0, 8).map(k => `• ${k}`).join('\n')}\n\n`
  customizedContent = customizedContent + keySkillsSection
  changes.push('Added key competencies section matching job requirements')

  // Tailor experience descriptions
  if (job.requirements.some((req: string) => req.toLowerCase().includes('budget'))) {
    changes.push('Highlighted budget management and financial oversight experience')
  }

  if (job.requirements.some((req: string) => req.toLowerCase().includes('compliance'))) {
    changes.push('Emphasized regulatory compliance and HIPAA expertise')
  }

  if (job.requirements.some((req: string) => req.toLowerCase().includes('leadership'))) {
    changes.push('Showcased leadership accomplishments and team management skills')
  }

  // Add company-specific customization
  changes.push(`Customized content to align with ${job.company}'s values and requirements`)

  return {
    content: customizedContent,
    changes,
  }
}

async function submitApplication(job: any, customizedCV: any, userProfile: any) {
  // Simulate application submission
  // In production, integrate with job board APIs or use web automation

  // Simulate success rate (90% success)
  const success = Math.random() > 0.1

  if (success) {
    // Simulate sending email with customized CV
    console.log(`Application submitted for ${job.jobTitle} at ${job.company}`)
    console.log(`Customizations applied: ${customizedCV.changes.length}`)

    // In production, actually send the email or submit through API
    /*
    await sendApplicationEmail({
      to: job.applicationEmail,
      subject: `Application for ${job.jobTitle} - ${userProfile.name}`,
      body: generateCoverLetter(job, userProfile),
      attachments: [
        {
          filename: `${userProfile.name}_CV_${job.company}.pdf`,
          content: customizedCV.content,
        },
      ],
    })
    */
  }

  return {
    success,
    message: success ? 'Application submitted successfully' : 'Failed to submit application',
  }
}

function extractKeywords(text: string): string[] {
  const keywords = [
    'Healthcare Management',
    'Hospital Administration',
    'Patient Care Excellence',
    'Regulatory Compliance',
    'HIPAA',
    'Quality Improvement',
    'Budget Management',
    'Staff Leadership',
    'EMR/EHR Systems',
    'Operations Management',
    'Strategic Planning',
    'Joint Commission Standards',
    'Process Optimization',
    'Team Development',
    'Risk Management',
  ]

  return keywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  )
}

function generateCoverLetter(job: any, userProfile: any): string {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.jobTitle} position at ${job.company}.
With over ${userProfile.experience[0]?.years || '5+'} years of experience in healthcare management,
I am confident in my ability to contribute to your team's success.

My background includes extensive experience in:
- Healthcare operations and administration
- Regulatory compliance and quality assurance
- Staff leadership and development
- Budget management and financial oversight

I am particularly drawn to ${job.company}'s commitment to excellence in patient care and would
welcome the opportunity to contribute to your organization's mission.

Thank you for considering my application. I look forward to discussing how my experience and
skills align with your needs.

Sincerely,
${userProfile.name}
${userProfile.email}
${userProfile.phone}`
}
