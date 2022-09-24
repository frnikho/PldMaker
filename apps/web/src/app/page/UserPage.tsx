import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {CircularProgress} from "../component/utils/CircularProgress";
import {UserComponent} from "../component/UserComponent";
import { LanguageProps, withLanguage } from "../context/LanguageContext";

export type UserPageProps = LanguageProps;

export type UserPageState = unknown

class UserPage extends React.Component<UserPageProps, UserPageState> {

  constructor(props: UserPageProps) {
    super(props);
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (authContext.isLogged === LoginState.logged) {
      return (<UserComponent language={this.props.language} userContext={authContext}/>)
    }
    return (<CircularProgress/>)
  }

  override render() {
    return (
      <UserContext.Consumer>
        {(userAuth) => this.showState(userAuth)}
      </UserContext.Consumer>
    );
  }

}

export default withLanguage(UserPage);
