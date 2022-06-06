import React from "react";
import {RouteMatch} from "react-router/lib/router";
import {PageState} from "../util/Page";
import {redirectNavigation, withParams} from "../util/Navigation";
import {UserContext} from "../context/UserContext";
import {OrganizationComponent} from "../component/org/OrganizationComponent";
import {ApiError} from "../util/Api";

export type OrganizationPageProps = {

} & RouteMatch;

export type OrganizationPageState = {

} & PageState;

class OrganizationPage extends React.Component<OrganizationPageProps, OrganizationPageState>{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
    this.onError = this.onError.bind(this);
  }

  override componentDidMount() {

  }

  onError(error: ApiError) {
    this.setState({
      navigateUrl: '/'
    })
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => {
            return (
              <>
                {auth.isLogged ? <OrganizationComponent onError={this.onError} orgId={this.props.params['id']}  userContext={auth}/> : ''}
              </>
            )
          }}
        </UserContext.Consumer></>
    );
  }

}

export default withParams(OrganizationPage);
