import React from "react";
import { Button, Modal, TextInput } from "carbon-components-react";
import { RequiredUserContextProps } from "../../context/UserContext";
import Lottie from 'lottie-react'
import { Mfa, MfaOtpBody } from "@pld/shared";
import { UserApiController } from "../../controller/UserApiController";
import { toast } from "react-toastify";
import { Data } from "../../util/FieldData";
import { QRCodeSVG } from "qrcode.react";

export type MfaModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
} & RequiredUserContextProps;

export type MfaModalState = {
  mfa: Data<Mfa>;
  token: string;
}

export class MfaModal extends React.Component<MfaModalProps, MfaModalState> {

  constructor(props: MfaModalProps) {
    super(props);
    this.state = {
      token: '',
      mfa: {
        loading: true,
        value: undefined,
      }
    }
    this.onClickOtpValidate = this.onClickOtpValidate.bind(this);
  }

  override componentDidUpdate(prevProps: Readonly<MfaModalProps>, prevState: Readonly<MfaModalState>, snapshot?: any) {
    if (this.props.open !== prevProps.open && this.props.open) {
      this.init();
    }
  }

  private init() {
    console.log('init !');
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

  private onClickOtpValidate() {
    if (this.state.mfa.value === undefined)
      return;
    UserApiController.verifyOtp(this.props.userContext.accessToken, new MfaOtpBody(this.state.token, this.state.mfa.value.secret), (mfa, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else if (mfa !== null) {
        console.log('abcde');
        this.props.onSuccess();
      } else {
        console.log('gze');
      }
    });
  }

  private showQrCode() {
    if (this.state.mfa.value === undefined)
      return;
    return (
      <>
        <QRCodeSVG value={`otpauth://totp/PLD [Maker]:${this.props.userContext.user?.email}?secret=${this.state.mfa.value.secret}&issuer=PLD [Maker]`} />
        <TextInput id={"otp-input"} labelText={""} value={this.state.token} onChange={(e) => this.setState({token: e.currentTarget.value})} max={6} maxLength={6}/>
        <Button onClick={this.onClickOtpValidate}>Valider</Button>
      </>
    );
  }

  override render() {
    return (
      <Modal
        open={this.props.open}
        passiveModal
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={this.props.onSuccess}
        size={"sm"}>
        <>
          <h3>Activer la double authentification</h3>
          <Lottie animationData={require('../../../assets/animations/otp.json')} loop={true} style={{width: '400px'}}/>
          {this.showQrCode()}
        </>
      </Modal>
    )
  }

}
