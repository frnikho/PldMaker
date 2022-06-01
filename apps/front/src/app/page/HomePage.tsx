import React from "react";
import {UserContext} from "../context/UserContext";
import {OrganizationHomeDashboard} from "../component/OrganizationHomeDashboard";
import {Content, SkeletonPlaceholder} from "carbon-components-react";

export type HomePageProps = unknown;

export type HomePageState = {
  loading: boolean;
};

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      loading: true
    }
  }

  override render() {
    return (
      <>
        <Content>
          <UserContext.Consumer>
            {userContext => {
              return (
                <>
                  {!userContext.isLogged ? <SkeletonPlaceholder style={{height: '20px', width: '20%'}}/> : <h1>Hello WorldHello WorldHello World</h1>}
                </>);
            }}
          </UserContext.Consumer>
        </Content>
      </>
    );
  }

}
