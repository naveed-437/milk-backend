const DashboardHealthCard = ({ label, active, detail, onClick, icon = '✓' }) => {
  return (
    <button
      type="button"
      className={`health-card ${active ? 'healthy' : 'warning'} clickable-card`}
      onClick={onClick}
    >
      <div className="health-card-head">
        <span className="health-card-icon">{icon}</span>
        <p>{label}</p>
      </div>
      <strong>{active ? 'OK' : 'Issue'}</strong>
      <span>{detail}</span>
    </button>
  );
};

export default DashboardHealthCard;
