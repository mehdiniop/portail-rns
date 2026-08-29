import { useI18n } from '../i18n.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

function initials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function AppHeader({ session, onHome, onLogout }) {
  const { t } = useI18n();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button type="button" className="brand" onClick={onHome}>
          <span className="brand-mark" aria-hidden="true">MP</span>
          <span className="brand-text">
            <span className="brand-name">{t('app.brand')}</span>
            <span className="brand-sub">{t('app.tagline')}</span>
          </span>
        </button>

        <div className="topbar-right">
          <LanguageSwitcher />
          <span className="avatar" aria-hidden="true">{initials(session.user)}</span>
          <span className="topbar-user">{session.user}</span>
          <button type="button" className="btn-logout" onClick={onLogout}>
            {t('app.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}
