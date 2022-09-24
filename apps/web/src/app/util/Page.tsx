import {NavigationState} from "./Navigation";
import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";

export type PageState = {
  loading: boolean;
} & NavigationState;

export type LoadingState = {
  loading: boolean;
}

export class ReactFormValidation<T, Z> extends React.Component<T, Z> {

  public updateFormField<X>(name: string, value: X, error: string) {
    const newState = {[name]: {value, error}} as unknown as Pick<any, any>;
    this.setState(newState);
  }

}

export abstract class AuthPage<T, Z> extends React.Component<T, Z> {

  protected constructor(props) {
    super(props);
  }

  public abstract showLogged(auth: UserContextProps): JSX.Element;
  public abstract showNotLogged(auth: UserContextProps): JSX.Element;
  public abstract showLoading(auth: UserContextProps): JSX.Element;

  override render() {
    return (
      <UserContext.Consumer>
        {(auth) => {
          if (auth.isLogged === LoginState.logged) {
            return this.showLogged(auth);
          } else if (auth.isLogged === LoginState.not_logged) {
            return this.showNotLogged(auth);
          } else {
            return this.showLoading(auth);
          }
        }}
      </UserContext.Consumer>
    );
  }
}
