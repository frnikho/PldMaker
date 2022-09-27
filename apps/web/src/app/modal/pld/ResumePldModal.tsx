import React, { Fragment } from "react";
import { Modal, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "carbon-components-react";
import { Dod, DodStatus, Organization, OrganizationSection, Pld, User } from "@pld/shared";
import { CreateOrgSectionModal } from "../org/CreateOrgSectionModal";
import { RequiredUserContextProps } from "../../context/UserContext";
import { UpdateOrgSectionModal } from "../org/UpdateOrgSectionModal";
import { PreviewDodModal } from "../dod/PreviewDodModal";

type UserResume = {
  user: User;
  dod: Dod[];
}

type DodCell = {
  type: 'dod' | 'section';
  version: string;
  dod: Dod | undefined;
  section: OrganizationSection | undefined;
}


export type ResumePldModalProps = {
  open: boolean;
  hide: (show: boolean) => void;
  reload: () => void;
  org: Organization;
  pld: Pld;
  dod: Dod[];
  dodColors: DodStatus[];
  sections: OrganizationSection[];
} & RequiredUserContextProps;

export type ResumePldModalState = {
  resume: UserResume[];
  openCreateSection: boolean;
  openUpdateSection: boolean;
  openDodPreview: boolean;
  preselectedSection: string;
  selectedSection?: OrganizationSection;
  selectedDod?: Dod;
}

export class ResumePldModal extends React.Component<ResumePldModalProps, ResumePldModalState> {

  constructor(props: ResumePldModalProps) {
    super(props);
    this.state = {
      preselectedSection: '',
      openCreateSection: false,
      openUpdateSection: false,
      openDodPreview: false,
      resume: []
    }
  }

  private init() {
    const users: User[] = this.getUsers(this.props.org);
    this.setState({
      resume: users.map((user): UserResume => {
        return {
          user: user,
          dod: this.getDods(this.props.dod).filter((dod) => (dod.estimatedWorkTime.some((wt) => wt.users.some((a) => a._id === user._id))))
        }
      })
    })
  }

  override componentDidUpdate(prevProps: Readonly<ResumePldModalProps>, prevState: Readonly<ResumePldModalState>) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.init();
    }
  }

  private getTableHeader() {
    return this.state.resume.map((value) => {
      const hours: number = value.dod.map((dod) => {
        const abc = dod.estimatedWorkTime.map((wt) => {
          if (wt.users.some((a) => value.user._id === a._id))
            return parseFloat(wt.value as unknown as string);
          return 0;
        })
        console.log(abc);
        return abc;
      }).flat().reduce((a, b) => a + b, 0);
      return (
        <TableHeader id={value.user._id} key={value.user._id}>
          <p style={{ fontWeight: 'bold' }}>
            {value.user.firstname}
          </p>
          <p>
            {hours.toFixed(1)} J/H
          </p>
        </TableHeader>
      )
    })
  }

  private getDods(dod: Dod[]) {
    return dod.sort((a, b) => {
      if (b.version > a.version)
        return -1;
      else
        return 1;
    });
  }

  private getUsers(org: Organization) {
    return [org.owner, ...org.members].sort((a, b) => {
      if (a.firstname < b.firstname)
        return -1;
      else
        return 1;
    })
  }

  private showTableCellSection(section: OrganizationSection) {
    return (
      <TableCell onDoubleClick={() => {
        this.setState({ selectedSection: section });
        this.props.hide(false);
        this.setState({ openUpdateSection: true })
      }}>
        <p style={{ fontWeight: 'bold' }}>{section.section} {section.name}</p>
      </TableCell>
    )

  }

  private getTableBody() {
    const section: DodCell[] = this.props.sections.map((section) => ({ type: 'section', section: section, dod: undefined, version: section.section }));
    const DoDs: DodCell[] = (this.getDods(this.props.dod).map((dod) => ({ dod, type: 'dod', version: dod.version })) as DodCell[]).concat(...section).sort((a, b) => {
      return this.compare(a.version, b.version);
    });

    return DoDs.map((a, index) => {
      if (a.type === 'dod') {
        const dod = a.dod as Dod;
        const color = this.props.dodColors.find((a) => dod.status._id === a._id);
        return (
          <Fragment key={index}>
            <TableRow id={'dod_' + dod._id} key={index + dod._id}>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => {
                this.props.hide(false);
                this.setState({ openDodPreview: true, selectedDod: dod });
              }} key={dod._id + '_name'}>
                <div className="square" style={{
                  height: '12px',
                  width: '12px',
                  marginRight: 10,
                  backgroundColor: `#${color?.color}`,
                  borderRadius: '50%',
                  display: 'inline-block',
                }} />
                {dod.version} {dod.title} </TableCell>
              <TableCell>{dod.estimatedWorkTime.map((a) => a.users.map(() => parseFloat(String(a.value)))).flat().reduce((a, b) => a + b, 0).toFixed(1)}</TableCell>
              {this.getUsers(this.props.org).map((user) => {
                const hours = dod.estimatedWorkTime.map((wt) => {
                  if (wt.users.some((a) => user._id === a._id))
                    return parseFloat(wt.value as unknown as string);
                  return 0;
                }).flat().reduce((a, b) => a + b, 0);
                return (
                  <TableCell key={dod._id + user._id}>
                    {hours !== 0 ? hours.toFixed(1) : '-'}
                  </TableCell>
                )
              })}
            </TableRow>
          </Fragment>
        )
      } else {
        const section = a.section as OrganizationSection;
        return <TableRow key={index}>
          {this.showTableCellSection(section)}
          <TableCell />
          {this.getUsers(this.props.org).map((u, index) => <TableCell key={'user_blank_cell_' + index} />)}
        </TableRow>
      }
    });
  }

  private compare(a: string, b: string) {

    // 1. Split the strings into their parts.
    const a1 = a.split('.');
    const b1 = b.split('.');
    // 2. Contingency in case there's a 4th or 5th version
    const len = Math.min(a1.length, b1.length);
    // 3. Look through each version number and compare.
    for (let i = 0; i < len; i++) {
      const a2 = +a1[i] || 0;
      const b2 = +b1[i] || 0;

      if (a2 !== b2) {
        return a2 > b2 ? 1 : -1;
      }
    }

    // 4. We hit this if the all checked versions so far are equal
    //
    return a1.length - b1.length;
  }

  private showModals() {
    return (
      <>
        {this.state.selectedDod ? <PreviewDodModal dod={this.state.selectedDod} open={this.state.openDodPreview} onDismiss={() => {
          this.setState({ openDodPreview: false });
          this.props.hide(true);
        }} onSuccess={() => {
          this.props.hide(true);
          this.setState({ openCreateSection: false })
        }} /> : null}
        <CreateOrgSectionModal preselectedSection={this.state.preselectedSection} open={this.state.openCreateSection} onDismiss={() => {
          this.setState({ openCreateSection: false });
          this.props.hide(true);
        }} onSuccess={() => {
          this.props.reload();
          this.props.hide(true);
          this.setState({ openCreateSection: false })
        }} org={this.props.org} userContext={this.props.userContext} />
        {this.state.selectedSection ? <UpdateOrgSectionModal section={this.state.selectedSection} open={this.state.openUpdateSection} onDismiss={() => {
          this.setState({ openUpdateSection: false });
          this.props.hide(true);
        }} onSuccess={() => {
          this.props.reload();
          this.props.hide(true);
          this.setState({ openUpdateSection: false })
        }} org={this.props.org} userContext={this.props.userContext} /> : null}
      </>
    )
  }

  override render() {
    return (
      <>
        {this.showModals()}
        <Modal
          size={"lg"}
          open={this.props.open}
          onRequestClose={() => this.props.hide(false)}
          passiveModal
          modalHeading="Récapitulatif des J/H">
          <Table size="md" useZebraStyles={false}>
            <TableHead>
              <TableRow id={"DodHeader"} key={"DodHeader"}>
                <TableHeader id={"DodHeaderName"} key={"DodHeaderName"}>
                  DoDs
                </TableHeader>
                <TableHeader>
                  <p style={{ fontWeight: 'bold' }}>
                    Total
                  </p>
                  <p>
                    {this.props.dod.map((dod) => dod.estimatedWorkTime.map((wt) => wt.users.map(() => parseFloat(String(wt.value)))).flat()).flat().reduce((a, b) => a + b, 0)} J/H
                  </p>
                </TableHeader>
                {this.getTableHeader()}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.getTableBody()}
            </TableBody>
          </Table>
        </Modal>
      </>
    )
  }
}
