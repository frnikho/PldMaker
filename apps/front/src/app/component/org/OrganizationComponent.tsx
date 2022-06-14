import React from "react";
import {DodColor, Organization} from "../../../../../../libs/data-access/organization/Organization";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {RequiredUserContextProps} from "../../context/UserContext";
import {ApiError} from "../../util/Api";
import {
  Accordion, AccordionItem,
  Button,
  ClickableTile,
  Column,
  Grid,
  SkeletonPlaceholder,
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow, TextInput,
  Tile
} from "carbon-components-react";

import {Stack} from '@carbon/react'

import {Add, TrashCan} from '@carbon/icons-react'
import {redirectNavigation} from "../../util/Navigation";
import {PageState} from "../../util/Page";
import {PldApiController} from "../../controller/PldApiController";
import {Pld} from "../../../../../../libs/data-access/pld/Pld";
import {FieldData} from "../../util/FieldData";
import {User} from "../../../../../../libs/data-access/user/User";
import Block from "@uiw/react-color-block";
import {SocketContext} from "../../context/SocketContext";
import {toast} from "react-toastify";

export type OrganizationComponentProps = {
  orgId?: string;
  onError: (error: ApiError) => void;
} & RequiredUserContextProps;

export type OrganizationComponentState = {
  org?: Organization;
  pld: FieldData<Pld[]>;
  newUserInput: FieldData<string>;
} & PageState;

export class OrganizationComponent extends React.Component<OrganizationComponentProps, OrganizationComponentState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props: OrganizationComponentProps) {
    super(props);
    this.state = {
      org: undefined,
      loading: false,
      navigateUrl: undefined,
      pld: {
        value: [],
        loading: true,
      },
      newUserInput: {
        value: '',
        error: undefined
      },
    }
    this.onClickCreateDocument = this.onClickCreateDocument.bind(this);
    this.onClickCreatePld = this.onClickCreatePld.bind(this);
    this.onClickCreateTemplate = this.onClickCreateTemplate.bind(this);
    this.onClickInviteUser = this.onClickInviteUser.bind(this);
    this.onClickRevokeUser = this.onClickRevokeUser.bind(this);
    this.onUpdateDodColor = this.onUpdateDodColor.bind(this);
  }

  private registerListeners() {
    const socket = this.context;
    socket.on('Org:Update', ({orgId}: { orgId: string }) => {
      if (this.props.orgId === orgId) {
        this.loadOrg();
      }
    });
  }

  override componentDidMount() {
    this.loadOrg();
    this.registerListeners();

  }

  private loadOrg() {
    if (this.props.orgId === undefined)
      return;
    OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        return this.props.onError(error);
      }
      if (org !== null) {
        this.setState({
          org: org
        });
        this.loadPld(org._id);
      }
    });
  }

  private loadPld(orgId: string) {
    PldApiController.findOrgPld(this.props.userContext.accessToken, orgId, (pld, error) => {
      if (!error) {
        this.setState({
          pld: {
            loading: false,
            value: pld
          }
        })
      }
    });
  }

  private onClickCreatePld() {
    this.setState({
      navigateUrl: 'pld/new'
    })
  }

  private onClickCreateDocument() {
    return null;
  }

  private onClickCreateTemplate() {
    return null;
  }

  private onClickRevokeUser(userId: string) {
    if (this.state.org === undefined)
      return;
    OrganizationApiController.revokeUser(this.props.userContext.accessToken, {
      orgId: this.state.org?._id ?? '',
      membersId: [userId]
    }, (org, error) => {
      if (error) {
        console.log(error);
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
    OrganizationApiController.inviteUser(this.props.userContext.accessToken, {
      orgId: this.state.org?._id ?? '',
      memberEmail: this.state.newUserInput.value
    }, (org, error) => {
      if (error) {
        this.setState({
          newUserInput: {
            value: '',
            error: error['message'][0],
          }
        })
      }
    });
  }

  private showPld() {
    if (this.state.pld.loading) {
      return (
        <SkeletonPlaceholder/>
      )
    }
    return (
      <Grid>
        {this.state.pld.value.map((pld, index) => {
          return (
            <Column key={index} sm={4} md={8} lg={4}>
              <ClickableTile onClick={() => {this.setState({navigateUrl: `pld/${pld._id}`})}}>
                {pld.title}
              </ClickableTile>
            </Column>
          )
        })}
      </Grid>
    )
  }

  private showParameters() {
    if (this.state.org === undefined)
      return;
    return (
      <div style={{padding: '8px'}}>
        <Tile>
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
                    <Button hasIconOnly renderIcon={TrashCan} iconDescription={"Supprimer l'utilisateur"} kind={'ghost'} onClick={() => this.onClickRevokeUser(user._id)}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TextInput id={"org-invite-user"} labelText={"Ajouter un utilisateur à l'organisation"} onChange={(e) => {
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
      </div>
    )
  }

  private onUpdateDodColor() {
    if (this.state.org === undefined)
      return;
    OrganizationApiController.updateOrg(this.props.userContext.accessToken, {
      orgId: this.state.org._id,
      dodColors: this.state.org.dodColors,
    }, (org, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      }
    })
  }

  private showPreferences() {
    if (this.state.org === undefined)
      return;
    return (
      <>
        <Grid style={{padding: '8px'}}>
          {this.state.org.dodColors?.map((dodColor, index) => {
            return (
              <Column lg={4} md={3} sm={3} key={index}>
                <Tile style={{marginTop: '20px', textAlign: 'center'}}>
                  <Stack orientation={"horizontal"} gap={3}>
                    <h4 style={{margin: 'auto'}}>{dodColor.name}</h4>
                    <Button hasIconOnly kind={"ghost"} iconDescription={"Supprimer"} renderIcon={TrashCan} />
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
      </>
    )
  }

  override render() {
    return (
      <Stack gap={3}>
        {redirectNavigation(this.state.navigateUrl)}
        <h2>Pld <Button kind={"ghost"} onClick={this.onClickCreatePld} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
        {this.showPld()}
        <h2>Templates <Button kind={"ghost"} onClick={this.onClickCreateTemplate} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
        <h2>Documents <Button kind={"ghost"} onClick={this.onClickCreateDocument} hasIconOnly renderIcon={Add} iconDescription={"Créer/Ajouter un document"}/></h2>
        <h2>Préférences</h2>
        {this.showPreferences()}
        <h2>Paramètres</h2>
        {this.showParameters()}
      </Stack>
    );
  }
}
