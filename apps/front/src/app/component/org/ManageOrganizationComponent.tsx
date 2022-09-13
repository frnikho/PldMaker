import React from "react";
import {UserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import { Organization, OrganizationSection, User } from "@pld/shared";
import {toast} from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column,
  Grid,
  Table, TableBatchAction, TableBatchActions,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableHeader,
  TableRow, TableSelectAll, TableSelectRow, TableToolbar, TableToolbarContent, TableToolbarMenu, TableToolbarSearch, TextInput,
  Tile
} from "carbon-components-react";
import Block from "@uiw/react-color-block";

import {DataTable} from '@carbon/react';

import {TrashCan, Add} from '@carbon/icons-react'

import {Stack} from '@carbon/react';
import {FieldData} from "../../util/FieldData";
import {NavProps, withNav} from "../../util/Navigation";
import {NewOrgDodColorModal} from "../../modal/org/NewOrgDodColorModal";
import {SocketContext} from "../../context/SocketContext";
import { CreateOrgSectionModal } from "../../modal/org/CreateOrgSectionModal";

export const headerData = [
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
  orgSection: OrganizationSection[];
  newUserInput: FieldData<string>;
  openDodColor: boolean;
  openSection: boolean;
}

class ManageOrganizationComponent extends React.Component<ManageOrgProps, ManageOrgState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props) {
    super(props);
    this.state = {
      orgSection: [],
      openDodColor: false,
      openSection: false,
      org: undefined,
      newUserInput: {
        value: '',
        error: undefined
      },
    }
    this.onUpdateDodColor = this.onUpdateDodColor.bind(this);
    this.onClickInviteUser = this.onClickInviteUser.bind(this);
    this.onClickRevokeUser = this.onClickRevokeUser.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
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

