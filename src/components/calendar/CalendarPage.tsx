'use client'
import { addDays, addMonths, format, startOfMonth } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import MonthGrid from './MonthGrid'
import WeekGrid from './WeekGrid'
import DayGrid from './DayGrid'
import EventModal from './EventModal'

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()))
  const [selected, setSelected] = useState<{ start: Date; end: Date } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const title = useMemo(() => (
    view === 'month' ? format(cursor, 'MMMM yyyy') : format(cursor, 'PPPP')
  ), [view, cursor])

  const jumpPrev = () => setCursor(d => view === 'month' ? addMonths(d, -1) : addDays(d, view === 'week' ? -7 : -1))
  const jumpNext = () => setCursor(d => view === 'month' ? addMonths(d, 1) : addDays(d, view === 'week' ? 7 : 1))

  useEffect(() => { document.title = `AstraCal — ${title}` }, [title])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="text-xl font-semibold">{title}</div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={jumpPrev} className="px-3 py-1.5 border rounded-md bg-white">Prev</button>
          <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 border rounded-md bg-white">Today</button>
          <button onClick={jumpNext} className="px-3 py-1.5 border rounded-md bg-white">Next</button>
          <select value={view} onChange={e => setView(e.target.value as any)} className="px-3 py-1.5 border rounded-md bg-white">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <button onClick={() => setSelected({ start: new Date(), end: new Date() })} className="px-3 py-1.5 rounded-md bg-astro-500 text-white">
            + New
          </button>
        </div>
      </div>

      {view === 'month' && <MonthGrid date={cursor} onSelectRange={setSelected} onOpenEvent={setEditingId} />}
      {view === 'week' && <WeekGrid date={cursor} onSelectRange={setSelected} onOpenEvent={setEditingId} />}
      {view === 'day' && <DayGrid date={cursor} onSelectRange={setSelected} onOpenEvent={setEditingId} />}

      <EventModal selected={selected} editingId={editingId} onClose={() => { setSelected(null); setEditingId(null) }} onSaved={() => {}} />
    </div>
  )
}
