const DashboardSection = ({ title, children }) => (
  <section className="dashboard-section">
    <div className="panel-title-row">
      <div>
        <h2>{title}</h2>
      </div>
    </div>
    {children}
  </section>
);

export default DashboardSection;
