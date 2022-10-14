import { TemplateText } from "./TemplateText";

export class TemplateRevision {
  date: {
    title: TemplateText,
    content: TemplateText,
  };
  version: {
    title: TemplateText,
    content: TemplateText,
  };
  author: {
    title: TemplateText,
    content: TemplateText,
  };
  sections: {
    title: TemplateText,
    content: TemplateText,
  };
  comments: {
    title: TemplateText,
    content: TemplateText,
  }

  constructor(date: { title: TemplateText; content: TemplateText }, version: { title: TemplateText; content: TemplateText }, author: { title: TemplateText; content: TemplateText }, sections: { title: TemplateText; content: TemplateText }, comments: { title: TemplateText; content: TemplateText }) {
    this.date = date;
    this.version = version;
    this.author = author;
    this.sections = sections;
    this.comments = comments;
  }
}

export const defaultTemplateRevision: TemplateRevision = {
  date: {
    title: {
      text: 'Date'
    },
    content: {
      text: '%revision_date_numeric%'
    }
  },
  version: {
    title: {
      text: 'Version'
    },
    content: {
      text: '%revision_version%'
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
  sections: {
    title: {
      text: 'Section(s)'
    },
    content: {
      text: '%revision_sections%'
    }
  },
  comments: {
    title: {
      text: 'Commentaires'
    },
    content: {
      text: '%revision_comment%'
    }
  }
};
