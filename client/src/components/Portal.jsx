import { useState } from 'react';
import { MODULES } from '../modules.js';
import { useI18n } from '../i18n.jsx';
import ModuleIcon from './ModuleIcon.jsx';

export default function Portal({ onSelect }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();

  const visible = MODULES.filter((module) => {
    if (!needle) return true;
    const label = t(`module.${module.key}.label`).toLowerCase();
    const tagline = t(`module.${module.key}.tagline`).toLowerCase();
    return label.includes(needle) || tagline.includes(needle);
  });

  return (
    <>
      <div className="hero">
        <div className="hero-decor" aria-hidden="true" />
        <div className="hero-inner">
          <h1>{t('portal.heroTitle')}</h1>
          <div className="hero-search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('portal.search')}
              aria-label={t('portal.search')}
            />
          </div>
        </div>
      </div>

      <div className="portal-body">
        <p className="eyebrow">{t('portal.eyebrow')}</p>
        <h2 className="portal-title">{t('portal.title')}</h2>

        {visible.length === 0 ? (
          <p className="placeholder">{t('portal.noMatch', { q: query })}</p>
        ) : (
          <div className="boxes">
            {visible.map((module) => (
              <button
                key={module.key}
                type="button"
                className="box"
                style={{ '--tone': module.tone }}
                onClick={() => onSelect(module.key)}
              >
                <span className="box-icon">
                  <ModuleIcon name={module.key} />
                </span>
                <span className="box-label">{t(`module.${module.key}.label`)}</span>
                <span className="box-tagline">{t(`module.${module.key}.tagline`)}</span>
                <span className="box-foot">
                  <span className="box-chip mono">{module.prefix}</span>
                  <span className="box-go" aria-hidden="true">→</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
