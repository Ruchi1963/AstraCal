'use client'
import { addDays, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

export default function MonthGrid({ date, onSelectRange, onOpenEvent }: {
  date: Date, onSelectRange: (r: { start: Date; end: Date } | null) => void, onOpenEvent: (id: string) => void
}) {
  const range = useMemo(() => {
    const start = startOfWeek(startOfMonth(date))
    const end = endOfWeek(endOfMonth(date))
    return { start, end }
  }, [date])

  const [events, setEvents] = useState<any[]>([])
  useEffect(() => {
    const qs = new URLSearchParams({ start: range.start.toISOString(), end: range.end.toISOString() })
    fetch(`/api/events/query?${qs}`).then(r => r.json()).then(setEvents)
  }, [range])

  const days: Date[] = []
  for (let d = range.start; d <= range.end; d = addDays(d, 1)) days.push(d)

  return (
    <div className="border rounded-xl bg-white shadow-soft">
      <div className="grid grid-cols-7 text-xs border-b text-gray-500">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="px-3 py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {days.map((d, i) => {
          const dayEvents = events.filter(e => {
            const s = new Date(e.startISO), nd = new Date(e.endISO)
            return s <= addDays(d, 1) && nd >= d
          })
          return (
            <div key={i} className={`border p-2 ${!isSameMonth(d, date) ? 'bg-gray-50 text-gray-400' : ''}`} onDoubleClick={() => onSelectRange({ start: d, end: d })}>
              <div className="text-xs font-semibold mb-1">{format(d, 'd')}</div>
              {dayEvents.slice(0, 3).map(ev =>
                <button key={ev.occurrenceId} onClick={() => onOpenEvent(ev.id)} className="truncate rounded bg-astro-500 text-white px-2 py-0.5 text-xs mb-1">
                  {ev.title}
                </button>
              )}
              {dayEvents.length > 3 && <div className="text-xs text-astro-600">+{dayEvents.length - 3} more</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
