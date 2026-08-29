import { STATES } from '../choices.js';

export default function Toolbar({ search, onSearchChange, state, onStateChange }) {
  return (
    <div className="toolbar">
      <label className="field">
        <span className="field-label">Rechercher</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Numéro ou description"
          className="input"
        />
      </label>

      <label className="field">
        <span className="field-label">État</span>
        <select
          value={state}
          onChange={(event) => onStateChange(event.target.value)}
          className="input"
        >
          <option value="">Tous</option>
          {STATES.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      </label>

      {(search || state) && (
        <button
          type="button"
          className="btn-link"
          onClick={() => {
            onSearchChange('');
            onStateChange('');
          }}
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}