  private loadOrg() {
    OrganizationApiController.getOrgSections(this.props.auth.accessToken, this.props.orgId, (section, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.setState({orgSection: section})
      }
    });
    OrganizationApiController.findOrganizationById(this.props.auth.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      }
      if (org !== null) {
        console.log(org);
        this.setState({
          org,
        })
      }
    });
  }

  private onUpdateDodColor() {
    if (this.state.org === undefined)
      return;
    OrganizationApiController.updateOrg(this.props.auth.accessToken, {
      orgId: this.state.org._id,
      dodColors: this.state.org.dodColors,
    }, (org, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      }
    })
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
        console.log(error.message);
        this.setState({
          newUserInput: {
            value: '',
            error: error.message as string,
          }
        })
      }
    });
  }

  private onClickDelete(index: number) {
    this.state.org?.dodColors.splice(index, 1);
    this.onUpdateDodColor();
  }

  private isOwner(): boolean {
    console.log(this.state.org?.owner);
    console.log(this.props.auth.user?._id);
    console.log(this.props.auth.user?._id === this.state.org?.owner);
    return this.state.org?.owner ._id === this.props.auth.user?._id;
  }

  private showParameters() {
    if (this.state.org === undefined)
      return;
    return (
      <Tile style={{padding: '18px'}}>
        <h4>Créateur / Manager</h4>
        <Table style={{marginTop: '20px', marginBottom: '20px'}} >
          <TableHead>
            <TableRow>
              <TableHeader id={"hd-email"} key={"hda-email"}>Email</TableHeader>
              <TableHeader id={"hd-names"} key={"hda-names"}>Nom, Prénom</TableHeader>
              <TableHeader id={"hd-secteurs"} key={"hda-secteurs"}>Secteurs</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={"owner"}>
              <TableCell key={"owner-email"}>{this.state.org.owner.email}</TableCell>
              <TableCell key={"owner-names"}>{this.state.org.owner.lastname?.toUpperCase() ?? '' + this.state.org.owner.firstname}</TableCell>
              <TableCell key={"owner-secteur"}>{this.state.org.owner.domain?.join(', ')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h4>Membres</h4>
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
            {this.state.org.members.map((user, key) => (
              <TableRow key={key}>
                <TableCell key={key + ":email"}>{user.email}</TableCell>
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
        <Button style={{marginTop: '20px'}} hasIconOnly renderIcon={Add} iconDescription={"Ajouter"} onClick={this.onClickInviteUser}/>
      </Tile>
    )
  }

  private showSections() {
    return (
      <Tile>
        <DataTable rows={this.state.orgSection} headers={headerData} isSortable locale={"fr"}>
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
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                    renderIcon={TrashCan}
                    onClick={() => {
                      console.log('abc');
                    }}
                  >
                    Supprimer
                  </TableBatchAction>
                  <TableBatchAction
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                    onClick={() => {
                      console.log('abcde');
                    }}
                  >
                    Générer un docx
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch
                    placeholder={"1.1, 2.1..."}
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />
                  <TableToolbarMenu
                    iconDescription={"Filter"}
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  >
                  </TableToolbarMenu>
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
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header) => (
                      <TableHeader style={{whiteSpace: 'nowrap'}} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row.cells.map((cell) => {
                        return (<TableCell key={cell.id}>{cell.value}</TableCell>)
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

  private showPreferences() {
    if (this.state.org === undefined)
      return;
    return (
      <Grid style={{padding: '18px'}}>
        {this.state.org.dodColors?.map((dodColor, index) => {
          return (
            <Column lg={4} md={3} sm={3} key={index}>
              <Tile style={{marginTop: '0px', textAlign: 'center'}}>
                <Stack orientation={"horizontal"} gap={3}>
                  <h4 style={{margin: 'auto'}}>{dodColor.name}</h4>
                  <Button hasIconOnly kind={"ghost"} iconDescription={"Supprimer"} renderIcon={TrashCan} onClick={() => this.onClickDelete(index)}/>
                </Stack>
                <Block
                  style={{margin: 'auto', marginTop: '20px'}}
                  color={`#${dodColor.color}`}
                  title={"abc"}
                  onChange={(color) => {
                    if (this.state.org === undefined)
                      return;
                    const selectDodColor = this.state.org.dodColors.find((dc) => dc.name === dodColor.name);
                    if (selectDodColor === undefined)
                      return;
                    selectDodColor.color = color.hex.slice(1, 7);
                    this.setState({
                      org: {
                        ...this.state.org,
                      }
                    })
                    this.onUpdateDodColor();
                  }}
                />
              </Tile>
            </Column>
          )
        })}
      </Grid>
    )
  }

  private showModal() {
    if (this.state.org === undefined)
      return;
    return (
      <>
        <NewOrgDodColorModal
          open={this.state.openDodColor}
          onSuccess={(...args: unknown[]) => {
            this.state.org?.dodColors.push({
              name: args[0] as string,
              color: args[1] as string,
            })
            this.setState({
              openDodColor: false,
            });
            this.onUpdateDodColor();
          }}
          onDismiss={() => {
            this.setState({
              openDodColor: false,
            })
          }}/>
        <CreateOrgSectionModal userContext={this.props.auth} org={this.state.org} open={this.state.openSection} onDismiss={() => this.setState({openSection: false})} onSuccess={() => {
          this.setState({openSection: false});
          this.loadOrg();
        }}/>
      </>
    )
  }

  private showOrg() {
    if (this.state.org === undefined)
      return;

    return (
      <Stack gap={6}>
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.props.navigate('/')}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => {
            this.props.navigate(`/organization/${this.props.orgId}`);
          }}>{this.state.org?.name ?? "Organisation"}</BreadcrumbItem>
          <BreadcrumbItem onClick={() => null} isCurrentPage>Manage</BreadcrumbItem>
        </Breadcrumb>
        <h2>Préférences</h2>
        <Tile style={{padding: '18px'}}>
          <Stack orientation={"horizontal"}>
            <h4 style={{margin: 'auto'}}>États des dods</h4>
            <Button hasIconOnly iconDescription={"Nouveau"} renderIcon={Add} kind={"ghost"} onClick={() => this.setState({
              openDodColor: true
            })}/>
          </Stack>
          {this.showPreferences()}
        </Tile>
        <h2>Sections des DoDs</h2>
        {this.showSections()}
        <h2>Paramètres</h2>
        {this.showParameters()}
      </Stack>
    )
  }

  override render() {
    return (
      <>
        {this.showModal()}
        {this.showOrg()}
      </>
    );
  }

}

export default withNav(ManageOrganizationComponent);
