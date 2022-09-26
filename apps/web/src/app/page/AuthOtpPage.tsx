import React from "react";
import { UserContextProps } from "../context/UserContext";
import { AuthOtpComponent } from "../component/AuthOtpComponent";
import { Page } from "../util/Page";

export type AuthOtpPageProps = unknown
export type AuthOtpPageState = unknown

export class AuthOtpPage extends Page<AuthOtpPageProps, AuthOtpPageState> {

  renderPage(context: UserContextProps): React.ReactNode {
    this.navigate('/');
    return;
  }

  override renderNotLogged(context: UserContextProps) {
    return <AuthOtpComponent userContext={context}/>;
  }

}
