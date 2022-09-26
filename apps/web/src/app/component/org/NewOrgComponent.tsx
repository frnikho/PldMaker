import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column,
  FluidForm,
  Grid, InlineLoading,
  NumberInput, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow,
  StructuredListWrapper,
  TextArea,
  TextInput, Tile
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add, Subtract} from '@carbon/icons-react';
import {Organization, CreateOrganizationBody} from "@pld/shared";
import {CircularProgress} from "../utils/CircularProgress";
import {UserApiController} from "../../controller/UserApiController";
import {HelpLabel, RequiredLabel} from "../../util/Label";
import {FieldData} from "../../util/FieldData";
import {validate} from "class-validator";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export type NewOrgComponentProps = {
  onOrgCreated: (org: Organization) => void;
} & RequiredUserContextProps

export type NewOrgComponentState = {
  invitedUser: InvitedUser[],
  searchUserInputText: string,
  loadingAddingUser: boolean,
  loadingCreation: boolean,
  name: FieldData<string>,
  description: FieldData<string>,
  versionShifting: FieldData<number>,
  error: FieldError,
  redirectUrl?: string;
  errors: Error;
};

type Error = {
  [key: string]: string;
}

export type FieldError = {
  name?: string,
  description?: string,
  versionShifting?: string,
  searchUserInputText?: string,
}

export type InvitedUser = {
  _id: string,
  email: string,
}

export class NewOrgComponent extends React.Component<NewOrgComponentProps, NewOrgComponentState> {

  constructor(props: NewOrgComponentProps) {
    super(props);
    this.state = {
      errors: {},
      invitedUser: [],
      searchUserInputText: '',
      loadingAddingUser: false,
      loadingCreation: false,
      name: {
        value: ''
      },
      description: {
        value: ''
      },
      versionShifting: {
        value: 1.0
      },
      error: {

      }
    }
    this.onClickCreateOrg = this.onClickCreateOrg.bind(this);
    this.onClickAddUser = this.onClickAddUser.bind(this);
    this.onClickRemoveUser = this.onClickRemoveUser.bind(this);
  }

  private onClickRemoveUser(user: InvitedUser) {
    this.state.invitedUser.splice(this.state.invitedUser.findIndex((invUser) => invUser._id === user._id), 1);
    this.setState({invitedUser: this.state.invitedUser});
  }

  private onClickAddUser() {
    if (this.props.userContext.accessToken === undefined)
      return;
    if (this.state.invitedUser.filter((user) => user.email === this.state.searchUserInputText).length > 0) {
      return this.setState({error: {searchUserInputText: "l'utilisateur est déja dans la liste"}})
    }
    if (this.state.searchUserInputText === this.props.userContext.user?.email) {
      return this.setState({error: {searchUserInputText: "vous ne pouvez vous ajoutez vous mêmes aux members"}});
    }
    this.setState({
      loadingAddingUser: true
    });

    UserApiController.findUserByEmail(this.props.userContext.accessToken, this.state.searchUserInputText, (user, error) => {
      if (user !== null && !error) {
        this.state.invitedUser.push({
          _id: user._id,
          email: user.email,
        })
        this.setState({
          invitedUser: this.state.invitedUser,
          error: {
            searchUserInputText: undefined
          }
        })
      } else {
        this.setState({
          error: {searchUserInputText: error?.error}
        })
      }
      this.setState({
        loadingAddingUser: false,
      })
    });

  }

  private onClickCreateOrg() {
    this.setState({
      loadingCreation: true,
    });
    const body: CreateOrganizationBody = new CreateOrganizationBody(
      this.state.name.value,
      this.state.description.value,
      this.state.versionShifting.value,
      this.state.invitedUser.map((user) => user._id),
    );
    validate(body).then((errors) => {
      const error: Error = {};
      errors.map((a) => {
        error[a.property] = Object.values(a.constraints ?? []).join(', ');
      })
      this.setState({error});
      if (errors.length === 0) {
        OrganizationApiController.createUserOrganizations(this.props.userContext.accessToken, {
          name: this.state.name.value,
          description: this.state.description.value,
          versionShifting: this.state.versionShifting.value,
          invitedMembers: this.state.invitedUser.map((user) => user._id),
        }, (org, error) => {
          this.setState({
            loadingCreation: false,
          });
          if (org !== null && error === undefined) {
            toast('Votre organisation a été créée', {type: 'error'});
            this.props.onOrgCreated(org);
          } else {
            console.log(error);
          }
        });
      } else {
        this.setState({loadingCreation: false});
      }
    });
  }

