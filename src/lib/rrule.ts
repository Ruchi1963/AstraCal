import { RRule, RRuleSet, rrulestr } from 'rrule'

export function expandEvent(evt: any, start: Date, end: Date) {
  if (!evt.rrule) return [{
    ...evt, occurrenceId: evt.id, start: new Date(evt.startUTC), end: new Date(evt.endUTC)
  }]
  const set = new RRuleSet()
  set.rrule(rrulestr(evt.rrule))
  for (const x of evt.exdatesUTC ?? []) set.exdate(new Date(x))
  const starts = set.between(start, end, true)
  const dur = +evt.endUTC - +evt.startUTC
  return starts.map(s => ({ ...evt, occurrenceId: evt.id + '::' + +s, start: s, end: new Date(+s + dur) }))
}
