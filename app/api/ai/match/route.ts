import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { vacancy, seafarers } = await request.json()

    if (!vacancy || !seafarers?.length) {
      return Response.json({ error: 'vacancy and seafarers are required' }, { status: 400 })
    }

    const prompt = `You are an expert maritime crewing officer. Match seafarers to this vacancy.

VACANCY:
- Vessel: ${vacancy.vessel}
- Rank Required: ${vacancy.rank}
- Port: ${vacancy.port || 'Not specified'}
- Contract: ${vacancy.contract_months || 3} months

AVAILABLE SEAFARERS:
${seafarers.map((s: any, i: number) => `${i + 1}. ${s.full_name} | Rank: ${s.rank} | Experience: ${s.experience_years || 0} years | Nationality: ${s.nationality || 'N/A'} | Rating: ${s.overall_rating || 0}/5`).join('\n')}

Respond ONLY with this JSON, no other text:
{"matches":[{"name":"Full Name","score":95,"reason":"Brief reason"}]}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 300,
      })
    })

    const data = await response.json()

    // Debug: return raw response if something fails
    if (!data.choices?.[0]?.message?.content) {
      return Response.json({ error: 'No response from Groq', debug: data })
    }

    const text = data.choices[0].message.content
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'Could not parse AI response', raw: text })
    }

    const parsed = JSON.parse(jsonMatch[0])
    return Response.json({ success: true, ...parsed })

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
