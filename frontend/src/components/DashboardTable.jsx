const DashboardTable = ({ title, columns, rows }) => {
  return (
    <div className="panel-card table-panel">
      <div className="panel-title-row">
        <div>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-row">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? ''}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
