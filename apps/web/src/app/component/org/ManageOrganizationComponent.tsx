import React from "react";
import {UserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import { DodStatus, Organization, OrganizationSection, User } from "@pld/shared";
import {toast} from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column,
  Grid, Link,
  Table,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableHeader,
  TableRow, TableToolbar, TableToolbarContent, TextInput,
  Tile
} from "carbon-components-react";

import {DataTable} from '@carbon/react';

import {TrashCan, Add, Migrate, Fire} from '@carbon/icons-react'

import {Stack} from '@carbon/react';
import {FieldData} from "../../util/FieldData";
import {NavProps, withNav} from "../../util/Navigation";
import {NewOrgDodColorModal} from "../../modal/org/NewOrgDodColorModal";
import {SocketContext} from "../../context/SocketContext";
import { CreateOrgSectionModal } from "../../modal/org/CreateOrgSectionModal";
import { DeleteOrgModal } from "../../modal/org/manage/DeleteOrgModal";
import { MigrateOrgModal } from "../../modal/org/manage/MigrateOrgModal";
import { UpdateOrgSectionModal } from "../../modal/org/UpdateOrgSectionModal";
import { DeleteOrgSectionModal } from "../../modal/org/DeleteOrgSectionModal";
import { ManageOrgDodStatusComponent } from "./manage/ManageOrgDodStatusComponent";

export const sectionHeaderData = [
  {
    key: 'section',
    header: 'Section',
  },
  {
    key: 'name',
    header: 'Nom',
  },
];

export type ManageOrgProps = {
  auth: UserContextProps,
  orgId: string;
} & NavProps;

export type ManageOrgState = {
  org?: Organization,
  dodStatus: DodStatus[];
  orgSection: OrganizationSection[];
  newUserInput: FieldData<string>;
  openDodColor: boolean;
  openSection: boolean;
  openCreateDodStatus: boolean;
  openDelete: boolean;
  openMigrate: boolean;
  openUpdateSection: boolean;
  openDeleteSection: boolean;
  selectedSection?: OrganizationSection;
}

