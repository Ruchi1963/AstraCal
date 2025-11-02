'use client'
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { minutesSinceMidnight } from '../../lib/utils' 

const HOUR_HEIGHT = 64 // px per hour

export default function WeekGrid({
  date,
  onSelectRange,
  onOpenEvent
}: {
  date: Date
  onSelectRange: (r: { start: Date; end: Date } | null) => void
  onOpenEvent: (id: string) => void
}) {
  const range = useMemo(() => {
    const start = startOfWeek(date)
    const end = endOfWeek(date)
    return { start, end }
  }, [date])

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const qs = new URLSearchParams({
      start: range.start.toISOString(),
      end: range.end.toISOString()
    })
    fetch(`/api/events/query?${qs}`).then(r => r.json()).then(setEvents)
  }, [range])

  const days: Date[] = []
  for (let i = 0; i < 7; i++) days.push(addDays(range.start, i))

  return (
    <div className="rounded-xl border bg-white shadow-soft overflow-hidden">
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b text-xs text-gray-600 bg-gray-50">
        <div />
        {days.map(d => (
          <div key={+d} className="px-3 py-2 text-center font-medium">
            {format(d, 'EEE d')}
          </div>
        ))}
      </div>
      <div
        className="grid grid-cols-[56px_repeat(7,1fr)]"
        style={{ height: HOUR_HEIGHT * 24 }}
      >
        {/* gutter */}
        <div className="relative">
          {Array.from({ length: 24 }).map((_, h) => (
            <div
              key={h}
              className="absolute left-0 right-0 text-[10px] text-gray-500"
              style={{ top: h * HOUR_HEIGHT - 6 }}
            >
              {format(new Date().setHours(h, 0, 0, 0), 'ha')}
            </div>
          ))}
        </div>

        {days.map(d => (
          <DayColumn
            key={+d}
            day={d}
            events={events.filter(
              e => new Date(e.startISO).toDateString() === d.toDateString()
            )}
            onSelectRange={onSelectRange}
            onOpenEvent={onOpenEvent}
          />
        ))}
      </div>
    </div>
  )
}

function DayColumn({
  day,
  events,
  onSelectRange,
  onOpenEvent
}: {
  day: Date
  events: any[]
  onSelectRange: (r: { start: Date; end: Date } | null) => void
  onOpenEvent: (id: string) => void
}) {
  const onDouble = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const y = e.clientY - rect.top
    const minutes = Math.round((y / HOUR_HEIGHT) * 60)
    const start = new Date(day)
    start.setHours(0, minutes, 0, 0)
    const end = new Date(start)
    end.setMinutes(start.getMinutes() + 60)
    onSelectRange({ start, end })
  }

  return (
    <div className="relative border-l" onDoubleClick={onDouble}>
      {Array.from({ length: 24 }).map((_, h) => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t border-gray-100"
          style={{ top: h * HOUR_HEIGHT }}
        />
      ))}
      {events.map(ev => {
        const s = new Date(ev.startISO),
          e = new Date(ev.endISO)
        const top = (minutesSinceMidnight(s) / 60) * HOUR_HEIGHT
        const height =
          ((e.getTime() - s.getTime()) / (1000 * 60 * 60)) * HOUR_HEIGHT
        return (
          <button
            key={ev.occurrenceId}
            onClick={() => onOpenEvent(ev.id)}
            className="absolute left-1 right-1 rounded-md text-white px-2 py-1 text-xs shadow"
            style={{
              top,
              height,
              backgroundColor: ev.color ?? '#2C82F6'
            }}
          >
            <div className="font-medium truncate">{ev.title}</div>
            <div className="opacity-80 text-[10px]">
              {format(s, 'p')} – {format(e, 'p')}
            </div>
          </button>
        )
      })}
    </div>
  )
}
