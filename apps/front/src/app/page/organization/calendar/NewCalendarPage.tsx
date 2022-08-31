import React from "react";
import {LoginState, UserContext, UserContextProps} from "../../../context/UserContext";
import {NewCalendarComponent} from "../../../component/org/calendar/NewCalendarComponent";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {withParams} from "../../../util/Navigation";
import {RouteMatch} from "react-router/lib/router";

export type NewCalendarProps = {

} & RouteMatch;

export type NewCalendarState = {

}

export class NewCalendarPage extends React.Component<NewCalendarProps, NewCalendarState> {

  constructor(props: NewCalendarProps) {
    super(props);
  }

  override componentDidMount() {
    console.log(this.props);
  }

  private showState(authContext: UserContextProps) {
    if (this.props.params['id'] === undefined)
      return;
    if (authContext.isLogged === LoginState.not_logged) {
      return <h1>Not logged</h1>
    } else if (authContext.isLogged === LoginState.loading) {
      return <CircularProgress/>;
    } else {
      return <NewCalendarComponent userContext={authContext} orgId={this.props.params['id']}/>;
    }
  }

  override render() {
    return (
      <UserContext.Consumer>
        {authContext => this.showState(authContext)}
      </UserContext.Consumer>
    )
  }

}

export default withParams(NewCalendarPage);
