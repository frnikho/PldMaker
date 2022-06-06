import React from "react";
import {UserContext} from "../../../context/UserContext";
import {NewPldComponent} from "../../../component/org/pld/NewPldComponent";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {RouteMatch} from "react-router/lib/router";
import {redirectNavigation, withParams} from "../../../util/Navigation";
import {PageState} from "../../../util/Page";

export type NewPldPageProps = {

} & RouteMatch;

export type NewPldPageState = {

} & PageState;

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

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => {
            if (auth.isLogged) {
              return <NewPldComponent onPldCreated={this.onPldCreated} orgId={this.props.params['id']} userContext={auth}/>
            } else {
              return <CircularProgress style={{margin: 'auto'}}/>
            }
          }}
        </UserContext.Consumer></>
    );
  }
}

export default withParams(NewPldPage);
