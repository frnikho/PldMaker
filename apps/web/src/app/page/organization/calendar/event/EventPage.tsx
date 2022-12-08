import React from "react";
import {withParams} from "../../../../util/Navigation";
import {LoginState, UserContext, UserContextProps} from "../../../../context/UserContext";
import {EventComponent} from "../../../../component/org/calendar/event/EventComponent";
import {CircularProgress} from "../../../../component/utils/CircularProgress";
import { RouteMatch, useParams } from "react-router-dom";
import { usePage } from "../../../../hook/usePage";
import { PageLoadingComponent } from "../../../../component/PageLoadingComponent";

/*export type EventPageProps = RouteMatch

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
export default withParams(EventPage);*/


export const EventPage = () => {

  const params = useParams();
  const { isReady } = usePage({redirectPage: '/', params: {}, redirectIfNotLogged: true});

  if (isReady) {
    return (<EventComponent orgId={params['id'] ?? ''} eventId={params['eventId'] ?? ''} calendarId={params['calendarId'] ?? ''}/>);
  }
  return (
    <PageLoadingComponent/>
  )
};
