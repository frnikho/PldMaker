import {Pld} from "../../../../../libs/data-access/pld/Pld";
import {Dod} from "../../../../../libs/data-access/pld/dod/Dod";
import {AlignmentType, Document, Footer, Header, Packer, PageNumber, Paragraph, TextRun, WidthType} from "docx";
import {DodDocx} from "./DodDocx";
import {Organization} from "../../../../../libs/data-access/organization/Organization";
import {User} from "../../../../../libs/data-access/user/User";
import {PldDocx} from "./PldDocx";
import {PldResumeDocx} from "./PldResumeDocx";

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

  private readonly rawDod: Dod[] = [];
  private readonly dod: Dod[] = [];
  private readonly pld: Pld;
  private readonly org: Organization;

  constructor(pld: Pld, dod: Dod[], org: Organization) {
    this.org = org;
    this.pld = pld;
    this.rawDod = dod;
    this.dod = dod.map((dod) => {
      return {
        ...dod,
        estimatedWorkTime: dod.estimatedWorkTime.map((workTime) => {
          return {
            ...workTime,
            users: workTime.users.map((userId) => {
              const u1 = [...(org.members as User[]), org.owner as User].find((user) => user._id === userId);
              if (u1 !== undefined) {
                if (u1.lastname !== undefined && u1.firstname !== undefined) {
                  return u1.firstname;
                } else {
                  return u1.email;
                }
              } else if (userId === (org.owner as User)._id) {
                return (org.owner as User).email;
              }
              return undefined;
            }).filter((a) => a !== undefined) as string[],
          }
        })
      }
    })
  }

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
    const generator: PldDocx = new PldDocx(this.pld, this.org);
    const resume: PldResumeDocx = new PldResumeDocx(this.pld, this.org, this.rawDod);
    return new Document({
      sections: [{
        headers: {
          default: this.getHeader(),
        },
        footers: {
          default: this.getFooter(),
          first: new Footer({children: [new TextRun({text: ''})]}),
        },
        children: [
          Title('Tableau des révisions'),
          Space(),
          generator.generateRevisionTable(),
          Space(),
          Title('Description du document'),
          Space(),
          generator.generateDescriptionTable(),
          Space(),
          Title('Tableau des révisions'),
          Space(),
          ...this.dod.map((dod) => {
            return [new DodDocx(dod).generateTable(), Space()];
          }).flat(),
          Space(),
          Title('Rapport d’avancement'),
          Space(),
          resume.generateResumeTable(),
          Space(),
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
