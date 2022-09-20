import React from "react";
import { UserContext } from "../context/UserContext";
import { AuthOtpComponent } from "../component/AuthOtpComponent";

export type AuthOtpPageProps = unknown

export type AuthOtpPageState = unknown

export class AuthOtpPage extends React.Component<AuthOtpPageProps, AuthOtpPageState> {

  override render() {
    return (
      <UserContext.Consumer>
        {value => <AuthOtpComponent userContext={value}/>}
      </UserContext.Consumer>
    )
  }

}
