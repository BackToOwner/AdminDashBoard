import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Smartphone, 
  Wallet, 
  Dog, 
  Key, 
  Briefcase, 
  FileText, 
  Watch, 
  Shirt, 
  Glasses, 
  Package, 
  Heart, 
  Bike, 
  Car, 
  Music, 
  Camera, 
  Headphones, 
  Laptop, 
  Umbrella, 
  Baby, 
  ShoppingBag, 
  CreditCard, 
  Sparkles, 
  Book
} from 'lucide-react';
import CategoryModal, { AVAILABLE_ICONS } from './CategoryModal';

export default function CategoryManager({ 
  categories = [], 
  items = [], 
  onAddCategory, 
  onUpdateCategory, 
  onDeleteCategory,
  onShowToast
}) {
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Filter out 'all' placeholder for direct management list
  const manageableCategories = categories.filter(c => c.id !== 'all');

  const filteredCategories = manageableCategories.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const getItemCountForCategory = (catId) => {
    return items.filter(i => i.category === catId).length;
  };

  const getCategoryIconComponent = (iconName) => {
    const iconObj = AVAILABLE_ICONS.find(i => i.name === iconName);
    return iconObj ? iconObj.component : Package;
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;
    const catName = categoryToDelete.label;
    onDeleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
    if (onShowToast) {
      onShowToast({
        title: 'Category Deleted',
        message: `Category "${catName}" has been removed from BackToOwner.`,
        type: 'alert'
      });
    }
  };

  return (
    <div className="bto-card" style={{ padding: '24px' }}>
      {/* Header & Add Button */}
      <div className="card-header-clean" style={{ flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <div className="card-title">
            <Layers size={20} color="#00D2B4" />
            <span>Category Management</span>
            <span style={{ fontSize: '11px', background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              {manageableCategories.length} Active Categories
            </span>
          </div>
          <div className="card-subtitle">
            Create, modify, and delete categories available to mobile app users and finders
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              className="form-input"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', height: '36px', fontSize: '12.5px', borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          {/* Add Category Button */}
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ padding: '8px 16px', fontSize: '13px', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#FAFBFD', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 18px' }}>Category Name</th>
              <th style={{ padding: '14px 18px' }}>Category ID / Slug</th>
              <th style={{ padding: '14px 18px' }}>Color Accent</th>
              <th style={{ padding: '14px 18px' }}>Active Reports</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const IconComponent = getCategoryIconComponent(cat.icon);
                const count = getItemCountForCategory(cat.id);
                return (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div 
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '10px', 
                            background: `${cat.color || '#00D2B4'}18`, 
                            color: cat.color || '#00D2B4', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: `1px solid ${cat.color || '#00D2B4'}35`
                          }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px' }}>{cat.label}</div>
                          {cat.description && (
                            <div style={{ fontSize: '11px', color: '#94A3B8', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cat.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 18px' }}>
                      <code style={{ fontSize: '11.5px', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', color: '#475569' }}>
                        {cat.id}
                      </code>
                    </td>

                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: cat.color || '#00D2B4', display: 'inline-block', boxShadow: `0 0 6px ${cat.color || '#00D2B4'}` }} />
                        <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>{cat.color || '#00D2B4'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontWeight: 700, color: count > 0 ? '#0F172A' : '#94A3B8', fontSize: '13px' }}>
                        {count} items
                      </span>
                    </td>

                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                        Active in App
                      </span>
                    </td>

                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {/* Edit Button */}
                        <button
                          className="btn-secondary"
                          onClick={() => setEditingCategory(cat)}
                          style={{ padding: '6px 10px', fontSize: '12px', color: '#0077EE', gap: '4px' }}
                          title="Edit Category"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn-secondary"
                          onClick={() => setCategoryToDelete(cat)}
                          style={{ padding: '6px 10px', fontSize: '12px', color: '#EF4444', borderColor: '#FCA5A5', gap: '4px' }}
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                  No categories found matching "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Add New Category */}
      {showAddModal && (
        <CategoryModal 
          onClose={() => setShowAddModal(false)}
          onSave={(newCat) => {
            onAddCategory(newCat);
            if (onShowToast) {
              onShowToast({
                title: 'Category Created! 🎉',
                message: `New category "${newCat.label}" is now live for mobile app users.`,
                type: 'success'
              });
            }
          }}
        />
      )}

      {/* Modal: Edit Existing Category */}
      {editingCategory && (
        <CategoryModal 
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={(updatedCat) => {
            onUpdateCategory(updatedCat);
            if (onShowToast) {
              onShowToast({
                title: 'Category Updated',
                message: `Category "${updatedCat.label}" has been updated.`,
                type: 'info'
              });
            }
          }}
        />
      )}

      {/* Confirmation Dialog: Delete Category */}
      {categoryToDelete && (
        <div className="modal-backdrop" onClick={() => setCategoryToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
                <AlertTriangle size={22} />
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Confirm Category Deletion</h3>
              </div>
            </div>

            <div className="modal-body" style={{ paddingTop: '12px' }}>
              <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                Are you sure you want to delete the category <strong>"{categoryToDelete.label}"</strong>?
              </p>
              {getItemCountForCategory(categoryToDelete.id) > 0 && (
                <div style={{ marginTop: '12px', padding: '10px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '12px', color: '#991B1B' }}>
                  ⚠️ Warning: There are <strong>{getItemCountForCategory(categoryToDelete.id)} registered items</strong> currently using this category.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setCategoryToDelete(null)}>
                Cancel
              </button>
              <button 
                className="btn-lost" 
                onClick={handleDeleteConfirm}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                <Trash2 size={15} />
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
