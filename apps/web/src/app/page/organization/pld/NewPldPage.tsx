import React from "react";
import {LoginState, UserContext, UserContextProps} from "../../../context/UserContext";
import {NewPldComponent} from "../../../component/pld/NewPldComponent";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {RouteMatch} from "react-router/lib/router";
import {redirectNavigation, withParams} from "../../../util/Navigation";
import {PageState} from "../../../util/Page";

export type NewPldPageProps = unknown & RouteMatch;
export type NewPldPageState = unknown & PageState;

class NewPldPage extends React.Component<NewPldPageProps, NewPldPageState> {

  constructor(props: NewPldPageProps) {
    super(props);
    this.state = {
      navigateUrl: undefined,
      loading: false
    }
    this.onPldCreated = this.onPldCreated.bind(this);
  }

  private onPldCreated() {
    this.setState({
      navigateUrl: `/organization/${this.props.params['id']}`
    })
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (authContext.isLogged === LoginState.logged) {
      return (<NewPldComponent onPldCreated={this.onPldCreated} orgId={this.props.params['id']} userContext={authContext}/>)
    }
    return (<CircularProgress style={{margin: 'auto'}}/>)
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

export default withParams(NewPldPage);
