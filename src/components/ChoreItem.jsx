import { CATEGORIES } from '../utils/calendarHelpers';

export default function ChoreItem({ chore, onClick }) {
  const cat = CATEGORIES[chore.category] || CATEGORIES.other;

  return (
    <div
      className={`chore-item ${chore.completed ? 'completed' : ''}`}
      style={{ backgroundColor: cat.color + '20', borderLeft: `3px solid ${cat.color}` }}
      onClick={(e) => { e.stopPropagation(); onClick(chore); }}
      title={`${chore.title} – ${chore.assignee || 'Unassigned'}`}
    >
      <span className="chore-title">{chore.title}</span>
      {chore.startTime && <span className="chore-time">{chore.startTime}</span>}
    </div>
  );
}
