import {Dod, UserWorkTime, Organization} from "@pld/shared";
import {Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType} from "docx";
import {margins} from "./PldGenerator";
import {getDodStatusColor} from "../util/Preferences";

const colors = {
  cellBackground: [
    'dcdcdc',
    'ffffff'
  ]
}

const Title = (text: string) => {
  return new Paragraph({children: [new TextRun({
      font: 'Roboto',
      size: '18pt',
      text,
    })]})
}

const SubTitle = (text: string) => {
  return new Paragraph({children: [new TextRun({
      font: 'Roboto',
      size: '13pt',
      bold: true,
      text,
    })]})
}

const Description = (description: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: 'Description:',
        bold: true,
        size: '13pt',
        font: 'Roboto',
      }),
      new TextRun({
        break: 2,
        text: description,
        font: 'Roboto',
        size: '13pt'
      })
    ]
  });
}

const DodComp = (...dod: string[]) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: 'Definition Of Done:',
        bold: true,
        size: '13pt',
        font: 'Roboto',
      }),
      ...dod.map((dod) => new TextRun({
        text: `\t - ${dod}`,
        size: '13pt',
        font: 'Roboto',
        break: 1,
      })),
    ]
  });
}

const EstimatedCharge = (charges: UserWorkTime[]) => {

  return new Paragraph({
    children: charges.map((charges) => {
        return [
          new TextRun({
            font: 'Roboto',
            size: '13pt',
            text: charges.value + ' '
          }),
          new TextRun({
            font: 'Roboto',
            size: '13pt',
            bold: true,
            text: charges.format + ' '
          }),
          new TextRun({
            text: charges.users.map((user) => `${user.firstname}`).join(', '),
            size: '13pt',
            font: 'Roboto'
          })
        ]
      }).flat(),
  })
}

export class DodDocx {

  constructor(private dod: Dod, private org: Organization) {}

  public generateTable() {
    return new Table({
      width: {
        type: WidthType.PERCENTAGE,
        size: '100%'
      },
      rows: [
        new TableRow({
          children: [
          new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: getDodStatusColor(this.org.dodColors, this.dod.status)
            },
            children: [Title(this.dod.version + ' ' + this.dod.title)],
            width: {
              type: WidthType.PERCENTAGE,
              size: '100%'
            },
          }),
          ]}),
        new TableRow({
          children: [
          new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: colors.cellBackground[0]
            },
            width: {
              type: WidthType.PERCENTAGE,
              size: '50%'
            },
            children: [SubTitle('En tant que')]
          }),
          new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: colors.cellBackground[0]
            },
            width: {
              type: WidthType.PERCENTAGE,
              size: '50%'
            },
            children: [SubTitle('Je veux')]
          }),
        ]}),
        new TableRow({children: [
          new TableCell(({
            margins,
            width: {
              type: WidthType.PERCENTAGE,
              size: '50%'
            },
            children: [new Paragraph({children: [new TextRun({text: this.dod.skinOf, italics: true, size: '13pt', font: 'Roboto'})]})]
          })),
          new TableCell(({
            margins,
            width: {
              type: WidthType.PERCENTAGE,
              size: '50%'
            },
            children: [new Paragraph({children: [new TextRun({text: this.dod.want, size: '13pt', font: 'Roboto'})]})]
          })),
        ]}),
        new TableRow({
          children: [new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: colors.cellBackground[0]
            },
            width: {
              type: WidthType.PERCENTAGE,
              size: '100%'
            },
            children: [Description(this.dod.description)]})]
        }),
        new TableRow({
          children: [
            new TableCell({
              margins,
              width: {
                type: WidthType.PERCENTAGE,
                size: '100%'
              },
              children: [DodComp(...this.dod.descriptionOfDone)]
            })
          ]
        }),
        new TableRow(({
          children: [
            new TableCell({
              margins,
              shading: {
                type: ShadingType.SOLID,
                color: colors.cellBackground[0]
              },
              width: {
                type: WidthType.PERCENTAGE,
                size: '50%'
              },
              children: [
                SubTitle('Charge estimée:')
              ]
            }),
            new TableCell({
              margins,
              shading: {
                type: ShadingType.SOLID,
                color: colors.cellBackground[0]
              },
              width: {
                type: WidthType.PERCENTAGE,
                size: '50%'
              },
              children: [EstimatedCharge(this.dod.estimatedWorkTime)]
            })
          ]
        }))
      ]
    });
  }

}
