/**
 * Catalogue de services — catégories, articles et formulaires.
 * Chaque article porte une clé `icon` consommée par <CatalogIcon />.
 */

export const CATEGORIES = [
  {
    key: 'hardware',
    tone: '#3d92b0',
    icon: 'laptop',
    label: { fr: 'Matériel', en: 'Hardware', ar: 'الأجهزة' },
    description: {
      fr: 'Postes de travail, écrans et téléphonie',
      en: 'Workstations, displays and telephony',
      ar: 'محطات العمل والشاشات والهواتف',
    },
  },
  {
    key: 'software',
    tone: '#7d80c4',
    icon: 'license',
    label: { fr: 'Logiciels', en: 'Software', ar: 'البرمجيات' },
    description: {
      fr: 'Licences et installations applicatives',
      en: 'Licences and application installs',
      ar: 'التراخيص وتثبيت التطبيقات',
    },
  },
  {
    key: 'access',
    tone: '#4aa38c',
    icon: 'shield',
    label: { fr: 'Accès et sécurité', en: 'Access & security', ar: 'الوصول والأمان' },
    description: {
      fr: 'Comptes, VPN et badges',
      en: 'Accounts, VPN and badges',
      ar: 'الحسابات وVPN والبطاقات',
    },
  },
  {
    key: 'network',
    tone: '#d08a4a',
    icon: 'plug',
    label: { fr: 'Réseau et télécom', en: 'Network & telecom', ar: 'الشبكة والاتصالات' },
    description: {
      fr: 'Ports, Wi-Fi et liens opérateurs',
      en: 'Ports, Wi-Fi and carrier links',
      ar: 'المنافذ والواي فاي وروابط المشغل',
    },
  },
  {
    key: 'support',
    tone: '#cf6a4d',
    icon: 'question',
    label: { fr: 'Support et services', en: 'Support & services', ar: 'الدعم والخدمات' },
    description: {
      fr: 'Assistance, mots de passe et demandes diverses',
      en: 'Assistance, passwords and general requests',
      ar: 'المساعدة وكلمات المرور والطلبات العامة',
    },
  },
];

