import { useState, useCallback, useEffect } from 'react';
import { categoriesApi } from '../api';
import { CategoryModel } from '../models/CategoryModel';

// Synthetic "All Categories" entry the UI (sidebar counts, filter dropdowns)
// expects at the front of the list. It isn't a real category in the backend.
const ALL_CATEGORY = new CategoryModel({ id: 'all', label: 'All Categories', icon: 'Layers' });

export function useCategoryController() {
  const [categories, setCategories] = useState([ALL_CATEGORY]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.list();
      setCategories([ALL_CATEGORY, ...data.map(c => new CategoryModel(c))]);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Add a new category
   */
  const addCategory = useCallback(async (categoryData) => {
    const draft = new CategoryModel(categoryData);
    const validation = draft.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const created = await categoriesApi.create(draft);
    const model = new CategoryModel(created);
    setCategories(prev => [...prev, model]);
    return model;
  }, []);

  /**
   * Update an existing category
   */
  const updateCategory = useCallback(async (updatedCategoryData) => {
    const draft = new CategoryModel(updatedCategoryData);
    const validation = draft.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }
    if (draft.id === 'all') {
      throw new Error('Cannot modify the default system category.');
    }

    const updated = await categoriesApi.update(draft.id, draft);
    const model = new CategoryModel(updated);
    setCategories(prev => prev.map(cat => (cat.id === model.id ? model : cat)));
    return model;
  }, []);

  /**
   * Delete a category by ID
   */
  const deleteCategory = useCallback(async (categoryId) => {
    if (categoryId === 'all') {
      throw new Error('Cannot delete default system category.');
    }
    await categoriesApi.remove(categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  }, []);

  /**
   * Calculate reports count by category
   */
  const getCategoryUsageCounts = useCallback((reports = []) => {
    const counts = {};
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryUsageCounts,
  };
}