  private showInvitedUser() {
    return (
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head tabIndex={0}>
            <StructuredListCell head>
              Email
            </StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {this.state.invitedUser.map((user, index) => {
            return (<StructuredListRow key={index} tabIndex={0} style={{margin: 'auto'}}>
              <StructuredListCell style={{margin: 'auto'}}>
                {user.email}
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  size={"sm"}
                  kind={"tertiary"}
                  onClick={() => this.onClickRemoveUser(user)}
                  renderIcon={Subtract}
                  iconDescription="Retirer l'utilisateur"
                  hasIconOnly/>
              </StructuredListCell>
            </StructuredListRow>)
          })}
        </StructuredListBody>
      </StructuredListWrapper>
    );
  }

  override render() {
    return (
      <>
        {this.state.redirectUrl ? <Navigate to={this.state.redirectUrl}/> : null}
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: '/'})}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Organisation</BreadcrumbItem>
        </Breadcrumb>
        <h1 style={{fontWeight: 'bold'}}>Créer votre organisation</h1>
        <p style={{fontSize: 14, marginTop: 10}}>Une organization vous permets de créer, de gérer et de générer les documents de vos PLDs en équipe</p>
        <p style={{fontSize: 14}}>Après la création de votre organisation, vous pourrez gérer les paramètres liés a la confidentialité</p>
        <Grid style={{marginTop: 20}}>
          <Column sm={4} md={8} lg={10} xlg={10}>
            <Stack gap={3}>
              <RequiredLabel message={"Nom"}/>
              <TextInput helperText={"le nom doit contenir au minimum 5 caractères et 64 au maximum"} maxLength={64} minLength={5} id={"new-org-name"} labelText={false} invalid={this.state.error['name'] !== undefined} invalidText={this.state.error['name']} required onChange={(event) => this.setState({name: {value: event.currentTarget.value}})}/>
              <TextArea helperText={"la description ne doit pas dépasser 512 caractères"} maxLength={512} rows={4} id={"new-org-desc"} invalid={this.state.error['description'] !== undefined} invalidText={this.state.error['description']} labelText={"Description"} onChange={(event) => this.setState({description: {value: event.currentTarget.value}})}/>
              <RequiredLabel message={"Versioning"}/>
              <NumberInput helperText={"minimum 0.01 et au maximum 2.00"} iconDescription={"step de 0.1"} id={"new-org-versionShifting"} invalid={this.state.error['versionShifting'] !== undefined} invalidText={this.state.error['versionShifting']} value={this.state.versionShifting.value} max={2.0} min={0.01} step={0.1} onChange={(e, {value}) => {this.setState({versionShifting: {value: parseFloat(value)}});}}/>
              <HelpLabel message={'Le versioning correspond aux gap de la monté de version lors de chaque mise à jour de votre pld'}/>
            </Stack>
          </Column>
          <Column sm={4} md={8} lg={5} xlg={6}>
            <Tile style={{padding: 10}}>
              <h4>Ajouter des utilisateurs dans votre organization</h4>
              <p style={{fontStyle: 'italic'}}>vous pouvez dés maintenant inviter des utilisateurs a intégrer votre organisation dés la création de celle-ci</p>
              <FluidForm style={{marginTop: '20px'}}>
                <Grid narrow>
                  <Column sm={3} md={7} lg={4} style={{paddingRight: 20, paddingLeft: 20}}>
                    <TextInput
                      invalid={this.state.error.searchUserInputText !== undefined}
                      invalidText={this.state.error.searchUserInputText}
                      id="af" type="text" labelText="Adresse email de l'utilisateur" onChange={(e) => {this.setState({searchUserInputText: e.currentTarget.value})}}/>
                  </Column>
                  <Column lg={1} style={{margin: 'auto'}}>
                    <Button
                      size={"lg"}
                      kind={"primary"}
                      disabled={this.state.loadingAddingUser}
                      onClick={this.onClickAddUser}
                      renderIcon={this.state.loadingAddingUser ? CircularProgress : Add}
                      iconDescription="Add user"
                      hasIconOnly/>
                  </Column>
                </Grid>
                {this.showInvitedUser()}
              </FluidForm>
            </Tile>
          </Column>
        </Grid>
        <Button renderIcon={Add} iconDescription={"Create"} style={{marginTop: '20px'}} onClick={this.onClickCreateOrg} disabled={this.state.loadingCreation || this.state.loadingAddingUser}>
          {this.state.loadingCreation ? <InlineLoading description={"Chargement..."}/> : "Créer l'organisation"}
        </Button>
      </>
    );
  }

}
