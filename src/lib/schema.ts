import { z } from 'zod'

// Frontend sends ISO strings, so we use refine() for flexibility
export const EventCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  allDay: z.boolean().optional(),
  startISO: z.string().refine(v => !isNaN(Date.parse(v)), {
    message: 'Invalid datetime'
  }),
  endISO: z.string().refine(v => !isNaN(Date.parse(v)), {
    message: 'Invalid datetime'
  }),
  timezone: z.string().optional(),
  rrule: z.string().optional(),
  exdates: z.array(z.string()).optional(),
  seriesId: z.string().optional()
})

// For PATCH requests (edits)
export const EventUpdateSchema = EventCreateSchema.partial()
