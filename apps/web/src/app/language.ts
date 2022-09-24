export type AvailableLangue = {
  fr?: string;
  en?: string;
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

const home = {
  welcomeMessage: {
    title: {
      fr: '',
      en: '',
    },
    subTitle: {
      fr: '',
      en: ''
    }
  },
  welcomeDashboard: {
    title: {
      fr: 'Bienvenue sur votre tableau de bord',
      en: 'Welcome to your dashboard'
    },
    subTitle: {
      fr: 'Ici vous pouvez suivre l\'avancement des PLDs et de leurs DoDs de vos différentes Organisation',
      en: ''
    }
  },
  createOrganization: {
    fr: '',
    en: ''
  },
  homeCalendarTitle: {
    fr: 'Mes évènements',
    en: 'Events'
  },
  homeOrganizationTitle: {
    fr: 'Mes organizations ',
    en: 'Organizations'
  },
}

const calendar = {
  today: {
    fr: 'Aujourd\'hui',
    en: 'Today',
  },
  month: {
    fr: 'Mois',
    en: 'Month'
  },
  week: {
    fr: 'Semaine',
    en: 'Week'
  },
  day: {
    fr: 'Jour',
    en: 'Day'
  },
  list: {
    fr: 'List',
    en: 'List'
  }
}

export const language = {
  home: home,
  calendar: calendar,
}
