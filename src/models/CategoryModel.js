/**
 * CategoryModel - Entity and Domain Logic for BackToOwner Item Categories
 */

export const CATEGORY_COLOR_PRESETS = [
  '#0284C7', // Blue
  '#00D2B4', // Brand Teal
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#F43F5E', // Rose
  '#14B8A6', // Cyan Teal
  '#F97316', // Orange
  '#06B6D4', // Sky Blue
  '#7C3AED'  // Deep Violet
];

export class CategoryModel {
  constructor(data = {}) {
    this.id = data.id || CategoryModel.generateSlug(data.label || 'Category');
    this.label = (data.label || '').trim();
    this.icon = data.icon || 'Package';
    this.color = data.color || '#00D2B4';
    this.description = (data.description || '').trim();
    this.active = data.active !== false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  /**
   * Helper to generate a clean URL-friendly and database slug
   */
  static generateSlug(label) {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 32) || `cat_${Date.now()}`;
  }

  /**
   * Validate category properties before persistence
   */
  validate() {
    const errors = [];
    if (!this.label || this.label.length < 2) {
      errors.push('Category name must be at least 2 characters long.');
    }
    if (!this.id) {
      errors.push('Category ID / slug is required.');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Filter manageable categories (excluding "all" placeholder)
 */
export function getManageableCategories(categories = []) {
  return categories.filter(c => c.id !== 'all');
}
