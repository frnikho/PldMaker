import React from "react";
import {UserContext} from "../context/UserContext";
import {CircularProgress} from "../component/utils/CircularProgress";
import {UserComponent} from "../component/UserComponent";

export type UserPageProps = unknown

export type UserPageState = unknown

export class UserPage extends React.Component<UserPageProps, UserPageState> {

  constructor(props: UserPageProps) {
    super(props);
  }

  override render() {
    return (
      <UserContext.Consumer>
        {(userAuth) => {
          if (userAuth.isLogged) {
            return (<UserComponent userContext={userAuth}/>)
          } else {
            return <CircularProgress/>
          }
        }}
      </UserContext.Consumer>
    );
  }

}
