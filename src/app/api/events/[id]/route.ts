import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { EventUpdateSchema } from '../../../../lib/schema'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const e = await prisma.event.findUnique({ where: { id: params.id } })
    if (!e) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(e)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const data = EventUpdateSchema.parse(body)

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.location && { location: data.location }),
        ...(data.color && { color: data.color }),
        ...(typeof data.allDay === 'boolean' && { allDay: data.allDay }),
        ...(data.startISO && { startUTC: new Date(data.startISO) }),
        ...(data.endISO && { endUTC: new Date(data.endISO) }),
        ...(data.timezone && { timezone: data.timezone }),
        ...(data.rrule !== undefined && { rrule: data.rrule }),
        ...(data.exdates && { exdatesUTC: data.exdates })
      }
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
