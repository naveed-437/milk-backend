const DashboardStatCard = ({ title, value, description, onClick, icon = '📦', accent = 'blue' }) => {
  return (
    <button type="button" className={`stat-card dashboard-card clickable-card stat-card--${accent}`} onClick={onClick}>
      <div className="stat-card-top">
        <div className="stat-card-icon">{icon}</div>
        <div>
          <p>{title}</p>
          <strong>{value}</strong>
        </div>
      </div>
      <span>{description}</span>
    </button>
  );
};

export default DashboardStatCard;
