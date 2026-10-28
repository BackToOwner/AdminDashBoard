import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { CategoryModel } from '../models/CategoryModel';

export function useCategoryController() {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  const request = useCallback(async (path = '', options = {}) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      throw new Error('Please log in as an administrator.');
    }

    const response = await fetch(`${API_BASE_URL}/categories${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Category request failed.');
    }

    return result.data;
  }, []);

  const refreshCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError('');

    try {
      const data = await request();
      setCategories(data.map(item => new CategoryModel(item)));
    } catch (error) {
      setCategoriesError(error.message || 'Failed to load categories.');
    } finally {
      setCategoriesLoading(false);
    }
  }, [request]);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const addCategory = useCallback(async (categoryData) => {
    const newCategory = new CategoryModel(categoryData);
    const validation = newCategory.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const saved = await request('', {
      method: 'POST',
      body: JSON.stringify({
        id: newCategory.id,
        label: newCategory.label,
        icon: newCategory.icon,
        color: newCategory.color,
        description: newCategory.description,
      }),
    });

    const category = new CategoryModel(saved);
    setCategories(prev => [...prev.filter(item => item.id !== category.id), category]);
    setCategoriesError('');
    return category;
  }, [request]);

  const updateCategory = useCallback(async (updatedCategoryData) => {
    const updatedCategory = new CategoryModel(updatedCategoryData);
    const validation = updatedCategory.validate();

    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const saved = await request(`/${encodeURIComponent(updatedCategory.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        label: updatedCategory.label,
        icon: updatedCategory.icon,
        color: updatedCategory.color,
        description: updatedCategory.description,
        active: updatedCategory.active,
      }),
    });

    const category = new CategoryModel(saved);
    setCategories(prev => prev.map(item => item.id === category.id ? category : item));
    setCategoriesError('');
    return category;
  }, [request]);

  const deleteCategory = useCallback(async (categoryId) => {
    if (categoryId === 'all') {
      throw new Error('Cannot delete the default system category.');
    }

    await request(`/${encodeURIComponent(categoryId)}`, {
      method: 'DELETE',
    });

    setCategories(prev => prev.filter(item => item.id !== categoryId));
    setCategoriesError('');
  }, [request]);

  const getCategoryUsageCounts = useCallback((reports = []) => {
    const counts = {};

    reports.forEach(report => {
      counts[report.category] = (counts[report.category] || 0) + 1;
    });

    return counts;
  }, []);

  return {
    categories,
    categoriesLoading,
    categoriesError,
    refreshCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryUsageCounts,
  };
}
