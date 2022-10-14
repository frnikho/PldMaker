import { TemplateText } from "./TemplateText";

export class TemplateDod {
  title: TemplateText;
  skinOf: {
    title: TemplateText;
    content: TemplateText;
  };
  wantTo: {
    title: TemplateText;
    content: TemplateText;
  };
  description: {
    title: TemplateText;
    content: TemplateText;
  };
  definitionOfDone: {
    title: TemplateText;
    content: TemplateText;
  };
  estimatedWorkTime: {
    title: TemplateText;
    content: TemplateText;
  }

  constructor(title: TemplateText, skinOf: { title: TemplateText; content: TemplateText }, wantTo: { title: TemplateText; content: TemplateText }, description: { title: TemplateText; content: TemplateText }, definitionOfDone: { title: TemplateText; content: TemplateText }, estimatedWorkTime: { title: TemplateText; content: TemplateText }) {
    this.title = title;
    this.skinOf = skinOf;
    this.wantTo = wantTo;
    this.description = description;
    this.definitionOfDone = definitionOfDone;
    this.estimatedWorkTime = estimatedWorkTime;
  }
}

export const defaultTemplateDod: TemplateDod = {
  title: {
    text: '%dod_version% %dod_title%'
  },
  skinOf: {
    title: {
      text: 'En tant que'
    },
    content: {
      text: '%dod_skinof%'
    }
  },
  wantTo: {
    title: {
      text: 'Je veux ...'
    },
    content: {
      text: '%dod_wantto%',
    }
  },
  description: {
    title: {
      text: 'Description: \\n \\n',
    },
    content: {
      text: '%dod_description%'
    }
  },
  definitionOfDone: {
    title: {
      text: 'Definition of done: \\n \\n'
    },
    content: {
      text: '\\t - %dod_definition%'
    }
  },
  estimatedWorkTime: {
    title: {
      text: 'Charges estimées:',
    },
    content: {
      text: '%dod_wt_value% J/H %user_firstname%',
    }
  }
};
