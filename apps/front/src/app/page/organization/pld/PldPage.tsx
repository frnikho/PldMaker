import React from "react";
import {UserContext} from "../../../context/UserContext";
import {NewPldComponent} from "../../../component/org/pld/NewPldComponent";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {RouteMatch} from "react-router/lib/router";
import {redirectNavigation, withParams} from "../../../util/Navigation";
import {PageState} from "../../../util/Page";
import {PldComponent} from "../../../component/org/pld/PldComponent";

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

  override componentDidMount() {
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => {
          if (auth.isLogged) {
            return <PldComponent userContext={auth} pldId={this.props.params['pldId'] ?? 'null'} orgId={this.props.params['id'] ?? 'null'}/>
          } else {
            return <CircularProgress style={{margin: 'auto'}}/>
          }
        }}
        </UserContext.Consumer>
      </>
    );
  }
}

export default withParams(PldPage);
