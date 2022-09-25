import React from "react";
import { RequiredUserContextProps } from "../context/UserContext";
import { Button, Column, FormLabel, Grid, MultiSelect, Select, SelectItem, TextInput, Tile } from "carbon-components-react";
import { FieldData } from "../util/FieldData";
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";
import { formatLongDate, Timezone } from "@pld/utils";

import { Renew, TrashCan } from "@carbon/icons-react";

import { Stack } from "@carbon/react";
import { MfaModal } from "../modal/auth/MfaModal";
import { Mfa, MfaType, Organization, User, UserDomain } from "@pld/shared";
import { OrganizationApiController } from "../controller/OrganizationApiController";
import { DisableOtpModal } from "../modal/auth/DisableOtpModal";
import { LanguageProps } from "../context/LanguageContext";
import { DeleteUserModal } from "../modal/DeleteUserModal";
import { SERVER_URL_ASSETS } from "../util/User";
import { HelpLabel } from "../util/Label";
import { UploadUserPictureModal } from "../modal/UploadUserPictureModal";

export type UserComponentProps = RequiredUserContextProps & LanguageProps;

export type UserComponentState = {
  firstname: FieldData<string>;
  lastname: FieldData<string>;
  domain: FieldData<string[]>;
  timezone: FieldData<string>;
  openEnableOtp: boolean;
  openDisableOtp: boolean;
  openDeleteModal: boolean;
  openFileUpload: boolean;
  mfa: Mfa[];
  org: Organization[];
}

export class UserComponent extends React.Component<UserComponentProps, UserComponentState> {


  constructor(props) {
    super(props);
    this.state = {
      org: [],
      mfa: [],
      firstname: {
        value: ''
      },
      lastname: {
        value: '',
      },
      domain: {
        value: [],
      },
      timezone: {
        value: '',
      },
      openEnableOtp: false,
      openDisableOtp: false,
      openDeleteModal: false,
      openFileUpload: false,
    }
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onMfaEnable = this.onMfaEnable.bind(this);
    this.onMfaDisable = this.onMfaDisable.bind(this);
    this.onDeleted = this.onDeleted.bind(this);
    this.onUploadedPicture = this.onUploadedPicture.bind(this);
  }

  override componentDidMount() {
    this.loadInfo();
  }

  private loadInfo() {
    if (this.props.userContext.user?.firstname === undefined || this.props.userContext.user?.lastname === undefined || this.props.userContext.user.domain === undefined)
      return;
    this.updateUserInfo(this.props.userContext.user);
    OrganizationApiController.getMeOrganizations(this.props.userContext.accessToken, (orgs, error) => {
      if (error) {
        toast(error.message, {type: 'error'})
      } else {
        this.setState({org: orgs,})
      }
    });
    this.getMfaInfo(this.props.userContext.accessToken);
  }

