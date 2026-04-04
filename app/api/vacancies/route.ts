import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase.from('vacancies').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ success: true, data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vessel, rank, vessel_type, flag, port, joining_date, deadline, salary_usd, contract_months, priority, owner } = body
    if (!vessel || !rank) return Response.json({ error: 'vessel and rank are required' }, { status: 400 })
    const { data, error } = await supabase.from('vacancies')
      .insert({ vessel, rank, vessel_type: vessel_type||null, flag: flag||null, port: port||null, joining_date: joining_date||null, deadline: deadline||null, salary_usd: salary_usd||null, contract_months: contract_months||3, priority: priority||"normal", owner: owner||null, status: "open", candidates: 0 })
      .select().single()
    if (error) throw error
    return Response.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return Response.json({ error: 'id is required' }, { status: 400 })
    const { data, error } = await supabase.from('vacancies').update(updates).eq('id', id).select().single()
    if (error) throw error
    return Response.json({ success: true, data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'id is required' }, { status: 400 })
    const { error } = await supabase.from('vacancies').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
