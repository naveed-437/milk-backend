import { useEffect, useState } from 'react';

const ProductForm = ({ categories, selectedProduct, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    stock_quantity: '',
    price: '',
    description: '',
    image: null,
    is_active: true,
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        product_name: selectedProduct.product_name || '',
        category: selectedProduct.category || '',
        stock_quantity: selectedProduct.stock_quantity || '',
        price: selectedProduct.price || '',
        description: selectedProduct.description || '',
        image: null,
        is_active: selectedProduct.is_active ?? true,
      });
    } else {
      setFormData({
        product_name: '',
        category: '',
        stock_quantity: '',
        price: '',
        description: '',
        image: null,
        is_active: true,
      });
    }
  }, [selectedProduct]);

  const handleChange = (field) => (event) => {
    const value = field === 'image' ? event.target.files[0] : event.target.value;
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(formData);
    setFormData({
      product_name: '',
      category: '',
      stock_quantity: '',
      price: '',
      description: '',
      image: null,
      is_active: true,
    });
  };

  return (
    <div className="panel-card form-panel">
      <div className="panel-title-row">
        <div>
          <h2>{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
          <span>{selectedProduct ? 'Update product details' : 'Create a new product in inventory'}</span>
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          <span>Product name</span>
          <input type="text" value={formData.product_name} onChange={handleChange('product_name')} required />
        </label>

        <label>
          <span>Category</span>
          <select value={formData.category} onChange={handleChange('category')} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Stock quantity</span>
          <input type="number" value={formData.stock_quantity} onChange={handleChange('stock_quantity')} min="0" required />
        </label>

        <label>
          <span>Price</span>
          <input type="number" value={formData.price} onChange={handleChange('price')} min="0" step="0.01" required />
        </label>

        <label>
          <span>Description</span>
          <textarea value={formData.description} onChange={handleChange('description')} required />
        </label>

        <label>
          <span>Product image</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleChange('image')} />
        </label>

        {selectedProduct?.image_url && (
          <div className="image-preview">
            <img src={selectedProduct.image_url} alt={selectedProduct.product_name} />
          </div>
        )}

        <label className="checkbox-label">
          <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData((current) => ({ ...current, is_active: event.target.checked }))} />
          <span>Active</span>
        </label>

        <div className="form-actions">
          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Saving...' : selectedProduct ? 'Update Product' : 'Add Product'}
          </button>
          {selectedProduct && (
            <button type="button" className="button outline" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
