import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n.jsx';

const TXT = {
  fr: {
    title: 'Quitter la page ?',
    message: 'Les modifications que vous avez faites seront perdues.',
    cancel: 'Annuler',
    leave: 'Quitter',
    close: 'Fermer la fenêtre',
  },
  en: {
    title: 'Leave page?',
    message: 'Changes you made will be lost.',
    cancel: 'Cancel',
    leave: 'Leave',
    close: 'Close modal',
  },
  ar: {
    title: 'مغادرة الصفحة؟',
    message: 'ستفقد التغييرات التي أجريتها.',
    cancel: 'إلغاء',
    leave: 'مغادرة',
    close: 'إغلاق النافذة',
  },
};

export default function LeaveModal({ onCancel, onConfirm, title, message }) {
  const { lang } = useI18n();
  const tx = TXT[lang] || TXT.fr;
  const confirmRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }

      /* Piège de focus minimal : Tab reste dans la fenêtre. */
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll('button');
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-title"
        aria-describedby="leave-message"
        ref={panelRef}
      >
        <button type="button" className="modal-close" aria-label={tx.close} onClick={onCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <h2 id="leave-title">{title || tx.title}</h2>
        <p id="leave-message">{message || tx.message}</p>

        <div className="modal-actions">
          <button type="button" className="modal-btn ghost" onClick={onCancel}>
            {tx.cancel}
          </button>
          <button type="button" className="modal-btn primary" ref={confirmRef} onClick={onConfirm}>
            {tx.leave}
          </button>
        </div>
      </div>
    </div>
  );
}