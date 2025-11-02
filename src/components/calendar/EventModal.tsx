'use client'
import { formatISO } from 'date-fns'
import { useEffect, useState } from 'react'

export default function EventModal({
  selected,
  editingId,
  onClose,
  onSaved
}: {
  selected: { start: Date; end: Date } | null
  editingId: string | null
  onClose: () => void
  onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>({
    title: '',
    startISO: '',
    endISO: '',
    color: '#2C82F6',
    allDay: false,
    rrule: '',
    exdates: []
  })

  // New event
  useEffect(() => {
    if (selected) {
      setData(d => ({
        ...d,
        title: '',
        startISO: formatISO(selected.start),
        endISO: formatISO(selected.end)
      }))
      setOpen(true)
    }
  }, [selected])

  // Edit existing event
  useEffect(() => {
    if (editingId) {
      setLoading(true)
      fetch(`/api/events/${editingId}`)
        .then(r => r.json())
        .then(e => {
          setData({
            title: e.title ?? '',
            description: e.description ?? '',
            location: e.location ?? '',
            color: e.color ?? '#2C82F6',
            allDay: !!e.allDay,
            startISO: new Date(e.startUTC).toISOString(),
            endISO: new Date(e.endUTC).toISOString(),
            rrule: e.rrule ?? '',
            exdates: e.exdatesUTC ? JSON.parse(e.exdatesUTC) : []
          })
          setOpen(true)
        })
        .finally(() => setLoading(false))
    }
  }, [editingId])

  useEffect(() => {
    if (!open) onClose()
  }, [open])

  // ✅ Improved save handler
  const save = async () => {
    if (!data.title.trim()) {
      alert('Title is required.')
      return
    }
    if (!data.startISO || !data.endISO) {
      alert('Start and End times are required.')
      return
    }

    // Ensure valid ISO strings
    const start = new Date(data.startISO)
    const end = new Date(data.endISO)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Invalid date/time format.')
      return
    }

    setLoading(true)
    const payload = {
      ...data,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      exdates: data.exdates?.filter(Boolean)
    }

    try {
      const res = await fetch(editingId ? `/api/events/${editingId}` : '/api/events', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Error saving event:', err)
        alert(`Failed to save event. (${res.status})`)
      } else {
        setOpen(false)
        onSaved()
      }
    } catch (err) {
      console.error('Network error:', err)
      alert('Network error while saving event.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Delete handler
  const del = async () => {
    if (!editingId) return
    setLoading(true)
    const res = await fetch(`/api/events/${editingId}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) {
      setOpen(false)
      onSaved()
    }
  }

  if (!open) return null

  // ✅ Safe date-to-local conversion
  const toLocalInputValue = (iso: string) => {
    if (!iso) return ''
    const date = new Date(iso)
    if (isNaN(date.getTime())) return ''
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20">
      <div className="w-[520px] max-w-[94vw] rounded-xl bg-white shadow-soft border animate-in">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">
            {editingId ? 'Edit event' : 'Create event'}
          </div>
          <button
            className="text-gray-500 hover:text-black"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-gray-600">Title</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              value={data.title}
              onChange={e => setData({ ...data, title: e.target.value })}
              placeholder="Meeting"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Start</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md px-3 py-2"
                value={toLocalInputValue(data.startISO)}
                onChange={e => {
                  const val = e.target.value
                  const date = new Date(val)
                  if (!isNaN(date.getTime())) {
                    setData({ ...data, startISO: date.toISOString() })
                  }
                }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">End</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md px-3 py-2"
                value={toLocalInputValue(data.endISO)}
                onChange={e => {
                  const val = e.target.value
                  const date = new Date(val)
                  if (!isNaN(date.getTime())) {
                    setData({ ...data, endISO: date.toISOString() })
                  }
                }}
              />
            </div>
          </div>

          {/* Color + All-day */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600">Color</label>
              <input
                type="color"
                className="w-full h-10 border rounded-md"
                value={data.color}
                onChange={e => setData({ ...data, color: e.target.value })}
              />
            </div>
            <label className="flex items-end gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!data.allDay}
                onChange={e => setData({ ...data, allDay: e.target.checked })}
              />
              All day
            </label>
          </div>

          {/* Recurrence */}
          <details className="rounded-md border p-2">
            <summary className="text-sm font-medium">Recurrence</summary>
            <div className="mt-2 grid gap-2">
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="RRULE (optional)"
                value={data.rrule ?? ''}
                onChange={e => setData({ ...data, rrule: e.target.value })}
              />
              <textarea
                className="w-full border rounded-md px-3 py-2 text-xs"
                rows={2}
                placeholder="EXDATEs (comma-separated ISO)"
                value={(data.exdates ?? []).join(',')}
                onChange={e =>
                  setData({
                    ...data,
                    exdates: e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean)
                  })
                }
              />
            </div>
          </details>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="px-3 py-2 border rounded-md"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            {editingId && (
              <button
                className="px-3 py-2 border text-red-600 rounded-md"
                onClick={del}
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button
              className="px-3 py-2 bg-astro-600 text-white rounded-md"
              onClick={save}
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
