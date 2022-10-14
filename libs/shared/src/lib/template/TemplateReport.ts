import { TemplateText } from "./TemplateText";
import { UserDomain } from "../user/User";

export class TemplateReport {
  title: TemplateText;
  subtitle: string;
  generateDodWithStatus: { id: string, value: string }[];
  globalProgress: {
    title: TemplateText,
    generateSections: string[];
  };
  progress: {
    title: TemplateText,
    subtitle: TemplateText,
  };
  userDod: {
    user: TemplateText,
    status: TemplateText,
    dods: TemplateText,
  }
  blockingPoint: TemplateText;
  globalComment: TemplateText;

  constructor(title: TemplateText, subtitle: string, generateDodWithStatus: { id: string; value: string }[], globalProgress: { title: TemplateText; generateSections: string[] }, progress: { title: TemplateText; subtitle: TemplateText }, userDod: { user: TemplateText; status: TemplateText; dods: TemplateText }, blockingPoint: TemplateText, globalComment: TemplateText) {
    this.title = title;
    this.subtitle = subtitle;
    this.generateDodWithStatus = generateDodWithStatus;
    this.globalProgress = globalProgress;
    this.progress = progress;
    this.userDod = userDod;
    this.blockingPoint = blockingPoint;
    this.globalComment = globalComment;
  }
}

export const defaultTemplateReport: TemplateReport = {
  title: {
    text: '%pld_status% - %pld_end_week_day% %pld_end_day% %pld_end_month% %pld_end_year% 17h',
  },
  subtitle: 'Avancement global',
  generateDodWithStatus: [],
  globalProgress: {
    title: {
      text: 'Sur quoi avez-vous collectivement avancé depuis le dernier RDV ?\nQuel est le % d’avancement de chacune des parties de votre projet '
    },
    generateSections: Object.values(UserDomain),
  },
  progress: {
    title: {
      text: 'Avancement individuel'
    },
    subtitle: {
      text: 'Travail\n (liste des tâches détaillées finies ou en cours)'
    }
  },
  blockingPoint: {
    text: 'Points bloquants'
  },
  globalComment: {
    text: 'Commentaires général'
  },
  userDod: {
    user: {
      text: '%user_firstname% %user_lastname_up%'
    },
    status: {
      text: '%status_name%: \\n\\n'
    },
    dods: {
      text: '\\t - %dod_version% %dod_title%'
    }
  }
};
