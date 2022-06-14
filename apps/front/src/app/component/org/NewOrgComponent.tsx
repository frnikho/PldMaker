import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Button,
  Column,
  FluidForm,
  Grid, InlineLoading,
  Loading,
  NumberInput, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow,
  StructuredListWrapper,
  TextArea,
  TextInput
} from "carbon-components-react";

import {Add, Subtract} from '@carbon/icons-react';
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {CircularProgress} from "../utils/CircularProgress";
import {UserApiController} from "../../controller/UserApiController";

export type NewOrgComponentProps = {
  onOrgCreated: (org: Organization) => void;
} & RequiredUserContextProps

export type NewOrgComponentState = {
  invitedUser: InvitedUser[],
  searchUserInputText: string,
  loadingAddingUser: boolean,
  loadingCreation: boolean,
  name: string,
  description: string,
  versionShifting: number,
  error: FieldError,
};

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
      invitedUser: [],
      searchUserInputText: '',
      loadingAddingUser: false,
      loadingCreation: false,
      name: '',
      description: '',
      versionShifting: 1.0,
      error: {

      }
    }
    this.onClickCreateOrg = this.onClickCreateOrg.bind(this);
    this.onClickAddUser = this.onClickAddUser.bind(this);
    this.onClickRemoveUser = this.onClickRemoveUser.bind(this);
  }

  private onClickRemoveUser(user: InvitedUser, index: number) {
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
      setTimeout(() => {
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
      }, 1000);
    });

  }

  private onClickCreateOrg() {
    if (!this.props.userContext?.accessToken)
      return;
    this.setState({
      loadingCreation: true,
    });
    OrganizationApiController.createUserOrganizations(this.props.userContext.accessToken, {
      name: this.state.name,
      description: this.state.description,
      versionShifting: this.state.versionShifting,
      invitedMembers: this.state.invitedUser.map((user) => user._id),
    }, (org, error) => {
      this.setState({
        loadingCreation: false,
      });
      if (org !== null && error === undefined) {
        this.props.onOrgCreated(org);
      } else {
        //TODO error
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
                  onClick={() => this.onClickRemoveUser(user, index)}
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
        <>
          <h1>Créer votre organisation</h1>
          <Grid>
            <Column sm={4} md={8} lg={10} xlg={10}>
              <TextInput id={"new-org-name"} labelText={"nom de votre org"} required onChange={(event) => this.setState({name: event.currentTarget.value})}/>
              <TextArea rows={2} id={"new-org-desc"} labelText={"description de votre org"} onChange={(event) => this.setState({description: event.currentTarget.value})}/>
              <NumberInput iconDescription={"step de 0.1"} id={"new-org-versionShifting"} value={1.0} max={2.0} min={0.1} step={0.1} label={"versioning de votre org"} onChange={(e) => {this.setState({versionShifting: parseFloat(e.imaginaryTarget.value)});}}/>
            </Column>
            <Column sm={0} md={0} lg={1} xlg={1}>
            </Column>
            <Column sm={4} md={8} lg={5} xlg={5}>
              <h4>Ajouter des utilisateurs dans votre organization</h4>
              <p>vous pouvez dés maintenant inviter des utilisateurs a intégrer votre organisation dés la création de celle-ci</p>
              <FluidForm style={{marginTop: '20px'}}>
                <Grid narrow>
                  <Column sm={3} md={7} lg={4}>
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
            </Column>
          </Grid>
          <Button style={{marginTop: '20px'}} onClick={this.onClickCreateOrg} disabled={this.state.loadingCreation || this.state.loadingAddingUser}>
            {this.state.loadingCreation ? <InlineLoading description={"Chargement..."}/> : "Créer l'organisation"}
          </Button>
        </>
      </>
    );
  }

}
