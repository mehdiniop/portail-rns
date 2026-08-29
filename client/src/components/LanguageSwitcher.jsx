import { LANGS, useI18n } from '../i18n.jsx';

export default function LanguageSwitcher({ variant = 'dark' }) {
  const { lang, setLang, t } = useI18n();

  return (
    <label className={`lang lang-${variant}`}>
      <span className="sr-only">{t('lang.label')}</span>
      <select value={lang} onChange={(event) => setLang(event.target.value)}>
        {LANGS.map((entry) => (
          <option key={entry.code} value={entry.code}>
            {entry.label}
          </option>
        ))}
      </select>
    </label>
  );
}
