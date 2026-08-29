import { useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { pick } from '../catalog.js';

/** Valeurs initiales, quel que soit le format de champ. */
function initialValues(fields) {
  const values = {};
  for (const field of fields) {
    if (field.type === 'select') {
      values[field.name] =
        field.default ?? (field.choices ? field.choices[0].value : field.options[0]);
    } else {
      values[field.name] = field.default ?? '';
    }
  }
  return values;
}

export default function RecordForm({ fields, title, subtitle, chip, tone, onSubmit, onBack }) {
  const { t, lang } = useI18n();
  const [values, setValues] = useState(() => initialValues(fields));
  const [error, setError] = useState('');

  const set = (name) => (event) =>
    setValues((current) => ({ ...current, [name]: event.target.value }));

  /** Un champ porte soit un libellé traduit (catalogue), soit une clé i18n. */
  const labelOf = (field) =>
    field.label ? pick(field.label, lang) : t(`field.${field.name}`);

  function submit(event) {
    event.preventDefault();

    const missing = fields.find(
      (field) => field.required && !String(values[field.name]).trim(),
    );

    if (missing) {
      setError(t('form.required', { field: labelOf(missing) }));
      return;
    }

    onSubmit(values);
  }

  return (
    <section className="record">
      <button type="button" className="btn-link back" onClick={onBack}>
        <span className="back-arrow" aria-hidden="true">←</span> {t('form.back')}
      </button>

      <div className="record-head">
        {chip && (
          <span className="box-chip mono" style={{ '--tone': tone }}>
            {chip}
          </span>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="portal-sub">{subtitle}</p>}
      </div>

      <form className="record-form" onSubmit={submit}>
        {fields.map((field) => (
          <label
            key={field.name}
            className={`field ${field.type === 'select' ? '' : 'field-wide'}`}
          >
            <span className="field-label">
              {labelOf(field)}
              {field.required && ' *'}
            </span>

            {field.type === 'textarea' && (
              <textarea
                className="input"
                rows={5}
                value={values[field.name]}
                onChange={set(field.name)}
              />
            )}

            {field.type === 'text' && (
              <input
                className="input"
                value={values[field.name]}
                onChange={set(field.name)}
              />
            )}

            {field.type === 'select' && (
              <select className="input" value={values[field.name]} onChange={set(field.name)}>
                {field.choices
                  ? field.choices.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {pick(choice.label, lang)}
                      </option>
                    ))
                  : field.options.map((option) => (
                      <option key={option} value={option}>
                        {t(`${field.ns}.${option}`)}
                      </option>
                    ))}
              </select>
            )}
          </label>
        ))}

        {error && <p className="form-error field-wide">{error}</p>}

        <div className="record-actions field-wide">
          <button type="button" className="btn" onClick={onBack}>
            {t('form.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {t('form.submit')}
          </button>
        </div>
      </form>
    </section>
  );
}