import React from "react";
import {LoginState, UserContext, UserContextProps} from "../../../context/UserContext";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {redirectNavigation, withParams} from "../../../util/Navigation";
import {PageState} from "../../../util/Page";
import { PldComponent } from "../../../component/pld/PldComponent";
import { RouteMatch } from "react-router-dom";

export type PldPageProps = unknown & RouteMatch;
export type PldPageState = unknown & PageState;

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
      return (<PldComponent pldId={this.props.params['pldId'] ?? 'null'} orgId={this.props.params['id'] ?? 'null'}/>)
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
