// eslint-disable-next-line @typescript-eslint/no-var-requires
export const language = require('../assets/languages.json') as LanguageType;

export type AvailableLangue = {
  fr?: string;
  en: string;
}

export type AvailableLanguages = {
  [key: string]: AvailableLangue | AvailableLanguages;
}

export function getTranslation(object: any, language: keyof AvailableLangue): string {
  return object[language];
}

export function getDataTranslation<T>(object: any, language: keyof AvailableLangue): T {
  Object.keys(object).map((key) => object[key][language]);
  return Object.keys(object as keyof T).map((key) => {
    const objectKey = (key as keyof T);
    const objectValue = object[objectKey][language];
    return {[objectKey]: objectValue};
  }).reduce((a, b) => {
    return {
      ...b,
      ...a,
    };
  }, {}) as unknown as T;
}

export type LanguageType = {
  modals: {
    login: {
      title: AvailableLangue,
      cancel: AvailableLangue,
      login: AvailableLangue,
      noAccount: AvailableLangue,
      forms: {
        email: AvailableLangue,
        password: AvailableLangue,
      }
    },
  },
  "menu": {
    "sidebar": {
      "plds": AvailableLangue,
      "organizations": AvailableLangue,
      "myCalendar": AvailableLangue,
      "changelog": AvailableLangue,
      "faq": AvailableLanguages
      "dashboard": AvailableLanguages,
    },
    "user": {
      "profile": AvailableLanguages,
      "devices": AvailableLanguages,
      "logout": AvailableLanguages,
      "register": AvailableLanguages,
      "login": AvailableLanguages
    }
  },
  actions: {
    deleteDod: AvailableLangue,
    createDod: AvailableLangue,
  },
  errors: {
    api: {
      default: AvailableLangue,
      forbidden: AvailableLangue,
      invalidObject: AvailableLangue,
      unauthorized: AvailableLangue,
      invalidUserToken: AvailableLangue,
    },
    cantDisableTOTP: AvailableLangue
    cantUpdateDod: AvailableLangue,
    cantPreviewDod: AvailableLangue,
    cantChangeDodStatus: AvailableLangue,
  },
  DoDs: {
    dodUpdated: AvailableLangue,
  }
  lexical: {
    email: AvailableLangue,
    name: AvailableLangue,
    versioning: AvailableLangue,
    description: AvailableLangue
    title: AvailableLangue,
    version: AvailableLangue,
    members: AvailableLangue,
    update: AvailableLangue,
    settings: AvailableLangue,
    loading: AvailableLangue,
    useAsDefault: AvailableLangue,
    lastUpdateDate: AvailableLangue,
    createdDate: AvailableLangue
  },
  pages: {
    createOrg: {
      title: AvailableLangue,
      subtitle: AvailableLangue,
      createButton: AvailableLangue,
      addMembers: {
        title: AvailableLangue,
        subtitle: AvailableLangue,
      }
    }
    faq: {
      suggestion: AvailableLangue,
      admin: AvailableLangue,
    },
    myProfile: {
      title: AvailableLangue,
      security: {
        title: AvailableLangue,
      },
      preference: {
        title: AvailableLangue,
      },
      delete: {
        title: AvailableLangue,
        hasSomeOrg: AvailableLangue,
      }
    }
  },
  home: {
    events: {
      title: AvailableLangue,
      noEvents: AvailableLangue,
    },
    org: {
      title: AvailableLangue,
      noOrgs: AvailableLangue,
      noOrgCreateButton: AvailableLangue,
    },
    welcomeMessage: {
      title: AvailableLangue,
      subTitle: AvailableLangue,
    },
    welcomeDashboard: {
      title: AvailableLangue,
      subTitle: AvailableLangue,
    },
    createOrganization: AvailableLangue,
    homeCalendarTitle: AvailableLangue,
    homeOrganizationTitle: AvailableLangue,
  },
  calendar: {
    today: AvailableLangue,
    month: AvailableLangue,
    week: AvailableLangue,
    day: AvailableLangue,
    list: AvailableLangue,
  }
}
