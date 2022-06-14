import React from "react";
import {LoginState, UserContext, UserContextProps} from "../../../context/UserContext";
import {NewPldComponent} from "../../../component/pld/NewPldComponent";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {RouteMatch} from "react-router/lib/router";
import {redirectNavigation, withParams} from "../../../util/Navigation";
import {PageState} from "../../../util/Page";
import {PldComponent} from "../../../component/pld/PldComponent";

export type PldPageProps = {

} & RouteMatch;

export type PldPageState = {

} & PageState;

class PldPage extends React.Component<PldPageProps, PldPageState> {

  constructor(props: PldPageProps) {
    super(props);
    this.state = {
      navigateUrl: undefined,
      loading: false
    }
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (authContext.isLogged === LoginState.logged) {
      return (<PldComponent userContext={authContext} pldId={this.props.params['pldId'] ?? 'null'} orgId={this.props.params['id'] ?? 'null'}/>)
    }
    return (<CircularProgress style={{margin: 'auto'}}/>)
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => this.showState(auth)}
        </UserContext.Consumer>
      </>
    );
  }
}

export default withParams(PldPage);
