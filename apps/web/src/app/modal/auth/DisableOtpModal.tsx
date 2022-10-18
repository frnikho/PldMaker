import { ModalProps } from "../../util/Modal";
import PinInput from "react-pin-input";
import { Button, Link, Modal, TextInput } from "carbon-components-react";

import { Stack } from "@carbon/react";

import { Checkmark } from "@carbon/icons-react";
import { Mfa, MfaDisableType } from "@pld/shared";
import { UserApiController } from "../../controller/UserApiController";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../../hook/useAuth";
import { useLanguage } from "../../hook/useLanguage";

type Props = {
  mfa?: Mfa,
} & ModalProps;

export const DisableOtpModal = (props: Props) => {

  const {translate} = useLanguage();
  const {accessToken} = useAuth();
  const [code, setCode] = useState<string>('');
  const [method, setMethod] = useState<MfaDisableType>(MfaDisableType.AUTH_CODE);

  const onDisable = (code: string, type: MfaDisableType) => {
    UserApiController.deleteOtp(accessToken, props.mfa?._id ?? '', {code: code, type: type}, (mfa, error) => {
      if (error) {
        toast(translate('errors.cantDisableTOTP'), {type: 'error'});
      } else {
        props.onSuccess();
      }
    })
  }

  const showDisableMethod = () => {
    if (method === MfaDisableType.BACKUP_CODE) {
      return (
        <>
          <TextInput id={'backup-code-input'} labelText={"Code de sauvegardes"} value={code} onChange={(e) => setCode(e.currentTarget.value)}/>
          <Button onClick={() => onDisable(code, MfaDisableType.BACKUP_CODE)} renderIcon={Checkmark}>Désactiver TOTP</Button>
          <Link onClick={() => setMethod(MfaDisableType.AUTH_CODE)}>Désactiver votre double authentification avec le code de votre d'application TOTP (Google Authenticator, Microsoft Authenticator ....)</Link>
        </>
      )
    } else {
      return (
        <>
          <p>Vous pouvez votre code d'authentification sur l'application ou vous l'avez activer (Google Authenticator, Microsoft Authenticator...)</p>
          <PinInput length={6} onComplete={(code) => onDisable(code, MfaDisableType.AUTH_CODE)}/>
          <Link onClick={() => setMethod(MfaDisableType.BACKUP_CODE)}>Désactiver votre double authentification avec les code de sauvegardes TOTP</Link>
        </>
      )
    }
  }

  return (
    <Modal open={props.open} onRequestClose={props.onDismiss}>
      <h3 style={{marginBottom: 28}}>Désactiver la double Authentification TOTP</h3>
      <Stack gap={6}>
        {showDisableMethod()}
      </Stack>
    </Modal>
  )
};