export const ITEMS = [
  /* ---------------------------------------------------------------- Matériel */
  {
    key: 'laptop',
    category: 'hardware',
    icon: 'laptop',
    amount: 1200,
    from: true,
    label: { fr: 'Ordinateur portable', en: 'Laptop', ar: 'حاسوب محمول' },
    description: {
      fr: 'Portable standard ou performance, livré configuré et chiffré.',
      en: 'Standard or performance laptop, delivered configured and encrypted.',
      ar: 'حاسوب محمول قياسي أو عالي الأداء، يُسلَّم مهيأً ومشفّرًا.',
    },
    specs: [
      { fr: 'Processeur Intel Core i7, 16 Go de mémoire', en: 'Intel Core i7 processor, 16 GB memory', ar: 'معالج إنتل كور i7 وذاكرة 16 غيغابايت' },
      { fr: 'SSD 512 Go chiffré au démarrage', en: '512 GB SSD with full-disk encryption', ar: 'قرص SSD سعة 512 غيغابايت مشفَّر بالكامل' },
      { fr: 'Garantie sur site 3 ans, remplacement J+1', en: '3-year on-site warranty, next-day swap', ar: 'ضمان في الموقع 3 سنوات مع استبدال في اليوم التالي' },
    ],
    fields: [
      {
        name: 'model',
        type: 'select',
        required: true,
        label: { fr: 'Modèle', en: 'Model', ar: 'الطراز' },
        choices: [
          { value: 'standard', label: { fr: 'Standard 14"', en: 'Standard 14"', ar: 'قياسي 14"' } },
          { value: 'performance', label: { fr: 'Performance 16"', en: 'Performance 16"', ar: 'أداء عالٍ 16"' } },
          { value: 'ultraportable', label: { fr: 'Ultraportable 13"', en: 'Ultraportable 13"', ar: 'خفيف 13"' } },
        ],
      },
      {
        name: 'os',
        type: 'select',
        label: { fr: "Système d'exploitation", en: 'Operating system', ar: 'نظام التشغيل' },
        choices: [
          { value: 'windows', label: { fr: 'Windows', en: 'Windows', ar: 'ويندوز' } },
          { value: 'macos', label: { fr: 'macOS', en: 'macOS', ar: 'ماك' } },
          { value: 'linux', label: { fr: 'Linux', en: 'Linux', ar: 'لينكس' } },
        ],
      },
      {
        name: 'justification',
        type: 'textarea',
        required: true,
        label: { fr: 'Justification', en: 'Justification', ar: 'التبرير' },
      },
    ],
  },
  {
    key: 'monitor',
    category: 'hardware',
    icon: 'monitor',
    amount: 280,
    from: true,
    label: { fr: 'Écran externe', en: 'External monitor', ar: 'شاشة خارجية' },
    description: {
      fr: 'Écran 24" ou 27", câbles et support inclus.',
      en: '24" or 27" display, cables and stand included.',
      ar: 'شاشة 24" أو 27" مع الكابلات والحامل.',
    },
    specs: [
      { fr: 'Dalle IPS Full HD, 16:9', en: 'Full HD IPS panel, 16:9', ar: 'لوحة IPS بدقة Full HD بنسبة 16:9' },
      { fr: 'Ports HDMI, DisplayPort et USB-C', en: 'HDMI, DisplayPort and USB-C ports', ar: 'منافذ HDMI وDisplayPort وUSB-C' },
      { fr: 'Support réglable en hauteur et câbles inclus', en: 'Height-adjustable stand and cables included', ar: 'حامل قابل لضبط الارتفاع مع الكابلات' },
    ],
    fields: [
      {
        name: 'size',
        type: 'select',
        required: true,
        label: { fr: 'Taille', en: 'Size', ar: 'الحجم' },
        choices: [
          { value: '24', label: { fr: '24 pouces', en: '24 inch', ar: '24 بوصة' } },
          { value: '27', label: { fr: '27 pouces', en: '27 inch', ar: '27 بوصة' } },
          { value: '34', label: { fr: '34 pouces incurvé', en: '34 inch curved', ar: '34 بوصة منحنية' } },
        ],
      },
      {
        name: 'quantity',
        type: 'number',
        default: '1',
        label: { fr: 'Quantité', en: 'Quantity', ar: 'الكمية' },
      },
      {
        name: 'delivery_location',
        type: 'text',
        required: true,
        label: { fr: 'Lieu de livraison', en: 'Delivery location', ar: 'مكان التسليم' },
      },
    ],
  },
  {
    key: 'mobile',
    category: 'hardware',
    icon: 'mobile',
    amount: 45,
    from: true,
    recurring: 'month',
    label: { fr: 'Téléphone mobile', en: 'Mobile phone', ar: 'هاتف محمول' },
    description: {
      fr: 'Appareil et forfait voix/données pour usage professionnel.',
      en: 'Device and voice/data plan for business use.',
      ar: 'جهاز وخطة صوت/بيانات للاستخدام المهني.',
    },
    specs: [
      { fr: 'Appareil 5G débloqué tout opérateur', en: 'Unlocked 5G device, any carrier', ar: 'جهاز 5G مفتوح لجميع المشغلين' },
      { fr: 'Inscription automatique à la gestion MDM', en: 'Automatic MDM enrolment', ar: 'تسجيل تلقائي في إدارة الأجهزة MDM' },
      { fr: 'Renouvellement du parc tous les 24 mois', en: 'Fleet refresh every 24 months', ar: 'تجديد الأجهزة كل 24 شهرًا' },
    ],
    fields: [
      {
        name: 'device',
        type: 'select',
        required: true,
        label: { fr: 'Appareil', en: 'Device', ar: 'الجهاز' },
        choices: [
          { value: 'iphone', label: { fr: 'iPhone', en: 'iPhone', ar: 'آيفون' } },
          { value: 'android', label: { fr: 'Android', en: 'Android', ar: 'أندرويد' } },
        ],
      },
      {
        name: 'plan',
        type: 'select',
        label: { fr: 'Forfait', en: 'Plan', ar: 'الخطة' },
        choices: [
          { value: 'voice', label: { fr: 'Voix seulement', en: 'Voice only', ar: 'صوت فقط' } },
          { value: 'voice_data', label: { fr: 'Voix et données', en: 'Voice and data', ar: 'صوت وبيانات' } },
          { value: 'roaming', label: { fr: 'Voix, données et itinérance', en: 'Voice, data and roaming', ar: 'صوت وبيانات وتجوال' } },
        ],
      },
      {
        name: 'justification',
        type: 'textarea',
        label: { fr: 'Justification', en: 'Justification', ar: 'التبرير' },
      },
    ],
  },

  /* --------------------------------------------------------------- Logiciels */
  {
    key: 'license',
    category: 'software',
    icon: 'license',
    amount: null,
    label: { fr: 'Licence logicielle', en: 'Software licence', ar: 'ترخيص برمجي' },
    description: {
      fr: 'Attribution d’une licence nominative pour un logiciel du catalogue.',
      en: 'Named licence assignment for a catalogue software product.',
      ar: 'تخصيص ترخيص باسم المستخدم لأحد منتجات الكتالوج.',
    },
    specs: [
      { fr: 'Licence nominative rattachée au compte AD', en: 'Named licence tied to the AD account', ar: 'ترخيص باسم المستخدم مرتبط بحساب AD' },
      { fr: 'Activation sous 2 jours ouvrés', en: 'Activated within 2 business days', ar: 'تفعيل خلال يومَي عمل' },
      { fr: 'Refacturation au centre de coûts du demandeur', en: 'Charged back to the requester\'s cost centre', ar: 'تُحمَّل التكلفة على مركز تكلفة مقدّم الطلب' },
    ],
    fields: [
      {
        name: 'product',
        type: 'select',
        required: true,
        label: { fr: 'Produit', en: 'Product', ar: 'المنتج' },
        choices: [
          { value: 'office', label: { fr: 'Microsoft 365', en: 'Microsoft 365', ar: 'مايكروسوفت 365' } },
          { value: 'adobe', label: { fr: 'Adobe Creative Cloud', en: 'Adobe Creative Cloud', ar: 'أدوبي كرييتف كلاود' } },
          { value: 'visio', label: { fr: 'Visio', en: 'Visio', ar: 'فيزيو' } },
          { value: 'other', label: { fr: 'Autre', en: 'Other', ar: 'أخرى' } },
        ],
      },
      {
        name: 'duration',
        type: 'select',
        label: { fr: 'Durée', en: 'Duration', ar: 'المدة' },
        choices: [
          { value: '12', label: { fr: '12 mois', en: '12 months', ar: '12 شهرًا' } },
          { value: '24', label: { fr: '24 mois', en: '24 months', ar: '24 شهرًا' } },
          { value: 'perpetual', label: { fr: 'Perpétuelle', en: 'Perpetual', ar: 'دائم' } },
        ],
      },
      {
        name: 'justification',
        type: 'textarea',
        required: true,
        label: { fr: 'Justification', en: 'Justification', ar: 'التبرير' },
      },
    ],
  },
  {
    key: 'install',
    category: 'software',
    icon: 'install',
    amount: 0,
    label: { fr: 'Installation applicative', en: 'Application install', ar: 'تثبيت تطبيق' },
    description: {
      fr: 'Installation ou mise à jour d’une application sur un poste existant.',
      en: 'Install or update an application on an existing workstation.',
      ar: 'تثبيت أو تحديث تطبيق على جهاز قائم.',
    },
    specs: [
      { fr: 'Déploiement à distance, sans intervention sur site', en: 'Remote deployment, no on-site visit', ar: 'نشر عن بُعد دون زيارة الموقع' },
      { fr: 'Redémarrage du poste requis en fin d\'installation', en: 'Workstation restart required at the end', ar: 'يلزم إعادة تشغيل الجهاز عند الانتهاء' },
      { fr: 'Aucune donnée utilisateur affectée', en: 'No user data is affected', ar: 'لا تتأثر بيانات المستخدم' },
    ],
    fields: [
      {
        name: 'application',
        type: 'text',
        required: true,
        label: { fr: 'Application', en: 'Application', ar: 'التطبيق' },
      },
      {
        name: 'asset_tag',
        type: 'text',
        required: true,
        label: { fr: 'Numéro du poste', en: 'Asset tag', ar: 'رقم الجهاز' },
      },
      {
        name: 'schedule',
        type: 'select',
        label: { fr: 'Créneau souhaité', en: 'Preferred window', ar: 'الفترة المفضلة' },
        choices: [
          { value: 'business', label: { fr: 'Heures ouvrables', en: 'Business hours', ar: 'ساعات العمل' } },
          { value: 'evening', label: { fr: 'Soirée', en: 'Evening', ar: 'المساء' } },
          { value: 'weekend', label: { fr: 'Fin de semaine', en: 'Weekend', ar: 'نهاية الأسبوع' } },
        ],
      },
    ],
  },

  /* ------------------------------------------------------ Accès et sécurité */
  {
    key: 'vpn',
    category: 'access',
    icon: 'shield',
    amount: 0,
    label: { fr: 'Accès VPN', en: 'VPN access', ar: 'الوصول عبر VPN' },
    description: {
      fr: 'Accès distant sécurisé au réseau de l’entreprise.',
      en: 'Secure remote access to the corporate network.',
      ar: 'وصول آمن عن بُعد إلى شبكة الشركة.',
    },
    specs: [
      { fr: 'Authentification à deux facteurs obligatoire', en: 'Two-factor authentication is mandatory', ar: 'المصادقة الثنائية إلزامية' },
      { fr: 'Tunnel chiffré AES-256', en: 'AES-256 encrypted tunnel', ar: 'نفق مشفَّر بمعيار AES-256' },
      { fr: 'Revue des droits tous les 90 jours', en: 'Access reviewed every 90 days', ar: 'مراجعة الصلاحيات كل 90 يومًا' },
    ],
    fields: [
      {
        name: 'profile',
        type: 'select',
        required: true,
        label: { fr: 'Profil', en: 'Profile', ar: 'الملف' },
        choices: [
          { value: 'standard', label: { fr: 'Standard', en: 'Standard', ar: 'قياسي' } },
          { value: 'admin', label: { fr: 'Administrateur', en: 'Administrator', ar: 'مدير' } },
          { value: 'partner', label: { fr: 'Partenaire externe', en: 'External partner', ar: 'شريك خارجي' } },
        ],
      },
      {
        name: 'duration',
        type: 'select',
        label: { fr: 'Durée', en: 'Duration', ar: 'المدة' },
        choices: [
          { value: 'permanent', label: { fr: 'Permanente', en: 'Permanent', ar: 'دائم' } },
          { value: '90', label: { fr: '90 jours', en: '90 days', ar: '90 يومًا' } },
          { value: '30', label: { fr: '30 jours', en: '30 days', ar: '30 يومًا' } },
        ],
      },
      {
        name: 'justification',
        type: 'textarea',
        required: true,
        label: { fr: 'Justification', en: 'Justification', ar: 'التبرير' },
      },
    ],
  },
  {
    key: 'badge',
    category: 'access',
    icon: 'badge',
    amount: 25,
    label: { fr: 'Badge d’accès', en: 'Access badge', ar: 'بطاقة دخول' },
    description: {
      fr: 'Création, remplacement ou extension d’un badge de site.',
      en: 'Create, replace or extend a site access badge.',
      ar: 'إنشاء أو استبدال أو تمديد بطاقة دخول الموقع.',
    },
    specs: [
      { fr: 'Photo d\'identité récente requise', en: 'A recent ID photo is required', ar: 'يلزم تقديم صورة شخصية حديثة' },
      { fr: 'Activation sous 48 heures', en: 'Activated within 48 hours', ar: 'التفعيل خلال 48 ساعة' },
      { fr: 'Retrait à l\'accueil du site concerné', en: 'Collected at the site reception desk', ar: 'الاستلام من مكتب الاستقبال في الموقع' },
    ],
    fields: [
      {
        name: 'action',
        type: 'select',
        required: true,
        label: { fr: 'Action', en: 'Action', ar: 'الإجراء' },
        choices: [
          { value: 'new', label: { fr: 'Nouveau badge', en: 'New badge', ar: 'بطاقة جديدة' } },
          { value: 'replace', label: { fr: 'Remplacement', en: 'Replacement', ar: 'استبدال' } },
          { value: 'extend', label: { fr: 'Extension d’accès', en: 'Access extension', ar: 'تمديد الوصول' } },
        ],
      },
      {
        name: 'site',
        type: 'text',
        required: true,
        label: { fr: 'Site', en: 'Site', ar: 'الموقع' },
      },
      {
        name: 'comments',
        type: 'textarea',
        label: { fr: 'Commentaires', en: 'Comments', ar: 'ملاحظات' },
      },
    ],
  },

  /* --------------------------------------------------- Réseau et télécom */
  {
    key: 'network_port',
    category: 'network',
    icon: 'plug',
    amount: 0,
    label: { fr: 'Activation de port réseau', en: 'Network port activation', ar: 'تفعيل منفذ شبكة' },
    description: {
      fr: 'Activation ou changement de VLAN sur une prise réseau.',
      en: 'Activate a wall port or change its VLAN.',
      ar: 'تفعيل منفذ حائطي أو تغيير الـ VLAN الخاص به.',
    },
    specs: [
      { fr: 'Brassage réalisé par l\'équipe réseau', en: 'Patching handled by the network team', ar: 'يتولى فريق الشبكة عملية التوصيل' },
      { fr: 'VLAN appliqué après validation sécurité', en: 'VLAN applied after security approval', ar: 'يُطبَّق الـ VLAN بعد موافقة الأمن' },
      { fr: 'Test de connectivité inclus', en: 'Connectivity test included', ar: 'يشمل اختبار الاتصال' },
    ],
    fields: [
      {
        name: 'site',
        type: 'text',
        required: true,
        label: { fr: 'Site', en: 'Site', ar: 'الموقع' },
      },
      {
        name: 'port',
        type: 'text',
        required: true,
        label: { fr: 'Numéro de prise', en: 'Port number', ar: 'رقم المنفذ' },
      },
      {
        name: 'vlan',
        type: 'select',
        label: { fr: 'VLAN', en: 'VLAN', ar: 'VLAN' },
        choices: [
          { value: 'corp', label: { fr: 'Corporatif', en: 'Corporate', ar: 'مؤسسي' } },
          { value: 'voice', label: { fr: 'Voix', en: 'Voice', ar: 'صوت' } },
          { value: 'guest', label: { fr: 'Invité', en: 'Guest', ar: 'ضيوف' } },
        ],
      },
    ],
  },
  {
    key: 'wifi',
    category: 'network',
    icon: 'wifi',
    amount: 0,
    label: { fr: 'Accès Wi-Fi invité', en: 'Guest Wi-Fi access', ar: 'وصول واي فاي للضيوف' },
    description: {
      fr: 'Compte Wi-Fi temporaire pour un visiteur ou un prestataire.',
      en: 'Temporary Wi-Fi account for a visitor or contractor.',
      ar: 'حساب واي فاي مؤقت لزائر أو متعاقد.',
    },
    specs: [
      { fr: 'Compte valable 30 jours maximum', en: 'Account valid for up to 30 days', ar: 'الحساب صالح لمدة 30 يومًا كحد أقصى' },
      { fr: 'Identifiants transmis par SMS à l\'invité', en: 'Credentials sent to the guest by SMS', ar: 'تُرسل بيانات الدخول إلى الضيف عبر رسالة نصية' },
      { fr: 'Accès Internet seul, réseau isolé', en: 'Internet access only, isolated network', ar: 'وصول إلى الإنترنت فقط عبر شبكة معزولة' },
    ],
    fields: [
      {
        name: 'guest_name',
        type: 'text',
        required: true,
        label: { fr: 'Nom de l’invité', en: 'Guest name', ar: 'اسم الضيف' },
      },
      {
        name: 'company',
        type: 'text',
        label: { fr: 'Société', en: 'Company', ar: 'الشركة' },
      },
      {
        name: 'valid_until',
        type: 'date',
        required: true,
        label: { fr: 'Valide jusqu’au', en: 'Valid until', ar: 'صالح حتى' },
      },
    ],
  },

  /* ----------------------------------------------------- Support et services */
  {
    key: 'password_reset',
    category: 'support',
    icon: 'key',
    amount: 0,
    label: { fr: 'Réinitialisation de mot de passe', en: 'Password reset', ar: 'إعادة تعيين كلمة المرور' },
    description: {
      fr: 'Réinitialisation d’un compte applicatif ou d’un compte de service.',
      en: 'Reset an application account or a service account.',
      ar: 'إعادة تعيين حساب تطبيق أو حساب خدمة.',
    },
    specs: [
      { fr: 'Vérification d\'identité obligatoire', en: 'Identity verification is mandatory', ar: 'التحقق من الهوية إلزامي' },
      { fr: 'Mot de passe temporaire à changer à la première connexion', en: 'Temporary password, changed at first sign-in', ar: 'كلمة مرور مؤقتة تُغيَّر عند أول تسجيل دخول' },
      { fr: 'Traitement sous 4 heures ouvrées', en: 'Handled within 4 business hours', ar: 'المعالجة خلال 4 ساعات عمل' },
    ],
    fields: [
      {
        name: 'account',
        type: 'text',
        required: true,
        label: { fr: 'Compte concerné', en: 'Account', ar: 'الحساب' },
      },
      {
        name: 'system',
        type: 'select',
        required: true,
        label: { fr: 'Système', en: 'System', ar: 'النظام' },
        choices: [
          { value: 'ad', label: { fr: 'Active Directory', en: 'Active Directory', ar: 'أكتيف دايركتوري' } },
          { value: 'sap', label: { fr: 'SAP', en: 'SAP', ar: 'ساب' } },
          { value: 'servicenow', label: { fr: 'ServiceNow', en: 'ServiceNow', ar: 'سيرفس ناو' } },
          { value: 'other', label: { fr: 'Autre', en: 'Other', ar: 'أخرى' } },
        ],
      },
    ],
  },
  {
    key: 'general_request',
    category: 'support',
    icon: 'question',
    amount: 0,
    label: { fr: 'Demande générale', en: 'General request', ar: 'طلب عام' },
    description: {
      fr: 'Toute demande qui n’entre pas dans les articles ci-dessus.',
      en: 'Any request that does not fit the items above.',
      ar: 'أي طلب لا يندرج ضمن العناصر أعلاه.',
    },
    specs: [
      { fr: 'Prise en charge par le centre de services', en: 'Handled by the service desk', ar: 'يتولى مركز الخدمة المعالجة' },
      { fr: 'Première réponse sous 8 heures ouvrées', en: 'First response within 8 business hours', ar: 'أول رد خلال 8 ساعات عمل' },
      { fr: 'Escalade possible vers l\'équipe compétente', en: 'Can be escalated to the relevant team', ar: 'إمكانية التصعيد إلى الفريق المختص' },
    ],
    fields: [
      {
        name: 'short_description',
        type: 'text',
        required: true,
        label: { fr: 'Objet', en: 'Subject', ar: 'الموضوع' },
      },
      {
        name: 'description',
        type: 'textarea',
        required: true,
        label: { fr: 'Description', en: 'Description', ar: 'الوصف' },
      },
      {
        name: 'urgency',
        type: 'select',
        label: { fr: 'Urgence', en: 'Urgency', ar: 'الاستعجال' },
        choices: [
          { value: '1', label: { fr: 'Haute', en: 'High', ar: 'عالية' } },
          { value: '2', label: { fr: 'Moyenne', en: 'Medium', ar: 'متوسطة' } },
          { value: '3', label: { fr: 'Basse', en: 'Low', ar: 'منخفضة' } },
        ],
      },
    ],
  },
];

