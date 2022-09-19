import React from "react";
import { RequiredUserContextProps } from "../context/UserContext";
import { Button, MultiSelect, Select, SelectItem, TextInput, Tile } from "carbon-components-react";
import { FieldData } from "../util/FieldData";
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";
import { formatLongDate, Timezone } from "@pld/utils";

import { Renew } from "@carbon/icons-react";

import { Stack } from "@carbon/react";
import { MfaModal } from "../modal/auth/MfaModal";
import { Mfa, MfaType, Organization } from "@pld/shared";
import { OrganizationApiController } from "../controller/OrganizationApiController";

export type UserComponentProps = RequiredUserContextProps;

export type UserComponentState = {
  firstname: FieldData<string>;
  lastname: FieldData<string>;
  domain: FieldData<string[]>;
  timezone: FieldData<string>;
  open: boolean;
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
      open: false
    }
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onMfaEnable = this.onMfaEnable.bind(this);
  }

  override componentDidMount() {
    this.loadInfo();
  }

  private loadInfo() {
    if (this.props.userContext.user?.firstname === undefined || this.props.userContext.user?.lastname === undefined || this.props.userContext.user.domain === undefined)
      return;
    this.setState({
      firstname: {
        value: this.props.userContext.user.firstname,
      },
      lastname: {
        value: this.props.userContext.user.lastname,
      },
      domain: {
        value: this.props.userContext.user.domain,
      },
      timezone: {
        value: this.props.userContext.user.timezone,
      }
    });
    OrganizationApiController.getMeOrganizations(this.props.userContext.accessToken, (orgs, error) => {
      if (error) {
        toast(error.message, {type: 'error'})
      } else {
        this.setState({org: orgs,})
      }
    });
    UserApiController.getMfa(this.props.userContext.accessToken, (mfa, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.setState({mfa: mfa});
      }
    });
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
        this.loadInfo();
      }
    });
  }

  private showMfaOtp() {
    const mfa = this.state.mfa.find((mfa) => mfa.type === MfaType.OTP && mfa.user._id === this.props.userContext.user?._id && mfa.validate);
    if (this.state.mfa.length === 0 || mfa === undefined) {
      return (
        <>
          <Tile>Vous n'avez pas activer l'OTP</Tile>
          <Button onClick={() => this.setState({open: true})}>Ajouter 2FA</Button>
        </>
      );
    } else {
      return (<>
        <Tile>OTP actif depuis: {formatLongDate(new Date(mfa.activationDate))}</Tile>
        <Button kind={"ghost"} onClick={() => this.setState({open: true})}>Désactiver MFA</Button>
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
    return (<Tile>
        <h3 style={{marginBottom: '20px'}}>Mes informations</h3>
      <TextInput disabled id={"created-date-user"} labelText={"Date de création"} value={formatLongDate(new Date(this.props.userContext.user?.created_date ?? ''))}/>
      <TextInput disabled id={"updated-date-user"} labelText={"Dernière mise a jour"} value={formatLongDate(new Date(this.props.userContext.user?.updated_date ?? ''))}/>
      <TextInput disabled id={"email-user"} labelText={"Email"} value={this.props.userContext.user?.email}/>
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
        items={[{label: 'Mobile'}, {label: 'Server'}, {label: 'Web'}, {label: 'Autre'}]}
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

  private showDangerZone() {
    const orgOwners = this.state.org.filter((org) => org.owner._id === this.props.userContext.user?._id);
    return (
      <Tile>
        <h3 style={{marginBottom: '20px'}}>⚠ Supprimer mon compte </h3>
        {orgOwners.length > 0 ? this.showOrgOwners(orgOwners) : null}
      </Tile>
    )
  }

  private onMfaEnable(token) {
    this.props.userContext.saveOtpToken(token, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        this.setState({open: false});
        toast('2FA Activé', {type: 'success'});
      }
    })
  }

  override render() {
    return (
      <Stack gap={4}>
        <MfaModal open={this.state.open} onDismiss={() => this.setState({open: false})} onSuccess={this.onMfaEnable} userContext={this.props.userContext}/>
        {this.showInfo()}
        {this.showSecurity()}
        {this.showDangerZone()}
      </Stack>
    );
  }

}
