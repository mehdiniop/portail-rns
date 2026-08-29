function priorityTone(priority) {
  return String(priority?.value || '').trim() || 'none';
}

export default function IncidentTable({ incidents, onEdit }) {
  if (incidents.length === 0) {
    return <p className="placeholder">Aucun incident à afficher.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Description</th>
            <th>État</th>
            <th>Priorité</th>
            <th>Assigné à</th>
            <th>Ouvert le</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.sys_id.value}
              className="row-clickable"
              tabIndex={0}
              onClick={() => onEdit(incident)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onEdit(incident);
              }}
            >
              <td className="mono">{incident.number.display}</td>
              <td>{incident.short_description.display}</td>
              <td>{incident.state.display}</td>
              <td>
                <span className={`badge tone-${priorityTone(incident.priority)}`}>
                  {incident.priority.display || '—'}
                </span>
              </td>
              <td>
                {incident.assigned_to.display || <span className="muted">non assigné</span>}
              </td>
              <td className="mono">{incident.opened_at.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}