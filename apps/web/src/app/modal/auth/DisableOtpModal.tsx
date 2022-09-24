import { ModalComponent } from "../../util/Modal";
import { LanguageProps } from "../../context/LanguageContext";
import PinInput from "react-pin-input";
import { Button, Link, TextInput } from "carbon-components-react";

import { Stack } from "@carbon/react";

import { Checkmark } from "@carbon/icons-react";
import { Mfa, MfaDisableType } from "@pld/shared";
import { UserApiController } from "../../controller/UserApiController";
import { RequiredUserContextProps } from "../../context/UserContext";
import { toast } from "react-toastify";

export type DisableOtpProps = {
  mfa: Mfa,
} & LanguageProps & RequiredUserContextProps;

export type DisableOtpState = {
  type: MfaDisableType;
  authCode: string;
}

export class DisableOtpModal extends ModalComponent<DisableOtpProps, DisableOtpState> {

  constructor(props) {
    super(props, {passiveModal: true});
    this.state = {
      authCode: '',
      type: MfaDisableType.AUTH_CODE,
    }
    this.onDisable = this.onDisable.bind(this);
  }

  private onDisable(code: string, type: MfaDisableType) {
    UserApiController.deleteOtp(this.props.userContext.accessToken, this.props.mfa._id, {code: code, type: type}, (mfa, error) => {
      if (error) {
        toast('Une erreur est survenue lors de la désactivation du TOTP !', {type: 'error'});
      } else {
        toast('L`authentification TOTP a été désactivé !', {type: 'success'});
        this.props.onSuccess();
      }
    })
  }

  private showDisableMethod() {
    if (this.state.type === MfaDisableType.BACKUP_CODE) {
      return (
        <Stack gap={6}>
          <TextInput id={'backup-code-input'} labelText={"Code de sauvegardes"} value={this.state.authCode} onChange={(a) => this.setState({authCode: a.currentTarget.value})}/>
          <Button onClick={() => this.onDisable(this.state.authCode, MfaDisableType.BACKUP_CODE)} renderIcon={Checkmark}>Désactiver TOTP</Button>
          <Link onClick={() => this.setState({type: MfaDisableType.BACKUP_CODE})}>Désactiver votre double authentification avec le code de votre d'application TOTP (Google Authenticator, Microsoft Authenticator ....)</Link>
        </Stack>
      )
    } else {
      return (
        <Stack gap={6}>
          <p>Vous pouvez votre code d'authentification sur l'application ou vous l'avez activer (Google Authenticator, Microsoft Authenticator...)</p>
          <PinInput length={6} onComplete={(code) => this.onDisable(code, MfaDisableType.AUTH_CODE)}/>
          <Link onClick={() => this.setState({type: MfaDisableType.BACKUP_CODE})}>Désactiver votre double authentification avec les code de sauvegardes TOTP</Link>
        </Stack>
      )
    }
  }

  override renderModal() {
    return (
      <>
        <h3 style={{marginBottom: 28}}>Désactiver la double Authentification TOTP</h3>
        {this.showDisableMethod()}
      </>
    )
  }

}
