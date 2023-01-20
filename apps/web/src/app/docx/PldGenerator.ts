import { Dod, DodStatus, Organization, OrganizationSection, Pld, Template } from "@pld/shared";
import { AlignmentType, Document, Header, Packer, Paragraph, TextRun, WidthType } from "docx";
import { DodDocx } from "./DodDocx";
import { PldDocx } from "./PldDocx";
import { ReportDocx } from "./ReportDocx";
import { ReportForm } from "../modal/pld/GeneratePldModal";
import { DodResumeDocx } from "./DodResumeDocx";

export const margins = {
  top: 80,
  left: 80,
  bottom: 80,
  right: 80,
  marginUnitType: WidthType.DXA,
}

export const Title = (title: string): Paragraph => {
  return new Paragraph({
    children: [new TextRun({
      text: title,
      font: 'Roboto',
      size: '15pt'
    })]
  })
}

export const Space = (): Paragraph => {
  return new Paragraph({
    children: [new TextRun({text: '', break: 1})]
  });
}

export class PldGenerator {

  constructor(private org: Organization, private pld: Pld, private dod: Dod[], private dodStatus: DodStatus[], private report: ReportForm, private sections: OrganizationSection[], private template?: Template, ) {}

  private getHeader(): Header {
    return new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: 'Epitech Innovative Project - Outside PLD',
              size: '11pt',
              font: 'Roboto',
              color: '639544'
            }),
          ]
        })
      ]
    });
  }
  public generate(): Document {
    return new Document({
      styles: {
        paragraphStyles: [
          {
            id: 'cellTitle',
            name: 'Cell Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              font: 'Roboto',
              size: '18pt',
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
            }
          },
          {
            id: 'CellSubtitle',
            name: 'Cell SubTitle',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              font: 'Roboto',
              size: '14pt'
            },
          },
          {
            id: 'CellContentTitle',
            name: 'Cell Content Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              font: 'Roboto',
              size: '14pt'
            },
          },
          {
            id: 'CellReportCell',
            name: 'Cell Report Cell',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              font: 'Roboto',
              size: '12pt'
            },
          },
          {
            id: 'Title',
            name: 'Title',
            next: 'Normal',
            run: {
              font: 'Roboto',
              size: '15pt'
            },
          }
        ],
        },
      sections: [{
        properties: {},
        headers: {
          default: this.getHeader(),
        },
        children: [
          new Paragraph({style: 'Title', alignment: AlignmentType.CENTER, children: [new TextRun({text: 'Description du document', size: '24pt'})]}),
          Space(),
          new PldDocx(this.pld, this.org, this.template).generateDescriptionTable(),
          Space(),
          new Paragraph({style: 'Title', children: [new TextRun({text: 'Les cartes de nos livrables'})]}),
          Space(),
          ...new DodResumeDocx(this.org, this.dod, this.dodStatus, this.sections).generate(),
          Space(),
          new Paragraph({style: 'Title', children: [new TextRun({text: 'Tableau des révisions'})]}),
          Space(),
          new PldDocx(this.pld, this.org, this.template).generateRevisionTable(),
          Space(),
          new Paragraph({style: 'Title', children: [new TextRun({text: 'DoDs'})]}),
          Space(),
          ...this.dod.map((d) => [Space(), new DodDocx(d, this.org, this.pld, this.template).generateTable()]).flat(),
          Space(),
          new Paragraph({style: 'Title', children: [new TextRun({text: 'Rapport d’avancement'})]}),
          Space(),
          new ReportDocx(this.pld, this.org, this.dod, this.dodStatus, this.report, this.template).generate()
        ]
      }]
    });
  }

  public static getBlobFromDoc(doc: Document, callback: (blob: Blob) => void) {
    Packer.toBlob(doc).then((blob) => {
      return callback(blob);
    });
  }

}
