import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/calendarHelpers';

const EMPTY_CHORE = {
  title: '',
  assignee: '',
  date: '',
  startTime: '',
  endTime: '',
  category: 'cleaning',
  recurrence: 'none',
  completed: false,
  notes: '',
};

export default function ChoreModal({ isOpen, chore, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(EMPTY_CHORE);

  useEffect(() => {
    if (chore) {
      setForm({ ...EMPTY_CHORE, ...chore });
    } else {
      setForm(EMPTY_CHORE);
    }
  }, [chore, isOpen]);

  if (!isOpen) return null;

  const isEditing = chore && chore.id;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    onSave(form);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Chore' : 'New Chore'}</h3>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Clean kitchen counters"
              autoFocus
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Assignee</label>
              <input
                type="text"
                value={form.assignee}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="Who's responsible?"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {Object.entries(CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Recurrence</label>
              <select
                value={form.recurrence}
                onChange={(e) => handleChange('recurrence', e.target.value)}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Any additional details..."
            />
          </div>
          {isEditing && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.completed}
                  onChange={(e) => handleChange('completed', e.target.checked)}
                />
                Mark as completed
              </label>
            </div>
          )}
          <div className="modal-actions">
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDelete(chore.id)}
              >
                Delete
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
