export class TemplateColor {
  mainColor: string;
  secondaryColor: string;
  tertiaryColor: string;

  constructor(mainColor: string, secondaryColor: string, tertiaryColor: string) {
    this.mainColor = mainColor;
    this.secondaryColor = secondaryColor;
    this.tertiaryColor = tertiaryColor;
  }
}

export const defaultTemplateColor: TemplateColor = {
  mainColor: '#77b243',
  secondaryColor: '#dcdcdc',
  tertiaryColor: '#dcdcdc',
};
