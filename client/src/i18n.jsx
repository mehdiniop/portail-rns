import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const LANGS = [
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

const DICT = {
  fr: {
    'app.brand': 'MyPortal',
    'app.tagline': 'Portail libre-service',
    'app.logout': 'Se déconnecter',
    'lang.label': 'Langue',

    'login.sub': 'Connectez-vous avec votre compte ServiceNow.',
    'login.user': 'Utilisateur',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.error': 'Renseignez l’utilisateur et le mot de passe.',

    'portal.heroTitle': 'Comment pouvons-nous vous aider ?',
    'portal.search': 'Rechercher un type d’enregistrement',
    'portal.eyebrow': 'Nouvel enregistrement',
    'portal.title': 'Choisissez un type pour commencer',
    'portal.noMatch': 'Aucun type ne correspond à « {q} ».',

    'module.incident.label': 'Incident',
    'module.incident.tagline': 'Un service est interrompu ou dégradé',
    'module.request.label': 'Demande',
    'module.request.tagline': 'Obtenir un service, un accès ou du matériel',
    'module.change.label': 'Changement',
    'module.change.tagline': 'Modifier un service ou une configuration',
    'module.problem.label': 'Problème',
    'module.problem.tagline': 'Identifier la cause racine d’incidents répétés',

    'catalog.home': 'Accueil',
    'catalog.title': 'Catalogue de services',
    'catalog.all': 'Toutes les catégories',
    'catalog.categories': 'Catégories',
    'catalog.search': 'Rechercher dans le catalogue',
    'catalog.empty': 'Aucun article dans cette catégorie.',
    'catalog.noResult': 'Aucun article ne correspond à votre recherche.',
    'catalog.details': 'Voir le détail',
    'catalog.count': '{n} article(s)',

    'form.back': 'Retour au portail',
    'form.newTitle': 'Nouveau — {type}',
    'form.required': 'Le champ « {field} » est obligatoire.',
    'form.cancel': 'Annuler',
    'form.submit': 'Créer',

    'field.short_description': 'Résumé',
    'field.description': 'Description détaillée',
    'field.category': 'Catégorie',
    'field.urgency': 'Urgence',
    'field.impact': 'Impact',
    'field.type': 'Type',
    'field.risk': 'Risque',

    'urgency.1': 'Élevée',
    'urgency.2': 'Moyenne',
    'urgency.3': 'Faible',
    'impact.1': 'Élevé',
    'impact.2': 'Moyen',
    'impact.3': 'Faible',
    'risk.2': 'Élevé',
    'risk.3': 'Modéré',
    'risk.4': 'Faible',

    'category.inquiry': 'Question / Aide',
    'category.software': 'Logiciel',
    'category.hardware': 'Matériel',
    'category.network': 'Réseau',
    'category.database': 'Base de données',

    'changeType.normal': 'Normal',
    'changeType.standard': 'Standard',
    'changeType.emergency': 'Urgent',

    'created.badge': 'Créé',
    'created.back': 'Retour au portail',
    'created.another': 'Créer un autre',
  },

  en: {
    'app.brand': 'MyPortal',
    'app.tagline': 'Self-service portal',
    'app.logout': 'Sign out',
    'lang.label': 'Language',

    'login.sub': 'Sign in with your ServiceNow account.',
    'login.user': 'Username',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.error': 'Enter your username and password.',

    'portal.heroTitle': 'How can we help?',
    'portal.search': 'Search a record type',
    'portal.eyebrow': 'New record',
    'portal.title': 'Choose a type to get started',
    'portal.noMatch': 'No type matches “{q}”.',

    'module.incident.label': 'Incident',
    'module.incident.tagline': 'A service is down or degraded',
    'module.request.label': 'Request',
    'module.request.tagline': 'Get a service, access or equipment',
    'module.change.label': 'Change',
    'module.change.tagline': 'Modify a service or a configuration',
    'module.problem.label': 'Problem',
    'module.problem.tagline': 'Find the root cause of recurring incidents',

    'catalog.home': 'Home',
    'catalog.title': 'Service catalog',
    'catalog.all': 'All categories',
    'catalog.categories': 'Categories',
    'catalog.search': 'Search the catalog',
    'catalog.empty': 'No items in this category.',
    'catalog.noResult': 'No item matches your search.',
    'catalog.details': 'View details',
    'catalog.count': '{n} item(s)',

    'form.back': 'Back to portal',
    'form.newTitle': 'New {type}',
    'form.required': 'The field “{field}” is required.',
    'form.cancel': 'Cancel',
    'form.submit': 'Create',

    'field.short_description': 'Summary',
    'field.description': 'Detailed description',
    'field.category': 'Category',
    'field.urgency': 'Urgency',
    'field.impact': 'Impact',
    'field.type': 'Type',
    'field.risk': 'Risk',

    'urgency.1': 'High',
    'urgency.2': 'Medium',
    'urgency.3': 'Low',
    'impact.1': 'High',
    'impact.2': 'Medium',
    'impact.3': 'Low',
    'risk.2': 'High',
    'risk.3': 'Moderate',
    'risk.4': 'Low',

    'category.inquiry': 'Inquiry / Help',
    'category.software': 'Software',
    'category.hardware': 'Hardware',
    'category.network': 'Network',
    'category.database': 'Database',

    'changeType.normal': 'Normal',
    'changeType.standard': 'Standard',
    'changeType.emergency': 'Emergency',

    'created.badge': 'Created',
    'created.back': 'Back to portal',
    'created.another': 'Create another',
  },

  ar: {
    'app.brand': 'مكتب الخدمة',
    'app.tagline': 'بوابة الخدمة الذاتية',
    'app.logout': 'تسجيل الخروج',
    'lang.label': 'اللغة',

    'login.sub': 'سجّل الدخول بحساب ServiceNow الخاص بك.',
    'login.user': 'اسم المستخدم',
    'login.password': 'كلمة المرور',
    'login.submit': 'تسجيل الدخول',
    'login.error': 'أدخل اسم المستخدم وكلمة المرور.',

    'portal.heroTitle': 'كيف يمكننا مساعدتك؟',
    'portal.search': 'ابحث عن نوع السجل',
    'portal.eyebrow': 'سجل جديد',
    'portal.title': 'اختر نوعًا للبدء',
    'portal.noMatch': 'لا يوجد نوع يطابق «{q}».',

    'module.incident.label': 'حادث',
    'module.incident.tagline': 'خدمة متوقفة أو متدهورة',
    'module.request.label': 'طلب',
    'module.request.tagline': 'الحصول على خدمة أو صلاحية أو معدات',
    'module.change.label': 'تغيير',
    'module.change.tagline': 'تعديل خدمة أو إعداد',
    'module.problem.label': 'مشكلة',
    'module.problem.tagline': 'تحديد السبب الجذري للحوادث المتكررة',

    'catalog.home': 'الرئيسية',
    'catalog.title': 'كتالوج الخدمات',
    'catalog.all': 'كل الفئات',
    'catalog.categories': 'الفئات',
    'catalog.search': 'ابحث في الكتالوج',
    'catalog.empty': 'لا توجد عناصر في هذه الفئة.',
    'catalog.noResult': 'لا يوجد عنصر يطابق بحثك.',
    'catalog.details': 'عرض التفاصيل',
    'catalog.count': '{n} عنصر',

    'form.back': 'العودة إلى البوابة',
    'form.newTitle': '{type} جديد',
    'form.required': 'الحقل «{field}» مطلوب.',
    'form.cancel': 'إلغاء',
    'form.submit': 'إنشاء',

    'field.short_description': 'ملخص',
    'field.description': 'وصف تفصيلي',
    'field.category': 'الفئة',
    'field.urgency': 'الإلحاح',
    'field.impact': 'الأثر',
    'field.type': 'النوع',
    'field.risk': 'المخاطر',

    'urgency.1': 'مرتفع',
    'urgency.2': 'متوسط',
    'urgency.3': 'منخفض',
    'impact.1': 'مرتفع',
    'impact.2': 'متوسط',
    'impact.3': 'منخفض',
    'risk.2': 'مرتفع',
    'risk.3': 'متوسط',
    'risk.4': 'منخفض',

    'category.inquiry': 'استفسار / مساعدة',
    'category.software': 'برمجيات',
    'category.hardware': 'أجهزة',
    'category.network': 'الشبكة',
    'category.database': 'قاعدة البيانات',

    'changeType.normal': 'عادي',
    'changeType.standard': 'قياسي',
    'changeType.emergency': 'طارئ',

    'created.badge': 'تم الإنشاء',
    'created.back': 'العودة إلى البوابة',
    'created.another': 'إنشاء آخر',
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('fr');

  const dir = LANGS.find((entry) => entry.code === lang)?.dir ?? 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo(() => {
    function t(key, vars) {
      let text = DICT[lang][key] ?? DICT.fr[key] ?? key;
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          text = text.replace(`{${name}}`, replacement);
        }
      }
      return text;
    }
    return { lang, setLang, dir, t };
  }, [lang, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n doit être utilisé dans un I18nProvider.');
  }
  return context;
}