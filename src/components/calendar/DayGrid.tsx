'use client'
import { format, startOfDay, endOfDay } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { minutesSinceMidnight } from '../../lib/utils'


const HOUR_HEIGHT = 64

export default function DayGrid({
  date,
  onSelectRange,
  onOpenEvent
}: {
  date: Date
  onSelectRange: (r: { start: Date; end: Date } | null) => void
  onOpenEvent: (id: string) => void
}) {
  const range = useMemo(
    () => ({ start: startOfDay(date), end: endOfDay(date) }),
    [date]
  )

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const qs = new URLSearchParams({
      start: range.start.toISOString(),
      end: range.end.toISOString()
    })
    fetch(`/api/events/query?${qs}`).then(r => r.json()).then(setEvents)
  }, [range])

  const onDouble = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const y = e.clientY - rect.top
    const minutes = Math.round((y / HOUR_HEIGHT) * 60)
    const start = new Date(date)
    start.setHours(0, minutes, 0, 0)
    const end = new Date(start)
    end.setMinutes(start.getMinutes() + 60)
    onSelectRange({ start, end })
  }

  return (
    <div className="rounded-xl border bg-white shadow-soft overflow-hidden">
      <div className="px-4 py-2 border-b text-sm text-gray-600 font-medium bg-gray-50">
        {format(date, 'PPPP')}
      </div>
      <div
        className="grid grid-cols-[56px_1fr]"
        style={{ height: HOUR_HEIGHT * 24 }}
        onDoubleClick={onDouble}
      >
        <div className="relative">
          {Array.from({ length: 24 }).map((_, h) => (
            <div
              key={h}
              className="absolute left-0 right-0 text-[10px] text-gray-500"
              style={{ top: h * HOUR_HEIGHT - 6 }}
            >
              {(h % 12 || 12)}
              {h < 12 ? 'a' : 'p'}
            </div>
          ))}
        </div>
        <div className="relative border-l">
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
                className="absolute left-2 right-2 rounded-md text-white px-2 py-1 text-xs shadow"
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
      </div>
    </div>
  )
}
