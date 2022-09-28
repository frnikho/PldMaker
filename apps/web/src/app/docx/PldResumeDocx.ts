import {Organization, Pld, User, Dod} from "@pld/shared";
import {AlignmentType, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType} from "docx";
import {margins} from "./PldGenerator";
import { capitalize, months, weeksDay } from "@pld/utils";

const UserAdv = (): TableRow => {
  return new TableRow({
    children: [
      new TableCell({
        shading: {
          type: ShadingType.SOLID,
          color: '77b243',
        },
        margins,
        width: {
          type: WidthType.PERCENTAGE,
          size: '100%'
        },
        children: [new Paragraph({
          children: [new TextRun({
            font: 'Roboto',
            size: '14pt',
            text: 'Avancement individuel'
          })]
        })]
      }),
      new TableCell({
        margins,
        shading: {
          type: ShadingType.SOLID,
          color: '77b243'
        },
        width: {
          type: WidthType.PERCENTAGE,
          size: '100%'
        },
        children: [new Paragraph({
          children: [new TextRun({
            font: 'Roboto',
            size: '14pt',
            text: 'Travail (liste des tâches détaillées finies ou en cours)\n'
          })]
        })]
      })
    ]
  })
}

export const MainTitle = (type: string, date: string): TableRow => {
  return new TableRow({
    children: [new TableCell({
      shading: {
        type: ShadingType.SOLID,
        color: '77b243'
      },
      margins,
      width: {
        type: WidthType.PERCENTAGE,
        size: '100%',
      },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            font: 'Roboto',
            size: '18pt',
            text: type + ' - ' + date
          }),
          new TextRun({
            break: 1,
            text: '-',
            size: '18pt',
            font: 'Roboto'
          }),
          new TextRun({
            break: 1,
            text: 'Avancement global',
            size: '18pt',
            font: 'Roboto'
          }),
        ]
      })]
    })]
  })
}

export const Title = () => {
  return null;
}

export class PldResumeDocx {

  constructor(private pld: Pld, private org: Organization, private dod: Dod[]) {

  }

  public generateMemberAdv(member: User): TableRow {
    let title: string;
    if (member.firstname !== undefined && member.lastname !== undefined) {
       title = member.firstname + ' ' + member.lastname.toUpperCase();
    } else {
       title = member.email;
    }

    const userDod = this.dod.filter((dod) => dod.estimatedWorkTime.some((wt) => wt.users.some((user) => user._id === member._id)));
    const dodDones = userDod.filter((dod) => {
      return dod.status.name === 'En cours';
    });
    const dodInProgress = userDod.filter((dod) => dod.status.name === 'Fini');

    return new TableRow({
      children: [
        new TableCell({
          width: {
            type: WidthType.PERCENTAGE,
            size: '50%'
          },
          children: [new Paragraph({
            children: [new TextRun({
              font: 'Roboto',
              size: '13pt',
              text: title,
            })]
          })]
        }),
        new TableCell({
          width: {
            type: WidthType.PERCENTAGE,
            size: '50%'
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'En cours :',
                  font: 'Roboto',
                  size: '12pt'
                }),
                ...dodInProgress.map((dod) => {
                  return new TextRun({
                    break: 1,
                    font: 'Roboto',
                    size: '12pt',
                    text: `\t -  [${dod.version}] ${dod.title}`,
                  })
                }),
                new TextRun({
                  break: 1,
                  text: 'Fini :',
                  font: 'Roboto',
                  size: '12pt'
                }),
                ...dodDones.map((dod) => {
                  return new TextRun({
                    break: 1,
                    font: 'Roboto',
                    size: '12pt',
                    text: `\t -  [${dod.version}] ${dod.title}`,
                  })
                })
              ]
            })
          ]
        })
      ]
    })
  }

  private getResumeTitleDate() {
    const date = new Date();
    return `${weeksDay[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} 17h`
  }

  public generateResumeTable(): Table {
    return new Table({
      width: {
        type: WidthType.PERCENTAGE,
        size: '100%'
      },
      rows: [
        MainTitle(capitalize(this.pld.currentStep), this.getResumeTitleDate()),
        UserAdv(),
        ...([...this.org.members, this.org.owner]).map((member) => this.generateMemberAdv(member))
      ]
    })
  }



}
