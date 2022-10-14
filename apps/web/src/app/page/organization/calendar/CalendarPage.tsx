import React from "react";
import {withParams} from "../../../util/Navigation";
import {Data} from "../../../util/FieldData";
import {Calendar, Organization} from "@pld/shared";
import {OrganizationApiController} from "../../../controller/OrganizationApiController";
import {LoginState, UserContext, UserContextProps} from "../../../context/UserContext";
import {CircularProgress} from "../../../component/utils/CircularProgress";
import {CalendarComponent} from "../../../component/org/calendar/CalendarComponent";
import {CalendarApiController} from "../../../controller/CalendarApiController";
import {toast} from "react-toastify";
import { RouteMatch } from "react-router-dom";

export type CalendarPageProps = RouteMatch;

export type CalendarPageState = {
  org: Data<Organization>;
  calendar: Data<Calendar>;
}

export class CalendarPage extends React.Component<CalendarPageProps, CalendarPageState> {

  constructor(props: CalendarPageProps) {
    super(props);
    this.state = {
      org: {
        loading: true,
      },
      calendar: {
        loading: true,
      }
    }
  }

  private load(authContext: UserContextProps) {
    this.loadOrg(authContext.accessToken, this.props.params['id'] ?? '');
    this.loadCalendar(authContext.accessToken, this.props.params['id'] ?? '', this.props.params['calendarId'] ?? '');
  }

  private loadOrg(accessToken: string, orgId: string) {
    OrganizationApiController.findOrganizationById(accessToken, orgId, (org, error) => {
      if (org) {
        this.setState({org: {loading: false, value: org}})
      } else {
        toast('Une erreur est survenue lors de la recuperation de l\'organisation', {type: 'error'})
      }
    });
  }

  private loadCalendar(accessToken: string, orgId: string, calendarId: string) {
    CalendarApiController.getCalendar(accessToken, orgId, calendarId, (calendar, error) => {
      if (calendar) {
        this.setState({calendar: {loading: false, value: calendar}});
      } else {
        toast('Une erreur est survenue lors de la recuperation du calendrier', {type: 'error'})
      }
    });
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.logged) {
      if (this.state.calendar.value === undefined) {
        this.load(authContext)
      }
      return <CalendarComponent calendarId={this.props.params['calendarId'] ?? ''} orgId={this.props.params['id'] ?? ''} userContext={authContext} calendar={this.state.calendar} org={this.state.org}/>
    } else if (authContext.isLogged === LoginState.not_logged) {
      return (<h3>Not logged !</h3>)
    } else {
      return <CircularProgress/>
    }
  }

  override render() {
    return (
      <UserContext.Consumer>
        {value => this.showState(value)}
      </UserContext.Consumer>
    );
  }

}

export default withParams(CalendarPage);
