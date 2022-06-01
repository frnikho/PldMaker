import React from "react";
import {User} from "../../../../../libs/data-access/user/User";
import {UserContext} from "../context/UserContext";
import {LoginModal} from "../modal/LoginModal";
import {RegisterModal} from "../modal/RegisterModal";

export type AuthModalComponentState = {
  openLoginModal: boolean;
  openRegisterModal: boolean;
}

export type AuthModalComponentProps = {
  openLoginModal: boolean;
  openRegisterModal: boolean;
}

export class AuthModalComponent extends React.Component<AuthModalComponentProps, AuthModalComponentState> {
  constructor(props: AuthModalComponentProps) {
    super(props);
    this.state = {
      openLoginModal: this.props.openLoginModal,
      openRegisterModal: this.props.openRegisterModal,
    }
    this.switchModal = this.switchModal.bind(this);
    this.onUserRegistered = this.onUserLogged.bind(this);
    this.onUserLogged = this.onUserLogged.bind(this);
  }

  public onUserRegistered(user: User) {
    this.setState({
      openRegisterModal: false
    });
  }

  public onUserLogged(user: User) {
    this.setState({
      openLoginModal: false
    });
  }

  public switchModal() {
    if (this.state.openLoginModal) {
      this.setState({
        openLoginModal: false,
        openRegisterModal: true
      });
    } else {
      this.setState({
        openLoginModal: true,
        openRegisterModal: false
      });
    }
  }

  override render() {
    return (
      <>
        <LoginModal open={this.state.openLoginModal} onDismiss={() => this.setState({openLoginModal: false})} onUserLogged={this.onUserLogged} switchToRegister={this.switchModal}/>
        <RegisterModal open={this.state.openRegisterModal} onDismiss={() => this.setState({openRegisterModal: false})} onRegister={this.onUserRegistered} switchToRegister={this.switchModal}/>
      </>
    );
  }

}
