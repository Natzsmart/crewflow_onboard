import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  // Check the secret
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all active seafarers
    const { data: seafarers, error } = await supabase
      .from('seafarers')
      .select('*')
      .neq('relief_status', 'complete')

    if (error) throw error

    const triggered: string[] = []
    const today = new Date()

    for (const seafarer of seafarers || []) {
      if (!seafarer.sign_off_date) continue

      const signOff = new Date(seafarer.sign_off_date)
      const daysLeft = Math.ceil((signOff.getTime() - today.getTime()) / 86400000)

      // Check if this seafarer hits a trigger point
      if ([28, 14, 7, 0, -1].includes(daysLeft)) {
        const triggerType = daysLeft <= 0 ? 'overdue' : `${daysLeft}_day`

        // Check if alert already sent today
        const { data: existing } = await supabase
          .from('relief_alerts')
          .select('id')
          .eq('seafarer_id', seafarer.id)
          .eq('trigger_type', triggerType)
          .gte('sent_at', new Date(Date.now() - 86400000).toISOString())
          .limit(1)

        if (existing?.length) continue

        // Send Telegram alert
        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_OPS_CHAT_ID

        if (botToken && chatId) {
          const message = `🚨 *CrewFlow Relief Alert*\n\n*${seafarer.full_name}* (${seafarer.rank})\nSign-off: ${seafarer.sign_off_date}\nDays remaining: *${daysLeft <= 0 ? 'OVERDUE' : daysLeft}*\n\nAction required in CrewFlow.`

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'Markdown'
            })
          })
        }

        // Log the alert
        await supabase.from('relief_alerts').insert({
          seafarer_id: seafarer.id,
          trigger_type: triggerType,
          recipient_type: 'manager',
          channels: ['telegram'],
          status: 'sent'
        })

        triggered.push(`${seafarer.full_name} (${triggerType})`)
      }
    }

    return Response.json({
      success: true,
      triggered_count: triggered.length,
      triggered
    })

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}