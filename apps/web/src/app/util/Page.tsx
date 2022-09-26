import { NavigationState, NavProps } from "./Navigation";
import React from "react";
import { LoginState, UserContext, UserContextProps } from "../context/UserContext";
import { CircularProgress } from "../component/utils/CircularProgress";
import { Navigate } from "react-router-dom";

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


type PageProps = {

} & NavProps;

type PageStates = {
  navigate?: string;
}

export abstract class Page<T, Z> extends React.Component<PageProps & T, Z> {

  protected constructor(props: PageProps & T) {
    super(props);
  }

  public navigate(url: string) {
    setTimeout(() => this.props.navigate(url), 200);
  }

  private showState(context: UserContextProps) {
    if (context.isLogged === LoginState.not_logged) {
      return this.renderNotLogged(context);
    } else if (context.isLogged === LoginState.loading) {
      return this.renderLogged(context);
    }
    return this.renderPage(context);
  }

  public abstract renderPage(context: UserContextProps): React.ReactNode;

  public renderNotLogged(context: UserContextProps): React.ReactNode {
    if (context.requiredMfa) {
      this.navigate('/auth/otp');
    } else {
      this.navigate('/');
    }
    return;
  }

  public renderLogged(context: UserContextProps) {
    return (<CircularProgress/>)
  }

  override render() {
    return (
      <UserContext.Consumer>
        {value => this.showState(value)}
      </UserContext.Consumer>
    );
  }
}


type a = {

} & PageProps;

type b = {
  hello: string;
} & PageStates;

export class TestPage extends Page<a, b> {

  constructor(props: a) {
    super(props);
    this.state = {
      hello: 'abc',
    }
  }

  renderPage(): React.ReactNode {
    return (<>Logged !</>);
  }


}


