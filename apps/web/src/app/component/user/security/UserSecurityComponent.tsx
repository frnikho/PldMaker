import { Mfa, MfaType } from "@pld/shared";
import { Button, Tile } from "carbon-components-react";
import React, { useCallback, useState } from "react";

import {GroupSecurity} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { formatLongDate } from "@pld/utils";
import { RequiredUserContextProps } from "../../../context/UserContext";
import { MfaModal } from "../../../modal/auth/MfaModal";
import { DisableOtpModal } from "../../../modal/auth/DisableOtpModal";
import { LanguageContextState } from "../../../context/LanguageContext";
import { toast } from "react-toastify";

type UserSecurityProps = {
  mfa?: Mfa[];
  languageCtx: LanguageContextState;
  onMfaEnabled: (newToken: string) => boolean;
  onMfaDisabled: () => boolean;
} & RequiredUserContextProps;

type Modal = {
  openEnableMfa;
  openDisableMfa;
}

export function UserSecurityComponent(props: UserSecurityProps) {

  const [modal, setModal] = useState<Modal>({openDisableMfa: false, openEnableMfa: false});

  const onMfaEnable = useCallback((newToken: string) => {
    if (props.onMfaEnabled(newToken)) {
      setModal({openDisableMfa: false, openEnableMfa: false});
    }
  }, []);

  const onMfaDisable = useCallback(() => {
    toast('L`authentification TOTP a été désactivé !', {type: 'success'});
    if (props.onMfaDisabled()) {
      setModal({openDisableMfa: false, openEnableMfa: false});
    }
  }, []);

  const showMfaOtp = () => {
    const mfa = props.mfa?.find((mfa) => mfa.type === MfaType.OTP && mfa.user._id === props.userContext.user?._id && mfa.verified);
    if (mfa === undefined) {
      return (
        <>
          <Tile style={style.tile}>Vous n'avez pas activer le TOTP</Tile>
          <Button renderIcon={GroupSecurity} style={style.button} onClick={() => setModal({openEnableMfa: true, openDisableMfa: false})}>Ajouter 2FA</Button>
        </>
      );
    } else {
      return (
        <>
          <Tile style={style.tile}>OTP actif depuis: {formatLongDate(new Date(mfa.activationDate))}</Tile>
          <Button renderIcon={GroupSecurity} style={style.button} kind={"ghost"} onClick={() => setModal({openDisableMfa: true, openEnableMfa: false})}>Désactiver MFA</Button>
        </>);
    }
  }

  return (
    <Tile style={style.tile}>
      <MfaModal open={modal.openEnableMfa} onDismiss={() => setModal({openDisableMfa: false, openEnableMfa: false})} onMfaEnabled={onMfaEnable} onSuccess={() => null} />
      <DisableOtpModal mfa={props.mfa?.find((mfa) => mfa.type === MfaType.OTP)} open={modal.openDisableMfa} onDismiss={() => setModal({openDisableMfa: false, openEnableMfa: false})} onSuccess={onMfaDisable}/>
      <Stack gap={4}>
        <h4>2FA</h4>
        <p>
          La double authentification permet de renforcer la sécurité de vos comptes en exigeant un troisième élément d'identification, en plus de votre email et de votre mot de passe, pour valider chaque connexion.
          Pour le moment, seulement le TOTP est disponible pour la double authentification (Time based One Time Password)
        </p>
        {showMfaOtp()}
      </Stack>
    </Tile>
  );
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
