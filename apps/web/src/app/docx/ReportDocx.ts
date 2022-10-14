import { defaultTemplate, Dod, DodStatus, Organization, Pld, Template, TemplateType, User } from "@pld/shared";
import { AlignmentType, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { getPlaceholder } from "../util/Placeholders";
import { ReportForm } from "../modal/pld/GeneratePldModal";
import { margins } from "./PldGenerator";

export class ReportDocx {

  constructor(private pld: Pld, private org: Organization, private dod: Dod[], private dodStatus: DodStatus[], private report: ReportForm, private template: Template | TemplateType = defaultTemplate) {}

  private getPlaceholder(text: string): string {
    return getPlaceholder(text, {org: this.org, pld: this.pld, docx: true});
  }

  private getDodReport(user: User, dods: Dod[]) {
    return this.template.reportTemplate.generateDodWithStatus.map((status) => {
      const currentStatus = this.dodStatus.find((s) => s._id === status.id);
      const filteredDods = dods.filter((d) => d.status._id === status.id && d.estimatedWorkTime.find((wt) => wt.users.find((a) => a._id === user._id)));
      return new Paragraph({style: 'CellReportCell', children: [
        new TextRun({text: getPlaceholder(this.template.reportTemplate.userDod.status.text, {org: this.org, pld: this.pld, dodStatus: currentStatus, docx: true}),}),
        ...filteredDods.map((dod) => new TextRun({text: getPlaceholder(this.template.reportTemplate.userDod.dods.text, {dod: dod, org: this.org, pld: this.pld, docx: true}), break: 1})
          )
        ]
      });
      }
    );
  }

  public generateUser() {
    const members = [...this.org.members, this.org.owner].map((u) => ({
      user: u,
      dod: this.dod.filter((d) => d.estimatedWorkTime.some((wt) => wt.users.some((wtu) => u._id === wtu._id)))
    }));
    return members.map((u) => {
      return new TableRow({
        children: [
          new TableCell({margins, children: [new Paragraph({style: 'CellReportCell', children: [new TextRun({text: getPlaceholder(this.template.reportTemplate.userDod.user.text, {org: this.org, user: u.user, pld: this.pld})})]})]}),
          new TableCell({margins, children: [...this.getDodReport(u.user, this.dod)]})
        ],
      })
    });
  }

  public generateSection() {
    return this.report.sectionsProgress.map((section) => {
      return new Paragraph({
        style: 'CellReportCell',
        children: [new TextRun({
          text: `${section.section}: ${section.progress}`,
        })]
      })
    })
  }

  public generate(): Table {
    return new Table({
      width: {
        type: WidthType.PERCENTAGE,
        size: '100%'
      },
      rows: [
        this.getMainTitle(),
        new TableRow({
          children: [
            new TableCell({
              margins,
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  children: [new TextRun({
                    text: this.getPlaceholder(this.template.reportTemplate.globalProgress.title.text)
                  })]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [new TableCell({
            margins,
            children: [...this.generateSection()]
          })]
        }),
        new TableRow({
          children: [
            new TableCell({
              margins,
              shading: {
                type: ShadingType.SOLID,
                color: this.template.colorTemplate.mainColor,
              },
              children: [
                new Paragraph({
                  style: 'CellContentTitle',
                  children: [
                    new TextRun({text: this.getPlaceholder(this.template.reportTemplate.progress.title.text)})
                  ]
                }),
              ]
            }),
            new TableCell({
              margins,
              shading: {
                type: ShadingType.SOLID,
                color: this.template.colorTemplate.mainColor,
              },
              children: [
                new Paragraph({
                  style: 'CellContentTitle',
                  children: [
                    new TextRun({text: this.getPlaceholder(this.template.reportTemplate.progress.subtitle.text)}),
                  ]
                })
              ]
            })
          ]
        }),
        ...this.generateUser(),
        new TableRow({
          children: [
            new TableCell({
              margins,
              shading: {
                type: ShadingType.SOLID,
                color: this.template.colorTemplate.mainColor.slice(1, 7),
              },
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun(this.getPlaceholder(this.template.reportTemplate.blockingPoint.text))]
                })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              margins,
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  children: [new TextRun({text: this.report.blockingPoints})]
                })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              margins,
              shading: {
                type: ShadingType.SOLID,
                color: this.template.colorTemplate.mainColor.slice(1, 7),
              },
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun(this.getPlaceholder(this.template.reportTemplate.globalComment.text))]
                })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              margins,
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  children: [new TextRun({text: this.report.globalComment})]
                })
              ]
            }),
          ]
        }),
      ]
    });
  }

  public getMainTitle(): TableRow {
    return new TableRow({
      children: [
        new TableCell({
          margins,
          shading: {
            type: ShadingType.SOLID,
            color: this.template.colorTemplate.mainColor.slice(1, 7),
          },
          children: [
            new Paragraph({
              style: 'cellTitle',
              children: [
                new TextRun({
                  text: this.getPlaceholder(this.template.reportTemplate.title.text),
                }),
                new TextRun({
                  break: 1,
                  text: this.getPlaceholder(this.template.reportTemplate.subtitle)
                })
              ]
            })
          ]
        })
      ]
    });
  }
}
