import React from "react";
import { RequiredUserContextProps } from "../context/UserContext";
import { Button, Checkbox, Column, FormLabel, Grid, MultiSelect, Select, SelectItem, TextInput, Tile } from "carbon-components-react";
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
import { UploadUserPictureModal } from "../modal/UploadUserPictureModal";
import { HelpLabel } from "../util/Label";
import { LoadingButtonComponent } from "./LoadingButton";
import { getTranslation, language } from "../language";
import { UserInfoComponent } from "./user/info/UserInfoComponent";

export type UserComponentProps = RequiredUserContextProps & LanguageProps;

type Modal = {
  openEnableOtp: boolean;
  openDisableOtp: boolean;
  openDeleteModal: boolean;
  openFileUpload: boolean;
}

type Loading = {
  loadingUpdateUser: boolean;
  loadingUpdateEmail: boolean;
}

export type UserComponentState = {
  firstname: string;
  lastname: string;
  domain: string[];
  timezone: string;
  mfa: Mfa[];
  org: Organization[];
  modals: Modal;
  loadings: Loading;
}

export class UserComponent extends React.Component<UserComponentProps, UserComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      org: [],
      mfa: [],
      firstname: '',
      lastname: '',
      domain: [],
      timezone: '',
      modals: {
        openEnableOtp: false,
        openDisableOtp: false,
        openDeleteModal: false,
        openFileUpload: false,
      },
      loadings: {
        loadingUpdateEmail: false,
        loadingUpdateUser: false,
      }
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

  private dismissModal(key: keyof Modal) {
    this.setState({
      modals: {
        ...this.state.modals,
        [key]: false,
      }
    })
  }

  private setLoading(key: keyof Loading, value: boolean) {
    this.setState({
      loadings: {
        ...this.state.loadings,
        [key]: Boolean(value),
      }
    })
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
      firstname: user.firstname,
      lastname: user.lastname,
      domain: user.domain ?? [],
      timezone: user.timezone,
    });
  }

  private openModal(modalToOpen: keyof Modal) {
    this.setState({
      modals: {
        ...this.state.modals,
        [modalToOpen]: true,
      }
    })
  }

  private onDeleted() {
    this.openModal('openDeleteModal');
  }

  private onClickUpdate() {
    this.setLoading('loadingUpdateUser', true);
    UserApiController.updateUser(this.props.userContext.accessToken, {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      domain: this.state.domain,
      timezone: Timezone[this.state.timezone]
    }, (user, error) => {
      this.setLoading('loadingUpdateUser', false);
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
          <Tile style={style.tile}>Vous n'avez pas activer le TOTP</Tile>
          <Button style={style.button} onClick={() => this.openModal('openEnableOtp')}>Ajouter 2FA</Button>
        </>
      );
    } else {
      return (<>
        <Tile style={style.tile}>OTP actif depuis: {formatLongDate(new Date(mfa.activationDate))}</Tile>
        <Button style={style.button} kind={"ghost"} onClick={() => this.openModal('openDisableOtp')}>Désactiver MFA</Button>
      </>);
    }
  }

  private showSecurity() {
    return (
      <Tile style={style.tile}>
        <Stack gap={4}>
          <h4>2FA</h4>
          <p>
            La double authentification permet de renforcer la sécurité de vos comptes en exigeant un troisième élément d'identification, en plus de votre email et de votre mot de passe, pour valider chaque connexion.
            Pour le moment, seulement le TOTP est disponible pour la double authentification (Time based One Time Password)
          </p>
          {this.showMfaOtp()}
        </Stack>
      </Tile>
    )
  }

  private onClickUpdateEmailPreference() {

  }

  private showPrivacy() {
    return (
      <Tile style={style.tile}>
        <Stack gap={4}>
          <p>Vous avez la possibilité de controller le contenu que vous souhaitez recevoir par email :</p>
          <div>
            <Checkbox id={'receive-email'} labelText={"Ne plus recevoir d'emails ?"}/>
            <HelpLabel message={"Vous ne recevrez plus aucun email (news, connexion...)"}></HelpLabel>
          </div>
          <div>
            <Checkbox id={'receive-login-email'} labelText={"Recevoir des emails lors de nouvelle connexion ?"}/>
            <HelpLabel message={"Lors de chaque nouvelle connexion, vous recevrez un email vous informant de cette dernière"}/>
          </div>
         <div>
           <Checkbox id={'receive-news-email'} labelText={"Recevoir des emails concernant les nouveautés ??"}/>
           <HelpLabel message={"Lors d'une nouvelle publication de mise à jour du PLD [Maker], vous recevrez un email comprenant les nouveautés mise en place"}/>
         </div>
        <LoadingButtonComponent isloading={this.state.loadings.loadingUpdateEmail} style={style.button} onClick={() => this.onClickUpdateEmailPreference()} renderIcon={Renew}>Mette à jour</LoadingButtonComponent>
        </Stack>
      </Tile>
    )
  }

  private showInfo() {
    return (
      <Tile style={style.tile}>
        <Grid>
          <Column xlg={6}>
            <TextInput id={"created-date-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Date de création"} value={formatLongDate(new Date(this.props.userContext.user?.created_date ?? ''))}/>
            <TextInput id={"updated-date-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Dernière mise a jour"} value={formatLongDate(new Date(this.props.userContext.user?.updated_date ?? ''))}/>
            <TextInput id={"email-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Email"} value={this.props.userContext.user?.email}/>
          </Column>
          <Column xlg={8}>
            <Stack orientation={"vertical"}>
              <FormLabel>Photo de profile</FormLabel>
              <img style={{padding: 12, objectFit: 'cover', width: 200, height: 200}} title={'Mettre à jour'} onClick={() => this.openModal('openFileUpload')} src={SERVER_URL_ASSETS + this.props.userContext.user?.profile_picture} alt={""}/>
            </Stack>
          </Column>
        </Grid>
        <TextInput style={{marginBottom: '20px'}} id={"lastname-input"} labelText={"Nom"} value={this.state.lastname} onChange={(e) => this.setState({ lastname: e.currentTarget.value })}/>
        <TextInput id={"firstname-input-disabled"} labelText={"Prénom"} value={this.state.firstname} onChange={(e) => this.setState({ firstname: e.currentTarget.value })}/>
        <Select id={"timezone-input"} labelText={"Timezone"} onChange={(e) => this.setState({timezone: e.currentTarget.value})} value={this.state.timezone}>
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
        label={this.state.domain.join(', ')}
        titleText={"Domaines d'application"}
        id="domain-list"
        selectedItems={this.state.domain.map((domain) => ({label: domain}))}
        items={Object.keys(UserDomain).map((d) => {
          return {
            label: d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
          }
        }).sort()}
        onChange={(e) => {
          this.setState({
            domain: e.selectedItems.map((a) => a.label)
          })
        }}
      />
      <div style={{marginTop: 24}}>
        <LoadingButtonComponent isloading={this.state.loadings.loadingUpdateUser}>Mettre a jour</LoadingButtonComponent>
      </div>
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
        <Button style={style.button} kind={'danger'} renderIcon={TrashCan} onClick={() => this.openModal('openDeleteModal')}>Supprimer</Button>
      </>
    )
  }

  private showDangerZone() {
    const orgOwners = this.state.org.filter((org) => org.owner._id === this.props.userContext.user?._id);
    return (
      <Tile style={style.tile}>
        {orgOwners.length > 0 ? this.showOrgOwners(orgOwners) : this.showDelete()}
      </Tile>
    )
  }

  private onMfaEnable(token) {
    this.props.userContext.saveOtpToken(token, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        this.dismissModal('openEnableOtp');
        toast('2FA Activé', {type: 'success'});
        this.getMfaInfo(token);
      }
    })
  }

  private onMfaDisable() {
    this.dismissModal('openDisableOtp');
    this.getMfaInfo(this.props.userContext.accessToken);
  }

  private onUploadedPicture() {
    this.dismissModal('openFileUpload');
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
        <UploadUserPictureModal open={this.state.modals.openFileUpload} onDismiss={() => this.dismissModal('openFileUpload')} onSuccess={this.onUploadedPicture} userContext={this.props.userContext}/>
        <DeleteUserModal open={this.state.modals.openDeleteModal} onDismiss={() => this.dismissModal('openDeleteModal')} onSuccess={this.onDeleted} userContext={this.props.userContext}/>
        <MfaModal open={this.state.modals.openEnableOtp} onDismiss={() => this.dismissModal('openEnableOtp')} onSuccess={this.onMfaEnable} userContext={this.props.userContext}/>
        <DisableOtpModal userContext={this.props.userContext} mfa={this.state.mfa.find((mfa) => mfa.type === MfaType.OTP)!} open={this.state.modals.openDisableOtp} language={this.props.language} onDismiss={() => this.dismissModal('openDisableOtp')} onSuccess={this.onMfaDisable}/>
        <h2 style={style.title}>{this.props.language.translate(language.pages.myProfile.title)}</h2>
        <UserInfoComponent onUpdateUser={() => toast('abc')} userContext={this.props.userContext} user={this.props.userContext.user}/>
        {/*{this.showInfo()}*/}
        <h3 style={style.title}>{this.props.language.translate(language.pages.myProfile.security.title)}</h3>
        {this.showSecurity()}
        <h3 style={style.title}>{this.props.language.translate(language.pages.myProfile.preference.title)}</h3>
        {this.showPrivacy()}
        <h3 style={style.dangerTitle}>{this.props.language.translate(language.pages.myProfile.delete.title)}</h3>
        {this.showDangerZone()}
      </Stack>
    );
  }
}

const style = {
  dangerTitle: {
    fontWeight: 'bold',
    color: '#E74C3C',
    marginTop: 18,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 18,
  },
  tile: {
    borderRadius: 8,
  },
  button: {
    borderRadius: 12,
  }
}
