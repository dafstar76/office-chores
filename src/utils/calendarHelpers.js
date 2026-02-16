import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  getDay,
} from 'date-fns';

export const CATEGORIES = {
  cleaning: { label: 'Cleaning', color: '#0078d4' },
  kitchen: { label: 'Kitchen', color: '#e74c3c' },
  supplies: { label: 'Supplies', color: '#27ae60' },
  maintenance: { label: 'Maintenance', color: '#f39c12' },
  other: { label: 'Other', color: '#8e44ad' },
};

export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function getMonthGrid(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function getWeekDays(date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

export function navigateDate(date, view, direction) {
  const fns = {
    month: direction === 'next' ? addMonths : subMonths,
    week: direction === 'next' ? addWeeks : subWeeks,
    day: direction === 'next' ? addDays : subDays,
  };
  return fns[view](date, 1);
}

export function getHeaderLabel(date, view) {
  if (view === 'month') return format(date, 'MMMM yyyy');
  if (view === 'week') {
    const days = getWeekDays(date);
    return `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d, yyyy')}`;
  }
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function getChoresForDate(chores, dateStr) {
  return chores.filter((c) => c.date === dateStr);
}

export function generateRecurrences(chore, rangeStart, rangeEnd) {
  if (chore.recurrence === 'none') return [chore];

  const results = [];
  const choreDate = new Date(chore.date + 'T00:00:00');
  let current = choreDate;

  const advance =
    chore.recurrence === 'daily'
      ? (d) => addDays(d, 1)
      : chore.recurrence === 'weekly'
      ? (d) => addWeeks(d, 1)
      : (d) => addMonths(d, 1);

  while (current <= rangeEnd) {
    if (current >= rangeStart) {
      results.push({
        ...chore,
        date: format(current, 'yyyy-MM-dd'),
        _recurringParentId: chore.id,
      });
    }
    current = advance(current);
  }

  return results;
}

export { format, isSameMonth, isSameDay, isToday };
