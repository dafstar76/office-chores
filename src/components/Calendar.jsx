import {
  getMonthGrid,
  getWeekDays,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  getChoresForDate,
  generateRecurrences,
  formatHour,
  HOURS,
} from '../utils/calendarHelpers';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import ChoreItem from './ChoreItem';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function expandChores(chores, rangeStart, rangeEnd) {
  const expanded = [];
  for (const chore of chores) {
    expanded.push(...generateRecurrences(chore, rangeStart, rangeEnd));
  }
  return expanded;
}

function MonthView({ currentDate, chores, onDayClick, onChoreClick }) {
  const days = getMonthGrid(currentDate);
  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];
  const expanded = expandChores(chores, rangeStart, rangeEnd);

  return (
    <div className="month-view">
      <div className="day-names">
        {DAY_NAMES.map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}
      </div>
      <div className="month-grid">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayChores = getChoresForDate(expanded, dateStr);
          return (
            <div
              key={dateStr}
              className={`month-cell ${!isSameMonth(day, currentDate) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <span className={`month-cell-date ${isToday(day) ? 'today-badge' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="month-cell-chores">
                {dayChores.slice(0, 3).map((c, i) => (
                  <ChoreItem key={c.id + '-' + i} chore={c} onClick={onChoreClick} />
                ))}
                {dayChores.length > 3 && (
                  <span className="more-chores">+{dayChores.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ currentDate, chores, onDayClick, onChoreClick }) {
  const days = getWeekDays(currentDate);
  const expanded = expandChores(chores, days[0], days[6]);

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-gutter-header" />
        {days.map((day) => (
          <div key={day.toISOString()} className={`week-day-header ${isToday(day) ? 'today' : ''}`}>
            <span className="week-day-name">{format(day, 'EEE')}</span>
            <span className={`week-day-num ${isToday(day) ? 'today-badge' : ''}`}>{format(day, 'd')}</span>
          </div>
        ))}
      </div>
      <div className="week-body">
        {HOURS.map((hour) => (
          <div key={hour} className="week-row">
            <div className="time-gutter">{formatHour(hour)}</div>
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hourStr = hour.toString().padStart(2, '0');
              const hourChores = getChoresForDate(expanded, dateStr).filter(
                (c) => c.startTime && c.startTime.startsWith(hourStr)
              );
              return (
                <div
                  key={dateStr + hour}
                  className="week-cell"
                  onClick={() => onDayClick(day, `${hourStr}:00`)}
                >
                  {hourChores.map((c, i) => (
                    <ChoreItem key={c.id + '-' + i} chore={c} onClick={onChoreClick} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ currentDate, chores, onDayClick, onChoreClick }) {
  const expanded = expandChores(chores, currentDate, currentDate);
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayChores = getChoresForDate(expanded, dateStr);
  const allDayChores = dayChores.filter((c) => !c.startTime);

  return (
    <div className="day-view">
      <div className="day-view-header">
        <span className={`day-view-num ${isToday(currentDate) ? 'today-badge' : ''}`}>
          {format(currentDate, 'd')}
        </span>
        <span className="day-view-name">{format(currentDate, 'EEEE')}</span>
      </div>
      {allDayChores.length > 0 && (
        <div className="all-day-section">
          <div className="time-gutter">All day</div>
          <div className="all-day-chores">
            {allDayChores.map((c, i) => (
              <ChoreItem key={c.id + '-' + i} chore={c} onClick={onChoreClick} />
            ))}
          </div>
        </div>
      )}
      <div className="day-body">
        {HOURS.map((hour) => {
          const hourStr = hour.toString().padStart(2, '0');
          const hourChores = dayChores.filter(
            (c) => c.startTime && c.startTime.startsWith(hourStr)
          );
          return (
            <div key={hour} className="day-row">
              <div className="time-gutter">{formatHour(hour)}</div>
              <div
                className="day-cell"
                onClick={() => onDayClick(currentDate, `${hourStr}:00`)}
              >
                {hourChores.map((c, i) => (
                  <ChoreItem key={c.id + '-' + i} chore={c} onClick={onChoreClick} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar({ view, currentDate, chores, onDayClick, onChoreClick }) {
  const props = { currentDate, chores, onDayClick, onChoreClick };

  if (view === 'week') return <WeekView {...props} />;
  if (view === 'day') return <DayView {...props} />;
  return <MonthView {...props} />;
}
