import { Dod, DodStatus } from "@pld/shared";
import { AlignmentType, Paragraph, TextRun } from "docx";

export class DodResumeDocx {

  constructor(private DoDs: Dod[], private dodStatus: DodStatus[]) {
  }

  public generate() {
    return [
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
    ]
  }

}
