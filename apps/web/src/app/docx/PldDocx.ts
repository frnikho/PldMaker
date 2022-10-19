import {defaultTemplate, Organization, Pld, PldRevision, Template, TemplateType} from "@pld/shared";
import {Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType} from "docx";
import {margins} from "./PldGenerator";
import {getPlaceholder} from "../util/Placeholders";

const HeaderRevisionCell = (title: string, size: string) => {
  return new TableCell({
    margins,
    width: {
      type: WidthType.PERCENTAGE,
      size: size
    },
    shading: {
      type: ShadingType.SOLID,
      color: '77b243',
    },
    children: [new Paragraph({
      children: [new TextRun({
        text: title,
        font: 'Roboto',
        size: '12pt',
      })]
    })]
  })
}

const RevisionCell = (value: string): TableCell => {
  return new TableCell({
    margins,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            font: 'Roboto',
            text: value,
            size: '12pt'
          })
        ]
      })
    ]
  })
}

const DescCell = (title: string, value: string) => {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          type: WidthType.PERCENTAGE,
          size: '50%'
        },
        margins,
        shading: {
          type: ShadingType.SOLID,
          color: '77b243'
        },
        children: [
          new Paragraph({
            children: [new TextRun({
              size: '12pt',
              font: 'Roboto',
              text: title,
            })]
          })
        ]
      }),
      new TableCell({
        margins,
        width: {
          type: WidthType.PERCENTAGE,
          size: '50%'
        },
        children: [
          new Paragraph({
            children: [new TextRun({
              size: '12pt',
              font: 'Roboto',
              text: value,
            })]
          })
        ]
      })
    ]
  })
}

export class PldDocx {

  constructor(private pld: Pld, private org: Organization, private template: TemplateType | Template = defaultTemplate) {
  }

  private getPlaceholders(text: string, revision?: PldRevision): string {
    return getPlaceholder(text, {pld: this.pld, org: this.org, revision});
  }

  public generateRevision(revision: PldRevision): TableRow {
    return new TableRow({
      children: [
        RevisionCell(this.getPlaceholders(this.template.revisionTemplate.date.content.text, revision)),
        RevisionCell(this.getPlaceholders(this.template.revisionTemplate.version.content.text, revision)),
        RevisionCell(this.getPlaceholders(this.template.revisionTemplate.author.content.text, revision)),
        RevisionCell(this.getPlaceholders(this.template.revisionTemplate.sections.content.text, revision)),
        RevisionCell(this.getPlaceholders(this.template.revisionTemplate.comments.content.text, revision)),
      ],
    })
  }

  public generateRevisionTable(): Table {
    return new Table({
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            HeaderRevisionCell(this.getPlaceholders(this.template.revisionTemplate.date.title.text), '15%'),
            HeaderRevisionCell(this.getPlaceholders(this.template.revisionTemplate.version.title.text), '10%'),
            HeaderRevisionCell(this.getPlaceholders(this.template.revisionTemplate.author.title.text), '15%'),
            HeaderRevisionCell(this.getPlaceholders(this.template.revisionTemplate.sections.title.text), '30%'),
            HeaderRevisionCell(this.getPlaceholders(this.template.revisionTemplate.comments.title.text), '30%')
          ]
        }),
        ...this.pld.revisions.map((revision) => {
          return this.generateRevision(revision);
        })
      ],
    })
  }

  public generateDescriptionTable(): Table {
    return new Table({
      width: {
        size: '100%',
        type: WidthType.PERCENTAGE,
      },
      rows: [
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.title.title.text), this.getPlaceholders(this.template.descriptionTemplate.title.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.object.title.text), this.getPlaceholders(this.template.descriptionTemplate.object.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.author.title.text), this.getPlaceholders(this.template.descriptionTemplate.author.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.manager.title.text), this.getPlaceholders(this.template.descriptionTemplate.manager.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.email.title.text), this.getPlaceholders(this.template.descriptionTemplate.email.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.keywords.title.text), this.getPlaceholders(this.template.descriptionTemplate.keywords.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.promotion.title.text), this.getPlaceholders(this.template.descriptionTemplate.promotion.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.updatedDate.title.text), this.getPlaceholders(this.template.descriptionTemplate.updatedDate.content.text)),
        DescCell(this.getPlaceholders(this.template.descriptionTemplate.version.title.text), this.getPlaceholders(this.template.descriptionTemplate.version.content.text)),
      ]
    });
  }

}

export const table = new Table({
  columnWidths: [2505, 6505],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 3505,
            type: WidthType.DXA,
          },
          children: [new Paragraph("Hello")],
        }),
        new TableCell({
          width: {
            size: 5505,
            type: WidthType.DXA,
          },
          children: [],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 3505,
            type: WidthType.DXA,
          },
          children: [],
        }),
        new TableCell({
          width: {
            size: 5505,
            type: WidthType.DXA,
          },
          children: [new Paragraph("World")],
        }),
      ],
    }),
  ],
});

export const table2 = new Table({
  columnWidths: [4505, 4505],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 4505,
            type: WidthType.DXA,
          },
          children: [new Paragraph("Hello")],
        }),
        new TableCell({
          width: {
            size: 4505,
            type: WidthType.DXA,
          },
          children: [],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 4505,
            type: WidthType.DXA,
          },
          children: [],
        }),
        new TableCell({
          width: {
            size: 4505,
            type: WidthType.DXA,
          },
          children: [new Paragraph("World")],
        }),
      ],
    }),
  ],
});

export const table3 = new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Hello")],
        }),
        new TableCell({
          children: [],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [new Paragraph("World")],
        }),
      ],
    }),
  ],
});