class ManageOrganizationComponent extends React.Component<ManageOrgProps, ManageOrgState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props) {
    super(props);
    this.state = {
      dodStatus: [],
      orgSection: [],
      openDodColor: false,
      openSection: false,
      openDelete: false,
      openCreateDodStatus: false,
      openMigrate: false,
      openUpdateSection: false,
      openDeleteSection: false,
      org: undefined,
      newUserInput: {
        value: '',
        error: undefined
      },
    }
    this.onClickInviteUser = this.onClickInviteUser.bind(this);
    this.onClickRevokeUser = this.onClickRevokeUser.bind(this);
  }

  override componentDidMount() {
    this.loadOrg();
    this.registerListeners();
  }

  private registerListeners() {
    const socket = this.context;
    socket.on('Org:Update', ({orgId}: { orgId: string }) => {
      if (this.props.orgId === orgId) {
        this.loadOrg();
      }
    });
  }

  private loadDodStatus() {
    OrganizationApiController.getOrgDodStatus(this.props.auth.accessToken, this.props.orgId, (dodStatus, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.setState({dodStatus: dodStatus});
      }
    });
  }

  private loadOrg() {
   this.loadSection();
   this.loadDodStatus();
    OrganizationApiController.findOrganizationById(this.props.auth.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      }
      if (org !== null) {
        this.setState({
          org,
        })
      }
    });
  }

  private loadSection() {
    OrganizationApiController.getOrgSections(this.props.auth.accessToken, this.props.orgId, (section, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.setState({orgSection: section})
      }
    });
  }

  private onClickRevokeUser(userId: string) {
    if (this.state.org === undefined)
      return;
    OrganizationApiController.revokeUser(this.props.auth.accessToken, this.props.orgId, {
      memberId: userId,
    }, (org, error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(org);
      }
    });
  }

  private onClickInviteUser() {
    if (this.state.org === undefined)
      return;
    if ((this.state.org.owner as User).email === this.state.newUserInput.value) {
      return this.setState({
        newUserInput: {
          value: '',
          error: `Vous êtes deja dans l'organisation !`
        }
      })
    } else if ((this.state.org.members as User[]).some((member) => member.email === this.state.newUserInput.value)) {
      return this.setState({
        newUserInput: {
          value: '',
          error: `L'utilisateur est deja présent dans l'organisation`
        }
      })
    }
    OrganizationApiController.inviteUser(this.props.auth.accessToken, this.props.orgId, {
      memberEmail: this.state.newUserInput.value
    }, (org, error) => {
      if (error) {
        this.setState({
          newUserInput: {
            value: '',
            error: error.message as string,
          }
        })
      }
    });
  }

  private isOwner(): boolean {
    return this.state.org?.owner ._id === this.props.auth.user?._id;
  }

  private showTransfer() {
    return (
      <Tile style={{padding: '18px'}}>
        <Stack gap={6}>
          <div>
            <p>Vous pouvez transférer vos droits a l'un des utilisateurs de cette organisation.</p>
            <p>Attention, cette opération ne peux être annuler une fois lancer</p>
            <br/>
            <p style={{fontWeight: 'bold'}}>Attention, cette opération est irreversible.</p>
          </div>
          <Button disabled={!this.isOwner()} onClick={() => this.setState({openMigrate: true})} kind={'danger'} renderIcon={Migrate} iconDescription={"migrate"}>
            Transférer
          </Button>
        </Stack>
      </Tile>
    )
  }

  private showDelete() {
    return (
      <Tile style={{padding: '18px'}}>
        <Stack gap={6}>
          <div>
            <p>Tout les utilisateurs encore présents dans l'organisation ne pourront plus récupérer des éléments une fois l'organisation supprimer, elle n'apparaitra plus dans leurs organisations active.</p>
            <p>Les éléments suivants seront supprimer : <br/> <span>Plds, Dods, Calendriers, Workspace, Document et toute information liée a cette Organisation .</span></p>
            <br/>
            <p style={{fontWeight: 'bold'}}>Attention, cette opération est irreversible.</p>
          </div>
          <Button disabled={!this.isOwner()} onClick={() => this.setState({openDelete: true})} kind={'danger'} renderIcon={Fire} iconDescription={"delete"}>
            Supprimer
          </Button>
        </Stack>
      </Tile>
    )
  }

  private showParameters() {
    if (this.state.org === undefined)
      return;
    return (
      <Tile style={{padding: '18px'}}>
        <Stack gap={2}>
            <Table style={{marginTop: '20px', marginBottom: '20px'}} >
              <TableHead>
                <TableRow>
                  <TableHeader id={"members-email"} key={"memail"}>
                    Email
                  </TableHeader>
                  <TableHeader id={"members-names"} key={"mnames"}>
                    Nom, Prénom
                  </TableHeader>
                  <TableHeader id={"members-domain"} key={"mdomain"}>
                    Secteur(s)
                  </TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...this.state.org.members, this.state.org.owner].map((user, key) => (
                  <TableRow key={key}>
                    <TableCell key={key + ":email"}>{user.email} {this.state.org?.owner._id === user._id ? '👑' : null}</TableCell>
                    <TableCell key={key + ":names"}>{user.firstname} {user.lastname?.toUpperCase()}</TableCell>
                    <TableCell key={key + ":origin"}>{user.domain?.join(', ')}</TableCell>
                    <TableCell key={key + ":actions"}>
                      {this.isOwner() ? <Button hasIconOnly renderIcon={TrashCan} iconDescription={"Supprimer l'utilisateur"} kind={'ghost'} onClick={() => this.onClickRevokeUser(user._id)}/> : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TextInput
              disabled={!this.isOwner()}
              helperText={!this.isOwner() ? "Seulement le créateur peut ajouter des utilisateurs dans l'organisation !" : null}
              id={"org-invite-user"} labelText={"Ajouter un utilisateur à l'organisation"} onChange={(e) => {
              this.setState({
                newUserInput: {
                  value: e.currentTarget.value,
                }
              })
            }}
              invalid={this.state.newUserInput.error !== undefined}
              invalidText={this.state.newUserInput.error}
            />
          <Button style={{marginTop: '20px'}} renderIcon={Add} iconDescription={"Ajouter"} onClick={this.onClickInviteUser}>Ajouter un utilisateur</Button>
          </Stack>
      </Tile>
    )
  }

  private showSections() {
    return (
      <Tile>
        <p>Une section correspond a la catégorie ou vos DoDs seront rangées.</p>
        <p>par example: La Section '2.6 Map' correspond au parent de toutes les DoDs 2.6.x</p>
        <p style={{fontStyle: 'italic'}}>Vous avez la possibilité de changer en temps réel le nom des section depuis la page de votre Pld</p>
        <DataTable rows={this.state.orgSection.map((s) => ({...s, id: s._id})).sort((a, b) => {
          if (b.section > a.section)
            return (-1);
          return 1;
        })} headers={sectionHeaderData} isSortable locale={"fr"}>
          {({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getSelectionProps,
              getBatchActionProps,
              onInputChange,
              selectedRows,
            }) => (
            <TableContainer>
              <TableToolbar size={"lg"}>
                <TableToolbarContent>
                  <Button
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onClick={() => {this.setState({openSection: true})}}
                    renderIcon={Add}
                    iconDescription={"Add"}
                    size="sm"
                    kind="primary"
                  >Créer une section</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader style={{whiteSpace: 'nowrap'}} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow {...getRowProps({ row })} key={index}>
                      {row.cells.map((cell) => {
                        return (<TableCell onClick={() => this.setState({selectedSection: this.state.orgSection.find((a) => a._id === row.id), openUpdateSection: true})} key={cell.id}>{cell.value}</TableCell>)
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Tile>
    )
  }

  private showModal() {
    if (this.state.org === undefined)
      return;
    return (
      <>
        <NewOrgDodColorModal
          open={this.state.openDodColor}
          org={this.state.org}
          userContext={this.props.auth}
          onSuccess={() => {this.setState({openDodColor: false})}}
          onDismiss={() => {this.setState({ openDodColor: false})}}/>
        <CreateOrgSectionModal userContext={this.props.auth} org={this.state.org} open={this.state.openSection} onDismiss={() => this.setState({openSection: false})} onSuccess={() => {
          this.setState({openSection: false});
          this.loadOrg();
        }}/>
        <DeleteOrgModal org={this.state.org} open={this.state.openDelete} onSuccess={() => {
          this.setState({openDelete: false});
          this.props.navigate('/');
        }} onClose={() => this.setState({openDelete: false})} userContext={this.props.auth}/>
        <MigrateOrgModal org={this.state.org} open={this.state.openMigrate} onSuccess={() => {
          this.setState({openMigrate: false});
        }} onClose={() => this.setState({openMigrate: false})} userContext={this.props.auth}/>
        {this.showSectionModals()}
      </>
    )
  }

  private showSectionModals() {
    if (this.state.selectedSection === undefined || this.state.org === undefined)
      return;
    console.log(this.state.selectedSection);
    return (
      <>
        <UpdateOrgSectionModal open={this.state.openUpdateSection} onDismiss={() => this.setState({openUpdateSection: false})} onSuccess={() => {
          toast('Section éditer avec succés !', {type: 'success'});
          this.setState({openUpdateSection: false, selectedSection: undefined});
        }} org={this.state.org} section={this.state.selectedSection} userContext={this.props.auth}/>
        <DeleteOrgSectionModal open={this.state.openDeleteSection} onDismiss={() => this.setState({openDeleteSection: false})} onSuccess={() => {
          toast('Section supprimer avec succés !', {type: 'success'});
          this.setState({openDeleteSection: false});
        }} org={this.state.org} section={this.state.selectedSection} userContext={this.props.auth}/>
      </>
    )
  }

  private showOrg() {
    if (this.state.org === undefined)
      return;
    return (
      <Stack gap={6}>
        <h2>Statuts</h2>
        <ManageOrgDodStatusComponent org={this.state.org} userContext={this.props.auth} dodStatus={this.state.dodStatus} onStatusChanged={() => this.loadDodStatus()}/>
        <h2>Sections des DoDs</h2>
        {this.showSections()}
        <h2>Membres</h2>
        {this.showParameters()}
        <h2>Transférer l'organisation</h2>
        {this.showTransfer()}
        <h2>Supprimer l'organisation</h2>
        {this.showDelete()}
      </Stack>
    )
  }

  override render() {
    return (
      <>
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.props.navigate('/')}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => {this.props.navigate(`/organization/${this.props.orgId}`);}}>Organisation</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Manage</BreadcrumbItem>
        </Breadcrumb>
        {this.showModal()}
        {this.showOrg()}
      </>
    );
  }

}

export default withNav(ManageOrganizationComponent);
