import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
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
  Book,
  Layers
} from 'lucide-react';

export const AVAILABLE_ICONS = [
  { name: 'Smartphone', component: Smartphone, label: 'Electronics / Phones' },
  { name: 'Wallet', component: Wallet, label: 'Wallets & Cash' },
  { name: 'Dog', component: Dog, label: 'Pets & Animals' },
  { name: 'Key', component: Key, label: 'Keys & Fobs' },
  { name: 'Briefcase', component: Briefcase, label: 'Bags & Luggage' },
  { name: 'FileText', component: FileText, label: 'Documents & IDs' },
  { name: 'Watch', component: Watch, label: 'Jewelry & Watches' },
  { name: 'Shirt', component: Shirt, label: 'Clothing & Apparel' },
  { name: 'Glasses', component: Glasses, label: 'Eyewear & Sunglasses' },
  { name: 'Laptop', component: Laptop, label: 'Computers & Tablets' },
  { name: 'Camera', component: Camera, label: 'Cameras & Photography' },
  { name: 'Headphones', component: Headphones, label: 'Audio & Earphones' },
  { name: 'Bike', component: Bike, label: 'Bicycles & Scooters' },
  { name: 'Car', component: Car, label: 'Vehicles & Accessories' },
  { name: 'Music', component: Music, label: 'Musical Instruments' },
  { name: 'Umbrella', component: Umbrella, label: 'Accessories' },
  { name: 'Book', component: Book, label: 'Books & Textbooks' },
  { name: 'ShoppingBag', component: ShoppingBag, label: 'Shopping Goods' },
  { name: 'Baby', component: Baby, label: 'Baby & Kids Items' },
  { name: 'Package', component: Package, label: 'Other Packages' }
];

export const PRESET_COLORS = [
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

export default function CategoryModal({ 
  category = null, 
  onClose, 
  onSave 
}) {
  const isEditing = Boolean(category && category.id && category.id !== 'all');

  const [label, setLabel] = useState(category ? category.label : '');
  const [selectedIcon, setSelectedIcon] = useState(category ? category.icon : 'Package');
  const [selectedColor, setSelectedColor] = useState(category ? (category.color || '#00D2B4') : '#00D2B4');
  const [description, setDescription] = useState(category?.description || '');
  const [isActive, setIsActive] = useState(category?.active !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) {
      alert('Please enter a category name.');
      return;
    }

    const id = isEditing 
      ? category.id 
      : label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 24) || `cat_${Date.now()}`;

    onSave({
      id,
      label: label.trim(),
      icon: selectedIcon,
      color: selectedColor,
      description: description.trim(),
      active: isActive
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: `${selectedColor}20`, 
                color: selectedColor, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              {(() => {
                const IconObj = AVAILABLE_ICONS.find(i => i.name === selectedIcon) || AVAILABLE_ICONS[0];
                const IconComponent = IconObj.component;
                return <IconComponent size={20} />;
              })()}
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                {isEditing ? `Edit Category: ${category.label}` : 'Create New Category'}
              </h2>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                Available to mobile app users when reporting lost or found items
              </div>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
            {/* Category Name */}
            <div className="form-group">
              <label className="form-label">Category Title / Name *</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g., Musical Instruments, Sports Gear, Eyewear"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description & Instructions for Mobile Users</label>
              <textarea 
                className="form-textarea"
                rows="2"
                placeholder="Guidelines on what items belong here and required serial/proof details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Color Picker */}
            <div className="form-group">
              <label className="form-label">Category Badge Theme Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: c,
                      border: selectedColor === c ? '3px solid #FFFFFF' : '2px solid transparent',
                      boxShadow: selectedColor === c ? `0 0 0 2px ${c}, 0 2px 8px rgba(0,0,0,0.2)` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    {selectedColor === c && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker Grid */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Category Vector Icon</label>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(5, 1fr)', 
                  gap: '8px', 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  padding: '8px', 
                  background: '#F8FAFC', 
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0' 
                }}
              >
                {AVAILABLE_ICONS.map(iconObj => {
                  const IconComp = iconObj.component;
                  const isSelected = selectedIcon === iconObj.name;
                  return (
                    <button
                      key={iconObj.name}
                      type="button"
                      onClick={() => setSelectedIcon(iconObj.name)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        background: isSelected ? `${selectedColor}18` : '#FFFFFF',
                        border: isSelected ? `2px solid ${selectedColor}` : '1px solid #E2E8F0',
                        color: isSelected ? selectedColor : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title={iconObj.label}
                    >
                      <IconComp size={20} color={isSelected ? selectedColor : '#64748B'} />
                      <span style={{ fontSize: '10px', fontWeight: isSelected ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {iconObj.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ background: `linear-gradient(135deg, ${selectedColor} 0%, #00D2B4 100%)`, padding: '10px 22px' }}
            >
              <Check size={16} />
              <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
