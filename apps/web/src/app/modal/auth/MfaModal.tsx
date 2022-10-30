import React, { useEffect, useState } from "react";
import { Button, Column, Grid, Link, Modal } from "carbon-components-react";
import Lottie from 'lottie-react'
import { Mfa, MfaOtpBody } from "@pld/shared";
import { UserApiController } from "../../controller/UserApiController";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";

import {Stack} from '@carbon/react';

import {Checkmark} from '@carbon/icons-react';
import { RequiredLabel } from "../../util/Label";
import PinInput from "react-pin-input";
import { ModalProps } from "../../util/Modal";
import { useAuth } from "../../hook/useAuth";

type Props = {
  onMfaEnabled: (token: string) => void;
} & ModalProps;

export const MfaModal = (props: Props) => {

  const [mfa, setMfa] = useState<Mfa | undefined>(undefined);
  const [manual, setManuel] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const {accessToken, user} = useAuth();

  useEffect(() => {
    if (props.open) {
      init();
    }
  }, [props.open]);

  const init = () => {
    console.log('INIT !');
    UserApiController.enableOtp(accessToken, (mfa, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'})
      } else if (mfa !== null) {
        setMfa(mfa);
      }
    });
  }

  const onClickOtpValidate = (tokenText?: string) => {
    if (mfa === undefined)
      return;
    UserApiController.verifyOtp(accessToken, new MfaOtpBody(tokenText ?? token, mfa.secret), (mfa, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else if (mfa !== null) {
        props.onMfaEnabled(mfa);
      } else {
        console.log('gze');
      }
    });
  }

  const showQrCode = () => {
    if (mfa === undefined)
      return;
    return (
      <Stack gap={6}>
        <Grid>
          <Column xlg={4}>
            <QRCodeSVG style={{marginTop: 10}} value={`otpauth://totp/PLD [Maker]:${user?.email}?secret=${mfa.secret}&issuer=PLD [Maker]`} />
          </Column>
          <Column xlg={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
            Scannez ce QR code avec Google Authenticator ou tout autre application de 2FA
          </Column>
        </Grid>
        <div>
          <Link onClick={() => setManuel(!manual)}>Afficher le code manuel</Link>
          <p style={{display: !manual ? 'none' : undefined}}>{mfa.secret}</p>
        </div>
        <div>
          <RequiredLabel message={"Code de l'application"}/>
          <PinInput length={6} onComplete={(token) => onClickOtpValidate(token)} onChange={(a) => setToken(a)}/>
        </div>
        <Button renderIcon={Checkmark} iconDescription={"Valid"} onClick={() => onClickOtpValidate()}>Valider</Button>
      </Stack>
    );
  }

  return (
    <Modal
      open={props.open}
      passiveModal
      onRequestClose={props.onDismiss}
      size={"sm"}>
      <Lottie animationData={require('../../../assets/animations/otp.json')} loop={true} style={{width: '140px', margin: 'auto'}}/>
      <h2 style={{textAlign: 'center'}}>Activer le 2FA</h2>
      <p style={{textAlign: 'center', padding: 0}}>En activant la vérification en deux étapes, vous renforcer la sécurité de votre compte ainsi que de vos informations personnels</p>
      {showQrCode()}
    </Modal>
  )
};
