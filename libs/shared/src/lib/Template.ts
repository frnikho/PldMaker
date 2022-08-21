export class TemplateData {
/*  static revisions = class {
    enable: boolean;
  };

  static documentDescription = class {
    enable: boolean;
    cellsTitleBackgroundColor: string;
    cellsTitleWidth: string;
    title: Title;
    rows: RowData[];
  }

  static dod = class {
    enable: boolean;
    cellBackgroundColor: string[];
    title: {
      title: NamedTextStyle;
      value: TextStyle;
    }
    skinOf: {
      enable: boolean;
      title: NamedTextStyle;
      value: TextStyle;
    }
    wantTo: {
      enable: boolean;
      title: NamedTextStyle;
      value: TextStyle;
    }
    description: {
      enable: boolean;
      title: NamedTextStyle;
      value: TextStyle;
    }
    definitionOfDone: {
      enable: boolean;
      title: NamedTextStyle;
      value: TextStyle;
    }
    estimatedWorkTime: {
      enable: boolean;
      title: NamedTextStyle;
      value: TextStyle;
    }
  }*/
}

export type RowData = {
  enable: boolean;
  title: TextStyle;
  value: TextStyle;
}

export type Title = {
  enable: boolean;
  title: TextStyle;
  value: TextStyle;
}

export type TextStyle = {
  size: number;
  font: string;
  bold: boolean;
  break: number;
}

export type NamedTextStyle = {
  text: string;
} & TextStyle;
