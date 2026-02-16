import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'office-chores-data';

function loadChores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveChores(chores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chores));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function useChores() {
  const [chores, setChores] = useState(loadChores);
  const [activeCategories, setActiveCategories] = useState(
    () => new Set(['cleaning', 'kitchen', 'supplies', 'maintenance', 'other'])
  );

  useEffect(() => {
    saveChores(chores);
  }, [chores]);

  const addChore = useCallback((chore) => {
    setChores((prev) => [...prev, { ...chore, id: generateId() }]);
  }, []);

  const updateChore = useCallback((id, updates) => {
    setChores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteChore = useCallback((id) => {
    setChores((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setChores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  }, []);

  const toggleCategory = useCallback((category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const filteredChores = useMemo(
    () => chores.filter((c) => activeCategories.has(c.category)),
    [chores, activeCategories]
  );

  return {
    chores: filteredChores,
    allChores: chores,
    addChore,
    updateChore,
    deleteChore,
    toggleComplete,
    activeCategories,
    toggleCategory,
  };
}
