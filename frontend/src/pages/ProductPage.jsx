import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('page', page);
    params.set('pageSize', pageSize);
    return params.toString();
  }, [search, selectedCategory, page, pageSize]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/products?${queryParams}`);
      const { products: dataProducts, pagination: pageData } = response.data.data;
      setProducts(dataProducts || []);
      setPagination(pageData || { page, pageSize, total: 0 });
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to load products.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/products/categories');
      setCategories(response.data.data.categories || []);
    } catch (error) {
      setToast({ type: 'error', message: 'Unable to fetch categories.' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [queryParams]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
  };

  const showToast = (toastData) => {
    setToast(toastData);
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProduct = async (formData) => {
    const productData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        productData.append(key, value);
      }
    });

    try {
      setLoading(true);
      let response;

      if (selectedProduct) {
        response = await axiosInstance.put(`/products/${selectedProduct.id}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast({ type: 'success', message: 'Product updated successfully.' });
      } else {
        response = await axiosInstance.post('/products', productData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast({ type: 'success', message: 'Product added successfully.' });
      }

      setSelectedProduct(null);
      fetchProducts();
      return response.data.data;
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to save product.' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/products/${id}`);
      showToast({ type: 'success', message: 'Product deleted successfully.' });
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
      fetchProducts();
    } catch (error) {
      showToast({ type: 'error', message: error.response?.data?.error || 'Unable to delete product.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-page page-shell">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Product Management</p>
          <h1>Manage milk products with inventory, categories, and pricing.</h1>
        </div>
      </div>

      <div className="product-grid">
        <aside className="product-sidebar">
          <ProductForm
            categories={categories}
            selectedProduct={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={handleClearSelection}
            loading={loading}
          />
        </aside>

        <main className="product-main">
          <div className="filter-panel">
            <div className="filter-inputs">
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-meta">
              <p>{pagination.total} products found</p>
            </div>
          </div>

          {toast && <Toast type={toast.type} message={toast.message} />}

          {loading ? (
            <LoadingSkeleton count={pageSize} />
          ) : (
            <ProductTable
              products={products}
              onEdit={handleSelectProduct}
              onDelete={handleDeleteProduct}
              pagination={pagination}
              onPageChange={(nextPage) => setPage(nextPage)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
