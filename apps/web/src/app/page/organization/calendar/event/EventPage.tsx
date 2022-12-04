import React from "react";
import {withParams} from "../../../../util/Navigation";
import {LoginState, UserContext, UserContextProps} from "../../../../context/UserContext";
import {EventComponent} from "../../../../component/org/calendar/event/EventComponent";
import {CircularProgress} from "../../../../component/utils/CircularProgress";
import { RouteMatch } from "react-router-dom";

export type EventPageProps = RouteMatch

export type EventPageState = unknown

export class EventPage extends React.Component<EventPageProps, EventPageState> {

  constructor(props: EventPageProps) {
    super(props);
  }

  private showState(userContext: UserContextProps) {
    if (userContext.isLogged === LoginState.logged) {
      return <EventComponent orgId={this.props.params['id'] ?? ''} eventId={this.props.params['eventId'] ?? ''} calendarId={this.props.params['calendarId'] ?? ''}/>
    } else if (userContext.isLogged === LoginState.not_logged) {
      return <h3>Not logged</h3>
    } else {
      return <CircularProgress/>
    }
  }

  override render() {
    return (
      <UserContext.Consumer>
        {value => this.showState(value)}
      </UserContext.Consumer>
    )
  }

}
export default withParams(EventPage);
