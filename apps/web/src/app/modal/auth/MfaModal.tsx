import React from "react";
import { Button, Column, Grid, Link, Modal } from "carbon-components-react";
import { RequiredUserContextProps } from "../../context/UserContext";
import Lottie from 'lottie-react'
import { Mfa, MfaOtpBody } from "@pld/shared";
import { UserApiController } from "../../controller/UserApiController";
import { toast } from "react-toastify";
import { Data } from "../../util/FieldData";
import { QRCodeSVG } from "qrcode.react";

import {Stack} from '@carbon/react';

import {Checkmark} from '@carbon/icons-react';
import { RequiredLabel } from "../../util/Label";
import PinInput from "react-pin-input";

export type MfaModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: (newToken: string) => void;
} & RequiredUserContextProps;

export type MfaModalState = {
  mfa: Data<Mfa>;
  token: string;
  showManualSecret: boolean;
}

export class MfaModal extends React.Component<MfaModalProps, MfaModalState> {

  constructor(props: MfaModalProps) {
    super(props);
    this.state = {
      token: '',
      showManualSecret: false,
      mfa: {
        loading: true,
        value: undefined,
      }
    }
    this.onClickOtpValidate = this.onClickOtpValidate.bind(this);
  }

  override componentDidUpdate(prevProps: Readonly<MfaModalProps>, prevState: Readonly<MfaModalState>) {
    if (this.props.open !== prevProps.open && this.props.open) {
      this.init();
    }
  }

  private init() {
    UserApiController.enableOtp(this.props.userContext.accessToken, (mfa, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'})
      } else if (mfa !== null) {
        this.setState({
          mfa: {
            value: mfa,
            loading: false,
          },
        });
      }
    });
  }

  private onClickOtpValidate(token?: string) {
    if (this.state.mfa.value === undefined)
      return;
    UserApiController.verifyOtp(this.props.userContext.accessToken, new MfaOtpBody(token ?? this.state.token, this.state.mfa.value.secret), (mfa, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else if (mfa !== null) {
        this.props.onSuccess(mfa);
      } else {
        console.log('gze');
      }
    });
  }

  private showQrCode() {
    if (this.state.mfa.value === undefined)
      return;
    return (
      <Stack gap={6}>
        <Grid>
          <Column xlg={4}>
            <QRCodeSVG style={{marginTop: 10}} value={`otpauth://totp/PLD [Maker]:${this.props.userContext.user?.email}?secret=${this.state.mfa.value.secret}&issuer=PLD [Maker]`} />
          </Column>
          <Column xlg={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
            Scannez ce QR code avec Google Authenticator ou tout autre application de 2FA
          </Column>
        </Grid>
        <div>
          <Link onClick={() => this.setState({showManualSecret: !this.state.showManualSecret})}>Afficher le code manuel</Link>
          <p style={{display: !this.state.showManualSecret ? 'none' : undefined}}>{this.state.mfa.value.secret}</p>
        </div>
        <div>
          <RequiredLabel message={"Code de l'application"}/>
          <PinInput length={6} onComplete={(token) => this.onClickOtpValidate(token)} onChange={(a) => this.setState({token: a})}/>
        </div>
        <Button renderIcon={Checkmark} iconDescription={"Valid"} onClick={() => this.onClickOtpValidate()}>Valider</Button>
      </Stack>
    );
  }

  override render() {
    return (
      <Modal
        open={this.props.open}
        passiveModal
        onRequestClose={this.props.onDismiss}
        size={"sm"}>
        <Lottie animationData={require('../../../assets/animations/otp.json')} loop={true} style={{width: '140px', margin: 'auto'}}/>
        <h2 style={{textAlign: 'center'}}>Activer le 2FA</h2>
        <p style={{textAlign: 'center', padding: 0}}>En activant la vérification en deux étapes, vous renforcer la sécurité de votre compte ainsi que de vos informations personnels</p>
        {this.showQrCode()}
      </Modal>
    )
  }

}
