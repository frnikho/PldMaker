import { Dod, DodStatus, Organization, OrganizationSection } from "@pld/shared";
import { Paragraph, TextRun } from "docx";

type DodCell = {
  type: 'dod' | 'section';
  version: string;
  dod: Dod | undefined;
  section: OrganizationSection | undefined;
}

export class DodResumeDocx {

  constructor(private org: Organization, private DoDs: Dod[], private dodStatus: DodStatus[], private sections: OrganizationSection[]) {
  }

  public compare(a: string, b: string) {
    const a1 = a.split('.');
    const b1 = b.split('.');
    const len = Math.min(a1.length, b1.length);
    for (let i = 0; i < len; i++) {
      const a2 = +a1[i] || 0;
      const b2 = +b1[i] || 0;
      if (a2 !== b2) {
        return a2 > b2 ? 1 : -1;
      }
    }
    return a1.length - b1.length;
  }

  private getData(): Paragraph[] {
    const section: DodCell[] = this.sections.map((section) => ({ type: 'section', section: section, dod: undefined, version: section.section }));
    const DoDs: DodCell[] = (this.DoDs.map((dod) => ({ dod, type: 'dod', version: dod.version })) as DodCell[]).concat(...section).sort((a, b) => {
      return this.compare(a.version, b.version);
    });
    return DoDs.map((data) => {
      if (data.type === 'dod') {
        const dod = data.dod as Dod;
        return new Paragraph({
          children: [
            new TextRun({
              text: `${dod.version} ${dod.title}`,
              color: `#${dod.status.color}`,
              size: '12pt',
              font: 'Roboto',
            })
          ]
        });
      } else {
        const section = data.section as OrganizationSection;
        return new Paragraph({
          children: [
            new TextRun({text: '', break: 1}),
            new TextRun({
              text: `${section.section} ${section.name}`,
              size: '14pt',
              font: 'Roboto',
            })
          ]
        });
      }
    })

  }

  public generate() {
    return this.getData();
    /*return [
      new Paragraph({style: 'Title', alignment: AlignmentType.CENTER, children: [new TextRun({text: 'A.API'})]}),
      ...this.DoDs.filter((a) => a.version.startsWith('1.')).map((dod) => {
        return new Paragraph({
          children: [new TextRun({
            text: `${dod.version} ${dod.title}`,
            color: `#${dod.status.color}`,
            size: '12pt',
            font: 'Roboto',
          })]
        })
      }),
      new Paragraph({style: 'Title', alignment: AlignmentType.CENTER, children: [new TextRun({text: 'B.Client Mobile'})]}),
      ...this.DoDs.filter((a) => a.version.startsWith('2.')).map((dod) => {
        return new Paragraph({
          children: [new TextRun({
            text: `${dod.version} ${dod.title}`,
            color: `#${dod.status.color}`,
            size: '12pt',
            font: 'Roboto',
          })]
        })
      }),
      new Paragraph({style: 'Title', alignment: AlignmentType.CENTER, children: [new TextRun({text: 'C.Autre'})]}),
      ...this.DoDs.filter((a) => a.version.startsWith('3.')).map((dod) => {
        return new Paragraph({
          children: [new TextRun({
            text: `${dod.version} ${dod.title}`,
            color: `#${dod.status.color}`,
            size: '12pt',
            font: 'Roboto',
          })]
        })
      }),
    ]*/
  }

}
