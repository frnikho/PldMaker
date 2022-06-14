export type Template = {
  revisions: {
    enable: boolean,
  },
  dod: {
    enable: boolean,
    description: {
      enable: boolean,
      title: NamedTextStyle,
      value: TextStyle,
    }
  }
}

export type NamedTextStyle = {
  text: string,
} & TextStyle;

export type TextStyle = {
  size: number,
  font: string,
  bold: boolean,
  break: number,
}
