import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase.from('seafarers').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ success: true, data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, rank, nationality, email, whatsapp, telegram_id, sign_off_date, experience_years } = body
    if (!full_name || !rank) return Response.json({ error: 'full_name and rank are required' }, { status: 400 })
    let urgency_level = 'on_track'
    if (sign_off_date) {
      const days = Math.ceil((new Date(sign_off_date).getTime() - Date.now()) / 86400000)
      urgency_level = days <= 0 ? 'overdue' : days <= 7 ? 'critical' : days <= 14 ? 'high' : days <= 28 ? 'medium' : 'on_track'
    }
    const { data, error } = await supabase.from('seafarers')
      .insert({ full_name, rank, nationality: nationality||null, email: email||null, whatsapp: whatsapp||null, telegram_id: telegram_id||null, sign_off_date: sign_off_date||null, experience_years: experience_years ? parseInt(experience_years) : 0, is_available: true, relief_status: 'unassigned', urgency_level })
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
    if (updates.sign_off_date) {
      const days = Math.ceil((new Date(updates.sign_off_date).getTime() - Date.now()) / 86400000)
      updates.urgency_level = days <= 0 ? 'overdue' : days <= 7 ? 'critical' : days <= 14 ? 'high' : days <= 28 ? 'medium' : 'on_track'
    }
    const { data, error } = await supabase.from('seafarers').update(updates).eq('id', id).select().single()
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
    const { error } = await supabase.from('seafarers').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
