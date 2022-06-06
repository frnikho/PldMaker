import React from "react";
import {UserContext} from "../context/UserContext";
import {OrganizationHomeDashboard} from "../component/home/OrganizationHomeDashboard";
import {Content, SkeletonPlaceholder} from "carbon-components-react";
import {PldHomeDashboard} from "../component/home/PldHomeDashboard";

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
                  {!userContext.isLogged ? <SkeletonPlaceholder style={{height: '20px', width: '20%'}}/> : <OrganizationHomeDashboard userContext={userContext}/>}
                  {!userContext.isLogged ? <SkeletonPlaceholder style={{marginTop: '50px', height: '20px', width: '20%'}}/> : <PldHomeDashboard userContext={userContext}/>}
                </>);
            }}
          </UserContext.Consumer>
        </Content>
      </>
    );
  }

}
