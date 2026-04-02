import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seafarer_id = searchParams.get('seafarer_id')
    let query = supabase.from('checklist_items').select('*').order('created_at', { ascending: true })
    if (seafarer_id) query = query.eq('seafarer_id', seafarer_id)
    const { data, error } = await query
    if (error) throw error
    return Response.json({ success: true, data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { seafarer_id, items } = body
    if (!seafarer_id) return Response.json({ error: 'seafarer_id is required' }, { status: 400 })
    const rows = Array.isArray(items)
      ? items.map((item: any) => ({ seafarer_id, label: item.label, category: item.category||'general', is_complete: false }))
      : [{ seafarer_id, label: body.label, category: body.category||'general', is_complete: false }]
    const { data, error } = await supabase.from('checklist_items').insert(rows).select()
    if (error) throw error
    return Response.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, is_complete, ...rest } = body
    if (!id) return Response.json({ error: 'id is required' }, { status: 400 })
    const updates: any = { ...rest }
    if (typeof is_complete === 'boolean') {
      updates.is_complete = is_complete
      updates.completed_at = is_complete ? new Date().toISOString() : null
    }
    const { data, error } = await supabase.from('checklist_items').update(updates).eq('id', id).select().single()
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
    const seafarer_id = searchParams.get('seafarer_id')
    if (!id && !seafarer_id) return Response.json({ error: 'id or seafarer_id is required' }, { status: 400 })
    let query = supabase.from('checklist_items').delete()
    if (id) query = query.eq('id', id)
    else if (seafarer_id) query = query.eq('seafarer_id', seafarer_id)
    const { error } = await query
    if (error) throw error
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
