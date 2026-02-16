import { getHeaderLabel } from '../utils/calendarHelpers';

const VIEWS = ['month', 'week', 'day'];

export default function CalendarHeader({ currentDate, view, onViewChange, onNavigate, onToday }) {
  return (
    <div className="calendar-header">
      <div className="header-left">
        <button className="btn btn-today" onClick={onToday}>Today</button>
        <button className="btn btn-nav" onClick={() => onNavigate('prev')}>‹</button>
        <button className="btn btn-nav" onClick={() => onNavigate('next')}>›</button>
        <h2 className="header-title">{getHeaderLabel(currentDate, view)}</h2>
      </div>
      <div className="header-right">
        <div className="view-switcher">
          {VIEWS.map((v) => (
            <button
              key={v}
              className={`btn btn-view ${view === v ? 'active' : ''}`}
              onClick={() => onViewChange(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
