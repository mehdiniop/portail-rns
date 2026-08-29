import { useState } from 'react';
import { useI18n } from '../i18n.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const TXT = {
  fr: {
    welcome: 'Bienvenue sur',
    tagline: 'Un seul endroit pour commander vos équipements, suivre vos demandes et joindre le support.',
    points: [
      'Commandez dans le catalogue de services',
      'Suivez vos demandes et vos brouillons',
      'Signalez un incident en quelques secondes',
    ],
    signIn: 'Connexion',
    user: 'Nom d’utilisateur',
    password: 'Mot de passe',
    userPlaceholder: 'prenom.nom@entreprise.com',
    show: 'Afficher le mot de passe',
    hide: 'Masquer le mot de passe',
    login: 'Se connecter',
    or: 'ou',
    sso: 'Connexion externe (SSO)',
    error: 'Saisissez votre nom d’utilisateur et votre mot de passe.',
    footer: 'Accès réservé aux employés et prestataires autorisés.',
  },
  en: {
    welcome: 'Welcome to',
    tagline: 'One place to order equipment, track your requests and reach support.',
    points: [
      'Order from the service catalog',
      'Track your requests and drafts',
      'Report an issue in seconds',
    ],
    signIn: 'Sign in',
    user: 'User name',
    password: 'Password',
    userPlaceholder: 'first.last@company.com',
    show: 'Show password',
    hide: 'Hide password',
    login: 'Log in',
    or: 'or',
    sso: 'External login (SSO)',
    error: 'Enter your user name and password.',
    footer: 'Access reserved for employees and authorised contractors.',
  },
  ar: {
    welcome: 'مرحبًا بك في',
    tagline: 'مكان واحد لطلب المعدات ومتابعة طلباتك والتواصل مع الدعم.',
    points: [
      'اطلب من كتالوج الخدمات',
      'تابع طلباتك ومسوداتك',
      'أبلغ عن مشكلة في ثوانٍ',
    ],
    signIn: 'تسجيل الدخول',
    user: 'اسم المستخدم',
    password: 'كلمة المرور',
    userPlaceholder: 'name@company.com',
    show: 'إظهار كلمة المرور',
    hide: 'إخفاء كلمة المرور',
    login: 'دخول',
    or: 'أو',
    sso: 'تسجيل دخول خارجي (SSO)',
    error: 'أدخل اسم المستخدم وكلمة المرور.',
    footer: 'الوصول مخصص للموظفين والمتعاقدين المصرح لهم.',
  },
};

export default function LoginScreen({ onLogin, onSso }) {
  const { t, lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;
  const brand = t('app.brand');

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!user.trim() || !password) {
      setError(tx.error);
      return;
    }
    setError('');
    onLogin({ user: user.trim(), name: user.trim().split('@')[0] });
  };

  return (
    <div className="login">
      <main className="login-stage">
        <div className="login-wrap">
          {/* ------------------------------------------------ colonne gauche */}
          <section className="login-copy">
            <span className="login-logo">
              <span className="brand-mark" aria-hidden="true">MP</span>
              {brand}
            </span>

            <h1 className="login-title">
              <span>{tx.welcome}</span>
              <strong>{brand}</strong>
            </h1>

            <p className="login-tagline">{tx.tagline}</p>

            <ul className="login-points">
              {tx.points.map((point) => (
                <li key={point}>
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                         strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* ------------------------------------------------- colonne droite */}
          <div className="login-col">
            <div className="login-lang">
              <LanguageSwitcher />
            </div>

            <section className="login-card">
              <h2>{tx.signIn}</h2>

              <form onSubmit={submit} noValidate>
                <div className="login-field">
                  <label htmlFor="login-user">{tx.user}</label>
                  <input
                    id="login-user"
                    type="text"
                    autoComplete="username"
                    placeholder={tx.userPlaceholder}
                    value={user}
                    onChange={(event) => setUser(event.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="login-password">{tx.password}</label>
                  <div className="login-password">
                    <input
                      id="login-password"
                      type={reveal ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={reveal ? tx.hide : tx.show}
                      aria-pressed={reveal}
                      onClick={() => setReveal((value) => !value)}
                    >
                      {reveal ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                             strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 6.3A9.9 9.9 0 0 1 12 6.2c5 0 9 5.8 9 5.8a17 17 0 0 1-3.1 3.6" />
                          <path d="M6.3 8.1A17 17 0 0 0 3 12s4 5.8 9 5.8a9.6 9.6 0 0 0 4-.9" />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                             strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12s4-5.8 9-5.8S21 12 21 12s-4 5.8-9 5.8S3 12 3 12Z" />
                          <circle cx="12" cy="12" r="2.7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && <p className="login-error" role="alert">{error}</p>}

                <button type="submit" className="login-submit">{tx.login}</button>

                <div className="login-or"><span>{tx.or}</span></div>

                <button
                  type="button"
                  className="login-sso"
                  onClick={() => (onSso ? onSso() : onLogin({ user: 'sso', name: 'SSO', sso: true }))}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3.2 5 6v5.4c0 4.2 2.8 8 7 9.4 4.2-1.4 7-5.2 7-9.4V6l-7-2.8Z" />
                    <path d="M12 11v3.2M12 8.6v.1" />
                  </svg>
                  {tx.sso}
                </button>
              </form>

              <p className="login-footer">{tx.footer}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}