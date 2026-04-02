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
    const { vessel_name, rank_required, joining_date, port, notes } = body
    if (!vessel_name || !rank_required) return Response.json({ error: 'vessel_name and rank_required are required' }, { status: 400 })
    const { data, error } = await supabase.from('vacancies')
      .insert({ vessel_name, rank_required, joining_date: joining_date||null, port: port||null, notes: notes||null, status: 'open' })
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
