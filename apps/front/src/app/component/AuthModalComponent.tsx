import React from "react";
import {LoginModal} from "../modal/LoginModal";
import {RegisterModal} from "../modal/RegisterModal";
import {UserContext} from "../context/UserContext";
import {User} from "@pld/shared";


export type AuthModalComponentProps = {
  openLoginModal: boolean;
  openRegisterModal: boolean;
  onUserLogged: (user: User) => void;
  onUserRegistered: (user: User) => void;
  switchModal: () => void;
  onDismiss: () => void;
}

export class AuthModalComponent extends React.Component<AuthModalComponentProps, unknown> {

  override render() {
    return (
      <UserContext.Consumer>
        {(auth) => {
          return (
            <>
              <LoginModal open={this.props.openLoginModal} onDismiss={this.props.onDismiss} onUserLogged={this.props.onUserLogged} switchToRegister={this.props.switchModal} userContext={auth}/>
              <RegisterModal open={this.props.openRegisterModal} onDismiss={this.props.onDismiss} onRegister={this.props.onUserRegistered} switchToRegister={this.props.switchModal} userContext={auth}/>
            </>
          )
        }}
      </UserContext.Consumer>
    );
  }

}
