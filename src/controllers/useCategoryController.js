import { useState, useCallback } from 'react';
import { categoriesList } from '../data/mockData';
import { CategoryModel } from '../models/CategoryModel';

export function useCategoryController() {
  const [categories, setCategories] = useState(() => 
    categoriesList.map(data => new CategoryModel(data))
  );

  /**
   * Add a new category
   */
  const addCategory = useCallback((categoryData) => {
    const newCategory = new CategoryModel(categoryData);
    const validation = newCategory.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  /**
   * Update an existing category
   */
  const updateCategory = useCallback((updatedCategoryData) => {
    const updatedCategory = new CategoryModel(updatedCategoryData);
    const validation = updatedCategory.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    return updatedCategory;
  }, []);

  /**
   * Delete a category by ID
   */
  const deleteCategory = useCallback((categoryId) => {
    if (categoryId === 'all') {
      throw new Error('Cannot delete default system category.');
    }
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
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryUsageCounts
  };
}
