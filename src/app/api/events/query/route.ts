import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { expandEvent } from '../../../../lib/rrule'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startISO = searchParams.get('start')
    const endISO = searchParams.get('end')

    if (!startISO || !endISO) {
      return NextResponse.json({ error: 'start & end required' }, { status: 400 })
    }

    const windowStart = new Date(startISO)
    const windowEnd = new Date(endISO)

    const candidates = await prisma.event.findMany({
      where: {
        OR: [
          { rrule: { not: null } },
          {
            AND: [
              { startUTC: { lte: windowEnd } },
              { endUTC: { gte: windowStart } }
            ]
          }
        ]
      }
    })

    const occurrences = candidates
      .flatMap(evt => expandEvent(evt as any, windowStart, windowEnd))
      .filter(o => o.end > windowStart && o.start < windowEnd)
      .sort((a, b) => +a.start - +b.start)

    return NextResponse.json(occurrences.map(o => ({
      id: o.id,
      occurrenceId: o.occurrenceId,
      title: o.title,
      color: o.color,
      startISO: o.start.toISOString(),
      endISO: o.end.toISOString(),
      allDay: o.allDay
    })))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch occurrences' }, { status: 500 })
  }
}
