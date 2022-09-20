import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {CircularProgress} from "../component/utils/CircularProgress";
import {UserComponent} from "../component/UserComponent";

export type UserPageProps = unknown

export type UserPageState = unknown

export class UserPage extends React.Component<UserPageProps, UserPageState> {

  constructor(props: UserPageProps) {
    super(props);
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (authContext.isLogged === LoginState.logged) {
      return (<UserComponent userContext={authContext}/>)
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
