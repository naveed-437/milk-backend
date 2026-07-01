const DashboardStatCard = ({ title, value, description, onClick }) => {
  return (
    <button type="button" className="stat-card dashboard-card clickable-card" onClick={onClick}>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
      <span>{description}</span>
    </button>
  );
};

export default DashboardStatCard;
