import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import ChoreModal from './components/ChoreModal';
import useChores from './hooks/useChores';
import { navigateDate } from './utils/calendarHelpers';
import './App.css';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState(null);

  const {
    chores,
    addChore,
    updateChore,
    deleteChore,
    activeCategories,
    toggleCategory,
  } = useChores();

  const handleNavigate = useCallback(
    (direction) => setCurrentDate((d) => navigateDate(d, view, direction)),
    [view]
  );

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleDayClick = useCallback((day, time) => {
    setEditingChore({
      date: format(day, 'yyyy-MM-dd'),
      startTime: time || '',
    });
    setModalOpen(true);
  }, []);

  const handleChoreClick = useCallback((chore) => {
    setEditingChore(chore);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (form) => {
      if (form.id) {
        updateChore(form.id, form);
      } else {
        addChore(form);
      }
      setModalOpen(false);
      setEditingChore(null);
    },
    [addChore, updateChore]
  );

  const handleDelete = useCallback(
    (id) => {
      deleteChore(id);
      setModalOpen(false);
      setEditingChore(null);
    },
    [deleteChore]
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingChore(null);
  }, []);

  return (
    <div className="app">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />
      <div className="app-body">
        <Sidebar
          currentDate={currentDate}
          onDateSelect={setCurrentDate}
          activeCategories={activeCategories}
          onToggleCategory={toggleCategory}
        />
        <main className="calendar-main">
          <Calendar
            view={view}
            currentDate={currentDate}
            chores={chores}
            onDayClick={handleDayClick}
            onChoreClick={handleChoreClick}
          />
        </main>
      </div>
      <ChoreModal
        isOpen={modalOpen}
        chore={editingChore}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={handleCloseModal}
      />
    </div>
  );
}
