import { defaultTemplate, Dod, DodStatus, Organization, Pld, Template, TemplateType, User } from "@pld/shared";
import { AlignmentType, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { margins } from "./PldGenerator";
import { capitalize, months, weeksDay } from "@pld/utils";
import { getPlaceholder } from "../util/Placeholders";

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

export class ReportDocx {

  constructor(private pld: Pld, private org: Organization, private dod: Dod[], private dodStatus: DodStatus[], private template: Template | TemplateType = defaultTemplate) {}

  private getPlaceholder(text: string): string {
    return getPlaceholder(text, {org: this.org, pld: this.pld, docx: true});
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

  private getDodReport(user: User, dods: Dod[]) {
    return this.template.reportTemplate.generateDodWithStatus.map((status, index) => {
      const currentStatus = this.dodStatus.find((s) => s._id === status.id);
      const filteredDods = dods.filter((d) => d.status._id === status.id);
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
          new TableCell({children: [new Paragraph({style: 'CellReportCell', children: [new TextRun({text: getPlaceholder(this.template.reportTemplate.userDod.user.text, {org: this.org, user: u.user, pld: this.pld})})]})]}),
          new TableCell({children: [...this.getDodReport(u.user, this.dod)]})
        ],
      })
    });
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
          children: [
            new TableCell({
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
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  children: [new TextRun('RAS')]
                })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
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
              children: [
                new Paragraph({
                  style: 'CellSubtitle',
                  children: [new TextRun('RAS')]
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
              ]
            })
          ]
        })
      ]
    });
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