export const CURRENCY = 'CAD';

const LOCALES = { fr: 'fr-CA', en: 'en-CA', ar: 'ar' };

const PRICE_TXT = {
  fr: { quote: 'Sur devis', free: 'Inclus', from: 'à partir de', month: '/mois', each: 'l\u2019unité' },
  en: { quote: 'Quoted', free: 'Included', from: 'from', month: '/month', each: 'each' },
  ar: { quote: 'حسب عرض السعر', free: 'مشمول', from: 'ابتداءً من', month: '/شهر', each: 'للوحدة' },
};

/** Formate un montant dans la devise du catalogue. */
export function formatMoney(amount, lang) {
  try {
    return new Intl.NumberFormat(LOCALES[lang] || 'fr-CA', {
      style: 'currency',
      currency: CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `${amount} $`;
  }
}

/**
 * Prix d'un article pour une quantité donnée.
 * → { kind, total, unitText, totalText, isRecurring }
 *   kind = 'quote' (montant inconnu) | 'free' (0 $) | 'amount'
 */
export function priceOf(item, quantity = 1, lang = 'fr') {
  const tx = PRICE_TXT[lang] || PRICE_TXT.fr;
  const qty = Math.max(1, Number(quantity) || 1);

  if (item?.amount === null || item?.amount === undefined) {
    return { kind: 'quote', total: null, unitText: tx.quote, totalText: tx.quote, isRecurring: false };
  }

  if (item.amount === 0) {
    return { kind: 'free', total: 0, unitText: tx.free, totalText: tx.free, isRecurring: false };
  }

  const suffix = item.recurring === 'month' ? tx.month : '';
  const prefix = item.from ? `${tx.from} ` : '';

  return {
    kind: 'amount',
    total: item.amount * qty,
    isRecurring: !!item.recurring,
    unitText: `${prefix}${formatMoney(item.amount, lang)}${suffix}`,
    totalText: `${prefix}${formatMoney(item.amount * qty, lang)}${suffix}`,
  };
}

/** Total d'un panier : somme des montants connus + nb de lignes sur devis. */
export function cartTotal(lines, lang = 'fr') {
  const tx = PRICE_TXT[lang] || PRICE_TXT.fr;
  let total = 0;
  let quotes = 0;
  let recurring = false;

  lines.forEach((line) => {
    const price = priceOf(line.item, line.quantity, lang);
    if (price.kind === 'quote') quotes += 1;
    else total += price.total;
    if (price.isRecurring) recurring = true;
  });

  return {
    total,
    quotes,
    recurring,
    text: total > 0 ? formatMoney(total, lang) : quotes ? tx.quote : tx.free,
  };
}

/** Renvoie la valeur traduite d'un objet {fr, en, ar}. */
export function pick(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.fr || value.en || '';
}

/** Articles d'une catégorie (ou tous si la clé est vide). */
export function itemsOf(categoryKey) {
  if (!categoryKey) return ITEMS;
  return ITEMS.filter((item) => item.category === categoryKey);
}

/** Retrouve un article par sa clé. */
export function findItem(key) {
  return ITEMS.find((item) => item.key === key) || null;
}

/** Couleur d'accent d'une catégorie. */
export function toneOf(categoryKey) {
  const cat = CATEGORIES.find((c) => c.key === categoryKey);
  return (cat && cat.tone) || '#3d92b0';
}

/** Retrouve une catégorie par sa clé. */
export function findCategory(key) {
  return CATEGORIES.find((cat) => cat.key === key) || null;
}