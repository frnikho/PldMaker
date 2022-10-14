import { Pld, Dod, Organization, User, DodStatus, Template } from "@pld/shared";
import {AlignmentType, Document, Footer, Header, Packer, PageNumber, Paragraph, TextRun, WidthType} from "docx";
import {DodDocx} from "./DodDocx";
import {PldDocx} from "./PldDocx";
import {ReportDocx} from "./ReportDocx";

export const margins = {
  top: 100,
  bottom: 100,
  marginUnitType: WidthType.NIL
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
    children: [new TextRun({text: ' '})]
  });
}

export class PldGenerator {

  constructor(private org: Organization, private pld: Pld, private dod: Dod[], private dodStatus: DodStatus[], private template?: Template) {}

  /*footers: {
    default: {
      options: {
        children: [new Paragraph({children: [new TextRun({text: 'ABCDEF'})]})]
      }
    }
  },*/

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

  private getFooter() {
    return new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              font: 'Arial',
              size: '13pt',
              children: [PageNumber.CURRENT]
            }),
          ],
        }),
      ],
    });
  }

  public generate(): Document {
    //const generator: PldDocx = new PldDocx(this.pld, this.org);
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
          }
        ],

        },
      sections: [{
       /* headers: {
          default: this.getHeader(),
        },
        footers: {
          default: this.getFooter(),
          first: new Footer({children: [new TextRun({text: ''})]}),
        },*/
        children: [
          new ReportDocx(this.pld, this.org, this.dod, this.dodStatus, this.template).generate()
          /*Title('Description du document'),
          Space(),
          generator.generateDescriptionTable(),
          Space(),
          Title('Tableau des révisions'),
          Space(),
          generator.generateRevisionTable(),
          Space(),
          Title('Tableau des révisions'),
          Space(),
          ...this.dod.map((dod) => {
            return [new DodDocx(dod, this.org).generateTable(), Space()];
          }).flat(),
          Space(),
          Title('Rapport d’avancement'),
          Space(),
          /!*resume.generateResumeTable(),*!/
          Space(),*/
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
