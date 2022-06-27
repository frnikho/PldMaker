import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {OrganizationHomeDashboard} from "../component/home/OrganizationHomeDashboard";
import {Button, Content, SkeletonPlaceholder} from "carbon-components-react";
import {PldHomeDashboard} from "../component/home/PldHomeDashboard";
import {SocketContext} from "../context/SocketContext";

import {Stack} from '@carbon/react';

export type HomePageProps = unknown;
export type HomePageState = unknown;

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props: HomePageProps) {
    super(props);
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (authContext.isLogged === LoginState.logged) {
      return (
        <Stack gap={4}>
          <OrganizationHomeDashboard userContext={authContext}/>
          <PldHomeDashboard userContext={authContext}/>
        </Stack>
      )
    }
    return (
      <>
        <SkeletonPlaceholder style={{height: '20px', width: '20%'}}/>
        <SkeletonPlaceholder style={{marginTop: '50px', height: '20px', width: '20%'}}/>
      </>
    )
  }

  override render() {
    return (
      <>
        <UserContext.Consumer>
          {userContext => this.showState(userContext)}
        </UserContext.Consumer>
      </>
    );
  }

}

