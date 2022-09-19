import React from "react";
import { UserContext } from "../context/UserContext";
import { AuthOtpComponent } from "../component/AuthOtpComponent";

export type AuthOtpPageProps = {

}

export type AuthOtpPageState = {

}

export class AuthOtpPage extends React.Component<AuthOtpPageProps, AuthOtpPageState> {

  constructor(props: AuthOtpPageProps) {
    super(props);
  }

  override render() {
    return (
      <UserContext.Consumer>
        {value => <AuthOtpComponent userContext={value}/>}
      </UserContext.Consumer>
    )
  }

}
