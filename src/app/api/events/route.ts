import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { EventCreateSchema } from '../../../lib/schema'

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { startUTC: 'asc' } })
    return NextResponse.json(events)
  } catch (e) {
    console.error('Error fetching events:', e)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = EventCreateSchema.parse(body)

    const created = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        color: data.color || '#2C82F6',
        allDay: data.allDay ?? false,
        startUTC: new Date(data.startISO),
        endUTC: new Date(data.endISO),
        timezone: data.timezone ?? 'UTC',
        rrule: data.rrule || '',
        // ✅ FIX: convert array to JSON string
        exdatesUTC: JSON.stringify(data.exdates || []),
        seriesId: data.seriesId
      }
    })

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error('Error creating event:', e)
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 })
  }
}
