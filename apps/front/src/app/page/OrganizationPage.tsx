import React from "react";
import {RouteMatch} from "react-router/lib/router";
import {PageState} from "../util/Page";
import {redirectNavigation, withParams} from "../util/Navigation";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import OrganizationComponent from "../component/org/OrganizationComponent";
import {ApiError} from "../util/Api";
import {SkeletonPlaceholder} from "carbon-components-react";


export type OrganizationPageProps = unknown & RouteMatch;
export type OrganizationPageState = unknown & PageState;

class OrganizationPage extends React.Component<OrganizationPageProps, OrganizationPageState>{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
    this.onError = this.onError.bind(this);
  }

  onError(error: ApiError) {
    this.setState({
      navigateUrl: '/'
    })
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return <h1>Not logged</h1>
    } else if (authContext.isLogged === LoginState.logged) {
      return <OrganizationComponent onError={this.onError} orgId={this.props.params['id']}  userContext={authContext}/>
    }
    return (
      <SkeletonPlaceholder style={{height: '20px', width: '20%'}}/>
    )
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => this.showState(auth)}
        </UserContext.Consumer></>
    );
  }

}

export default withParams(OrganizationPage);
