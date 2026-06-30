const DashboardHealthCard = ({ label, active, detail, onClick }) => {
  return (
    <button
      type="button"
      className={`health-card ${active ? 'healthy' : 'warning'} clickable-card`}
      onClick={onClick}
    >
      <p>{label}</p>
      <strong>{active ? 'OK' : 'Issue'}</strong>
      <span>{detail}</span>
    </button>
  );
};

export default DashboardHealthCard;
