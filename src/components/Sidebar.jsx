import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { useState } from 'react';
import { CATEGORIES } from '../utils/calendarHelpers';

export default function Sidebar({ currentDate, onDateSelect, activeCategories, onToggleCategory }) {
  const [miniDate, setMiniDate] = useState(currentDate);

  const monthStart = startOfMonth(miniDate);
  const monthEnd = endOfMonth(miniDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <aside className="sidebar">
      <div className="mini-calendar">
        <div className="mini-header">
          <button className="btn btn-nav-sm" onClick={() => setMiniDate(subMonths(miniDate, 1))}>‹</button>
          <span className="mini-title">{format(miniDate, 'MMMM yyyy')}</span>
          <button className="btn btn-nav-sm" onClick={() => setMiniDate(addMonths(miniDate, 1))}>›</button>
        </div>
        <div className="mini-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="mini-day-label">{d}</div>
          ))}
          {days.map((day) => (
            <button
              key={day.toISOString()}
              className={`mini-day ${!isSameMonth(day, miniDate) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''} ${isSameDay(day, currentDate) ? 'selected' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      <div className="category-filters">
        <h4>Categories</h4>
        {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
          <label key={key} className="category-filter">
            <input
              type="checkbox"
              checked={activeCategories.has(key)}
              onChange={() => onToggleCategory(key)}
            />
            <span className="category-dot" style={{ backgroundColor: color }} />
            {label}
          </label>
        ))}
      </div>
    </aside>
  );
}
