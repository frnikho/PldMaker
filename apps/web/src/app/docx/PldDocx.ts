import {Pld, PldRevision, Organization} from "@pld/shared";
import {Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType} from "docx";
import {margins} from "./PldGenerator";
import { formatDateNumeric, formatShortDate } from "@pld/utils";

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

const RevisionRow = (revision: PldRevision, author: string): TableRow => {
  return new TableRow({
    children: [
      RevisionCell(formatShortDate(new Date(revision.created_date))),
      RevisionCell(revision.version.toString()),
      RevisionCell(author),
      RevisionCell(revision.sections.join(', ')),
      RevisionCell(revision.comments ?? 'Non-défini'),
    ],
  })
}

const DescCell = (title: string, value: string) => {
  return new TableRow({
    children: [
      new TableCell({
        margins,
        shading: {
          type: ShadingType.SOLID,
          color: '77b243'
        },
        width: {
          type: WidthType.PERCENTAGE,
          size: '50%'
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

  constructor(private pld: Pld, private org: Organization) {
  }


  public generateRevisionTable(): Table {
    return new Table({
      width: {
        type: WidthType.PERCENTAGE,
        size: '100%'
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            HeaderRevisionCell('Date', '15%'),
            HeaderRevisionCell('Version', '10%'),
            HeaderRevisionCell('Auteur', '15%'),
            HeaderRevisionCell('Section(s)', '30%'),
            HeaderRevisionCell('Commentaires', '30%')
          ]
        }),
        ...this.pld.revisions.map((revision) => {
          return RevisionRow(revision, this.org.name);
        })
      ],
    })
  }

  public generateDescriptionTable(): Table {
    let responsable: string;
    if (this.pld.manager.firstname !== undefined && this.pld.manager.lastname !== undefined) {
      responsable = this.pld.manager.lastname.toUpperCase() + ' ' + this.pld.manager.firstname;
    } else {
      responsable = 'Non définie'
    }

    return new Table({
      width: {
        type: WidthType.PERCENTAGE,
        size: '100%'
      },
      rows: [
        DescCell('Titre', this.pld.title),
        DescCell('Object', `PLD ${this.pld.status}`),
        DescCell('Auteur', this.org.name),
        DescCell('Responsable', responsable),
        DescCell('E-mail', this.pld.manager.email),
        DescCell('Mots-clés', this.pld.tags.join(', ')),
        DescCell('Promotion', this.pld.promotion.toString()),
        DescCell('Date de la mise à jour', formatDateNumeric(new Date(this.pld.updated_date ?? new Date()))),
        DescCell('Version du modèle', this.pld.version.toFixed(1)),
      ]
    });
  }

}
