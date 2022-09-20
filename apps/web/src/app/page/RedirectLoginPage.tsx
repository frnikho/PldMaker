/*
import React, { Fragment } from "react";
import { LoginState, UserContext, UserContextProps } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export type RedirectLoginPageProps = {

}

export type RedirectLoginPageState = {
  redirectUrl?: string;
}

export abstract class RedirectLoginPage<T, Z> extends React.Component<T, React.PropsWithoutRef<Z>> {

  protected constructor(props: RedirectLoginPageProps & T) {
    super(props);
  }

  private manageState(auth: UserContextProps) {
    if (auth.isLogged === LoginState.not_logged) {
      this.setState({redirectUrl: '/auth/login?redirect=todo'});
      return;
    } else {
      return this.renderPage();
    }
  }

  abstract renderPage(): JSX.Element | JSX.Element[];

  override render() {
    return (
      <Fragment>
        {this.state["redirectUrl"] ? <Navigate to={this.state["redirectUrl"]}/> : <UserContext.Consumer>
          {value => this.manageState(value)}
        </UserContext.Consumer>}
      </Fragment>
    )
  }

}
*/
