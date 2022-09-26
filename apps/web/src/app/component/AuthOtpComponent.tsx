import React from "react";
import { RequiredUserContextProps } from "../context/UserContext";
import PinInput from 'react-pin-input';
import Lottie from "lottie-react";

import {Stack} from '@carbon/react'
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Link } from "carbon-components-react";
import { NavProps } from "../util/Navigation";

export type AuthOtpProps = RequiredUserContextProps;

export type AuthOtpState = {
  redirectUrl?: string;
}

export class AuthOtpComponent extends React.Component<AuthOtpProps, AuthOtpState> {

  constructor(props: AuthOtpProps) {
    super(props);
    this.state = {
      redirectUrl: undefined,
    }
    this.onComplete = this.onComplete.bind(this);
  }

  private onComplete(value: string) {
    UserApiController.loginOtp(this.props.userContext.accessToken, {token: value, secret: ''}, (payload, error) => {
      if (payload !== null) {
        this.props.userContext.saveOtpToken(payload, (user, error) => {

        })
      } else {
        toast(error?.message, {type: 'error'})
      }
    })
  }

  override render() {
    return (
      <Stack gap={5}>
        {this.state.redirectUrl ? <Navigate to={this.state.redirectUrl}/> : null}
        <Lottie animationData={require('../../assets/animations/otp.json')} loop={true} style={{width: '300px', margin: 'auto'}}/>
        <h3 style={{textAlign: 'center'}}>Connecter vous avec votre application de connexion en 2 étapes (Google Authenticator, Authenticator (Microsoft)...)</h3>
        <PinInput
          length={6}
          initialValue=""
          onChange={() => null}
          type="numeric"
          inputMode="number"
          style={{padding: '10px', margin: 'auto', textAlign: 'center'}}
          inputStyle={{borderColor: 'rgba(133,133,133,0.49)', borderRadius: 8, borderWidth: 2}}
          inputFocusStyle={{borderColor: '#161616'}}
          onComplete={this.onComplete}
          autoSelect={true}
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
        <p style={{textAlign: 'center'}}>Vous avez perdu l'accès a votre application d'authentification ? <Link onClick={() => null}>Utiliser votre code de recuperation</Link></p>

      </Stack>
    )
  }

}
