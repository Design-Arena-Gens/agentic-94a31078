import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('cv') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' })
    }

    // Read file content
    const buffer = await file.arrayBuffer()
    const content = Buffer.from(buffer).toString('utf-8')

    // Simulate CV parsing (in production, use proper PDF/DOC parsing)
    const cvContent = content

    // Extract profile information using simple parsing
    // In production, use AI/NLP for better extraction
    const profile = {
      name: extractName(cvContent),
      email: extractEmail(cvContent),
      phone: extractPhone(cvContent),
      location: 'United States',
      skills: extractSkills(cvContent),
      experience: extractExperience(cvContent),
    }

    return NextResponse.json({
      success: true,
      cvContent,
      profile,
    })
  } catch (error) {
    console.error('Error processing CV:', error)
    return NextResponse.json({
      success: false,
      error: 'Error processing CV',
    })
  }
}

function extractName(content: string): string {
  // Simple name extraction (first line typically)
  const lines = content.split('\n').filter(line => line.trim())
  return lines[0]?.trim() || 'Healthcare Professional'
}

function extractEmail(content: string): string {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/
  const match = content.match(emailRegex)
  return match ? match[0] : ''
}

function extractPhone(content: string): string {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  const match = content.match(phoneRegex)
  return match ? match[0] : ''
}

function extractSkills(content: string): string[] {
  const skillKeywords = [
    'healthcare management',
    'hospital administration',
    'patient care',
    'budget management',
    'staff supervision',
    'regulatory compliance',
    'quality improvement',
    'EMR/EHR systems',
    'HIPAA',
    'Joint Commission',
    'strategic planning',
    'operations management',
  ]

  return skillKeywords.filter(skill =>
    content.toLowerCase().includes(skill.toLowerCase())
  )
}

function extractExperience(content: string): any[] {
  // Simulate experience extraction
  return [
    {
      title: 'Healthcare Manager',
      years: '5+',
      description: 'Extensive experience in healthcare management',
    },
  ]
}
