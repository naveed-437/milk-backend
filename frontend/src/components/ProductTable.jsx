const ProductTable = ({ products, onEdit, onDelete, pagination, onPageChange }) => {
  return (
    <div className="panel-card table-panel polished-panel">
      <div className="panel-title-row">
        <div>
          <h2>Product catalog</h2>
          <span>View and manage product inventory with image previews and stock details.</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Product</th>
              <th>Category / Unit</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="table-image-cell">
                    {product.image_url ? <img src={product.image_url} alt={product.product_name} /> : <span className="empty-image">No image</span>}
                  </td>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.category || product.unit || '-'}</td>
                  <td>{product.stock_quantity}</td>
                  <td>₹{product.price || product.price_per_unit || '-'}</td>
                  <td>{product.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="table-actions-cell">
                    <button type="button" className="button secondary" onClick={() => onEdit(product)}>
                      Edit
                    </button>
                    <button type="button" className="button danger" onClick={() => onDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.total > pagination.pageSize && (
        <div className="pagination-controls">
          <button type="button" className="button outline" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
            Previous
          </button>
          <span>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button type="button" className="button outline" disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)} onClick={() => onPageChange(pagination.page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