  private getMfaInfo(accessToken: string) {
    UserApiController.getMfa(accessToken, (mfa, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.setState({mfa: mfa});
      }
    });
  }

  private updateUserInfo(user: User) {
    this.setState({
      firstname: {
        value: user.firstname,
      },
      lastname: {
        value: user.lastname,
      },
      domain: {
        value: user.domain ?? [],
      },
      timezone: {
        value: user.timezone,
      }
    });
  }

  private onDeleted() {
    this.setState({openDeleteModal: false});
  }

  private onClickUpdate() {
    UserApiController.updateUser(this.props.userContext.accessToken, {
      firstname: this.state.firstname.value,
      lastname: this.state.lastname.value,
      domain: this.state.domain.value,
      timezone: Timezone[this.state.timezone.value]
    }, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
        console.error(error);
      }
      if (user !== null) {
        toast('Informations de votre profile mis a jour 👍', {type: 'success'});
        this.props.userContext.refreshUser((user, error) => {
          console.log(user, error);
          if (user !== null) {
            this.updateUserInfo(user);
          }
        });
      }
    });
  }

  private showMfaOtp() {
    const mfa = this.state.mfa.find((mfa) => mfa.type === MfaType.OTP && mfa.user._id === this.props.userContext.user?._id && mfa.verified);
    if (this.state.mfa.length === 0 || mfa === undefined) {
      return (
        <>
          <Tile>Vous n'avez pas activer l'OTP</Tile>
          <Button onClick={() => this.setState({openEnableOtp: true})}>Ajouter 2FA</Button>
        </>
      );
    } else {
      return (<>
        <Tile>OTP actif depuis: {formatLongDate(new Date(mfa.activationDate))}</Tile>
        <Button kind={"ghost"} onClick={() => this.setState({openDisableOtp: true})}>Désactiver MFA</Button>
      </>);
    }
  }

  private showSecurity() {
    return (
      <Tile>
        <Stack gap={4}>
          <h3 style={{marginBottom: 14}}>Sécurité</h3>
          <h4>2FA</h4>
          <p>
            La double authentification permet de renforcer la sécurité de vos comptes en exigeant un troisième élément d'identification, en plus de votre email et de votre mot de passe, pour valider chaque connexion.
            Pour le moment, seulement l'OTP est disponible pour la double authentification (One Time Password)
          </p>
          {this.showMfaOtp()}
        </Stack>
      </Tile>
    )
  }

  private showInfo() {
    return (
      <Tile>
        <h3 style={{marginBottom: '20px'}}>Mes informations</h3>
        <Grid>
          <Column xlg={6}>
            <TextInput id={"created-date-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Date de création"} value={formatLongDate(new Date(this.props.userContext.user?.created_date ?? ''))}/>
            <TextInput id={"updated-date-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Dernière mise a jour"} value={formatLongDate(new Date(this.props.userContext.user?.updated_date ?? ''))}/>
            <TextInput id={"email-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Email"} value={this.props.userContext.user?.email}/>
          </Column>
          <Column xlg={8}>
            <Stack orientation={"vertical"}>
              <FormLabel>Photo de profile</FormLabel>
              <img style={{padding: 12}} title={'Mettre à jour'} onClick={() => this.setState({openFileUpload: true})} width={225} src={SERVER_URL_ASSETS + this.props.userContext.user?.profile_picture} alt={""}/>
            </Stack>
          </Column>
        </Grid>
        <TextInput style={{marginBottom: '20px'}} id={"lastname-input"} labelText={"Nom"} value={this.state.lastname.value} onChange={(e) => {
          this.setState({
            lastname: {
              value: e.currentTarget.value
            }
          })
        }}/>
        <TextInput id={"firstname-input-disabled"} labelText={"Prénom"} value={this.state.firstname.value} onChange={(e) => {
          this.setState({
            firstname: {
              value: e.currentTarget.value
            }
          })
        }}/>
        <Select id={"timezone-input"} labelText={"Timezone"} onChange={(e) => this.setState({timezone: {value: e.currentTarget.value}})} value={this.state.timezone.value}>
          {Object.keys(Timezone).sort((a, b) => {
            if (a > b) {
              return 1;
            } else {
              return -1;
            }
          }).map((t, index) => {
            return (
              <SelectItem
                key={index}
                value={t}
                text={t}
              />
            )
          })}
        </Select>
      <MultiSelect
        label={this.state.domain.value.join(', ')}
        titleText={"Domaines d'application"}
        id="domain-list"
        invalid={this.state.domain.error !== undefined}
        selectedItems={this.state.domain.value.map((domain) => ({label: domain}))}
        invalidText={this.state.domain.error}
        items={Object.keys(UserDomain).map((d) => {
          return {
            label: d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
          }
        }).sort()}
        onChange={(e) => {
          this.setState({
            domain: {
              value: e.selectedItems.map((a) => a.label)
            }
          })
        }}
      />
      <Button style={{marginTop: '20px'}} onClick={this.onClickUpdate} iconDescription={"Update"} renderIcon={Renew}>Mettre a jour</Button>
    </Tile>
    )
  }

  private showOrgOwners(org: Organization[]) {
    return (
     <>
       <p>
         Votre compte est actuellement le dirigeant de ce(s) organisation(s) : <span style={{fontWeight: 'bold'}}>{org.map((a) => a.name).join(', ')} </span>
       </p>
       <p>
         Vous devez léger ou supprimer ces organizations afin de pouvoir supprimer votre compte.
       </p>
     </>
    )
  }

  private showDelete() {
    return (
      <>
        <p>Si vous supprimer votre compte, vous perdrez toute vos informations personnelles</p>
        <Button kind={'danger'} renderIcon={TrashCan} onClick={() => this.setState({openDeleteModal: true})}>Supprimer</Button>
      </>
    )
  }

  private showDangerZone() {
    const orgOwners = this.state.org.filter((org) => org.owner._id === this.props.userContext.user?._id);
    return (
      <Tile>
        <h3 style={{marginBottom: '20px'}}>⚠ Supprimer mon compte </h3>
        {orgOwners.length > 0 ? this.showOrgOwners(orgOwners) : this.showDelete()}
      </Tile>
    )
  }

  private onMfaEnable(token) {
    this.props.userContext.saveOtpToken(token, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        this.setState({openEnableOtp: false});
        toast('2FA Activé', {type: 'success'});
        this.getMfaInfo(token);
      }
    })
  }

  private onMfaDisable() {
    this.setState({openDisableOtp: false})
    this.getMfaInfo(this.props.userContext.accessToken);
  }

  private onUploadedPicture() {
    this.setState({openFileUpload: false});
    toast('Votre photo de profile va être mis à jour !', {type: 'success'});
    setTimeout(() => {
      this.props.userContext.refreshUser((a) => {
        console.log(a);
      });
    }, 1000);
  }

  override render() {
    return (
      <Stack gap={4}>
        <UploadUserPictureModal open={this.state.openFileUpload} onDismiss={() => this.setState({openFileUpload: false})} onSuccess={this.onUploadedPicture} userContext={this.props.userContext}/>
        <DeleteUserModal open={this.state.openDeleteModal} onDismiss={() => this.setState({openDeleteModal: false})} onSuccess={this.onDeleted} userContext={this.props.userContext}/>
        <MfaModal open={this.state.openEnableOtp} onDismiss={() => this.setState({openEnableOtp: false})} onSuccess={this.onMfaEnable} userContext={this.props.userContext}/>
        <DisableOtpModal userContext={this.props.userContext} mfa={this.state.mfa.find((mfa) => mfa.type === MfaType.OTP)!} open={this.state.openDisableOtp} language={this.props.language} onDismiss={() => this.setState({openDisableOtp: false})} onSuccess={this.onMfaDisable}/>
        {this.showInfo()}
        {this.showSecurity()}
        {this.showDangerZone()}
      </Stack>
    );
  }
}
