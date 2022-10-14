import { TemplateText } from "./TemplateText";

export class TemplateDescription {
  title: {
    title: TemplateText;
    content: TemplateText;
  };
  object: {
    title: TemplateText;
    content: TemplateText;
  };
  author: {
    title: TemplateText;
    content: TemplateText;
  };
  manager: {
    title: TemplateText;
    content: TemplateText;
  };
  email: {
    title: TemplateText;
    content: TemplateText;
  };
  keywords: {
    title: TemplateText;
    content: TemplateText;
  };
  promotion: {
    title: TemplateText;
    content: TemplateText;
  };
  updatedDate: {
    title: TemplateText;
    content: TemplateText;
  };
  version: {
    title: TemplateText;
    content: TemplateText;
  }

  constructor(title: { title: TemplateText; content: TemplateText }, object: { title: TemplateText; content: TemplateText }, author: { title: TemplateText; content: TemplateText }, manager: { title: TemplateText; content: TemplateText }, email: { title: TemplateText; content: TemplateText }, keywords: { title: TemplateText; content: TemplateText }, promotion: { title: TemplateText; content: TemplateText }, updatedDate: { title: TemplateText; content: TemplateText }, version: { title: TemplateText; content: TemplateText }) {
    this.title = title;
    this.object = object;
    this.author = author;
    this.manager = manager;
    this.email = email;
    this.keywords = keywords;
    this.promotion = promotion;
    this.updatedDate = updatedDate;
    this.version = version;
  }
}

export const defaultTemplateDescription: TemplateDescription = {
  title: {
    title: {
      text: 'Titre'
    },
    content: {
      text: '%pld_name%'
    }
  },
  object: {
    title: {
      text: 'Object'
    },
    content: {
      text: '%pld_description%'
    }
  },
  author: {
    title: {
      text: 'Auteur'
    },
    content: {
      text: '%org_name%'
    }
  },
  manager: {
    title: {
      text: 'Responsable'
    },
    content: {
      text: '%pld_manager_firstname% %pld_manager_lastname_up%'
    }
  },
  email: {
    title: {
      text: 'E-mail'
    },
    content: {
      text: '%pld_manager_email%'
    }
  },
  keywords: {
    title: {
      text: 'Mots-clés'
    },
    content: {
      text: '%pld_keywords%'
    }
  },
  promotion: {
    title: {
      text: 'Promotion'
    },
    content: {
      text: '%pld_promotion%'
    }
  },
  updatedDate: {
    title: {
      text: 'Date de la mise à jour'
    },
    content: {
      text: '%pld_updated_day% %pld_updated_month% %pld_updated_year%'
    }
  },
  version: {
    title: {
      text: 'Version du modèle'
    },
    content: {
      text: '%pld_version%'
    }
  }
};
