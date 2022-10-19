import {defaultTemplate, Dod, Organization, Pld, Template, TemplateType, UserWorkTime} from "@pld/shared";
import {Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType} from "docx";
import {margins} from "./PldGenerator";
import {getPlaceholder, getUserPlaceholders} from "../util/Placeholders";

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

export class DodDocx {

  constructor(private dod: Dod, private org: Organization, private pld: Pld, private template: Template | TemplateType = defaultTemplate) {}

  private getPlaceholder(text: string, definition?: string): string {
    return getPlaceholder(text, {dod: this.dod, org: this.org, pld: this.pld, definition: definition, docx: true});
  }

  private EstimatedCharge(charges: UserWorkTime[]) {
    return new Paragraph({
      children: charges.map((wt, index) => {
        const users = wt.users.map((u) => getUserPlaceholders(this.template.dodTemplate.estimatedWorkTime.content.text, u)).join(', ');
        return [
          new TextRun({
            font: 'Roboto',
            size: '13pt',
            text: getPlaceholder(users, {workTime: wt, org: this.org, pld: this.pld, docx: true})
          }),
          charges[index+1] !== undefined ? new TextRun({text: ', '}) : new TextRun(''),
        ]
      }).flat(),
    })
  }

  private DodComp(...dod: string[]) {
    return new Paragraph({
      children: [
        new TextRun({
          text: this.getPlaceholder(this.template.dodTemplate.definitionOfDone.title.text),
          bold: true,
          size: '13pt',
          font: 'Roboto',
        }),
        ...dod.map((dod) => new TextRun({
          text: this.getPlaceholder(this.template.dodTemplate.definitionOfDone.content.text, dod),
          size: '13pt',
          font: 'Roboto',
          break: 1,
        })),
      ]
    });
  }

  private Description() {
    return new Paragraph({
      children: [
        new TextRun({
          text: this.getPlaceholder(this.template.dodTemplate.description.title.text),
          bold: true,
          size: '13pt',
          font: 'Roboto',
        }),
        new TextRun({
          break: 2,
          text: this.getPlaceholder(this.template.dodTemplate.description.content.text),
          font: 'Roboto',
          size: '13pt'
        })
      ]
    });
  }

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
            columnSpan: 2,
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: `#${this.dod.status.color}`
            },
            children: [Title(this.getPlaceholder(this.template.dodTemplate.title.text))],
          }),
          ]}),
        new TableRow({
          children: [
          new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: this.template.colorTemplate.secondaryColor,
            },
            children: [SubTitle(this.getPlaceholder(this.template.dodTemplate.skinOf.title.text))]
          }),
          new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: this.template.colorTemplate.secondaryColor
            },
            children: [SubTitle(this.getPlaceholder(this.template.dodTemplate.wantTo.title.text))]
          }),
        ]}),
        new TableRow({children: [
          new TableCell(({
            width: {
              size: '50%',
              type: WidthType.PERCENTAGE,
            },
            margins,
            children: [new Paragraph({children: [new TextRun({text: this.getPlaceholder(this.template.dodTemplate.skinOf.content.text), italics: true, size: '13pt', font: 'Roboto'})]})]
          })),
          new TableCell(({
            width: {
              size: '50%',
              type: WidthType.PERCENTAGE,
            },
            margins,
            children: [new Paragraph({children: [new TextRun({text: this.getPlaceholder(this.template.dodTemplate.wantTo.content.text), size: '13pt', font: 'Roboto'})]})]
          })),
        ]}),
        new TableRow({
          children: [new TableCell({
            margins,
            shading: {
              type: ShadingType.SOLID,
              color: this.template.colorTemplate.secondaryColor
            },
            columnSpan: 2,
            children: [this.Description()]})]
        }),
        new TableRow({
          children: [
            new TableCell({
              margins,
              columnSpan: 2,
              children: [this.DodComp(...this.dod.descriptionOfDone)]
            })
          ]
        }),
        new TableRow(({
          children: [
            new TableCell({
              margins,
              width: {
                size: '50%',
                type: WidthType.PERCENTAGE,
              },
              shading: {
                type: ShadingType.SOLID,
                color: colors.cellBackground[0]
              },
              children: [
                SubTitle(this.getPlaceholder(this.template.dodTemplate.estimatedWorkTime.title.text))
              ]
            }),
            new TableCell({
              margins,
              width: {
                size: '50%',
                type: WidthType.PERCENTAGE,
              },
              shading: {
                type: ShadingType.SOLID,
                color: colors.cellBackground[0]
              },
              children: [this.EstimatedCharge(this.dod.estimatedWorkTime)]
            })
          ]
        }))
      ]
    });
  }
}
