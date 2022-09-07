import React from "react";
import {Calendar, CalendarEvent, Organization} from "@pld/shared";
import {RequiredUserContextProps} from "../../../../context/UserContext";
import {OrganizationApiController} from "../../../../controller/OrganizationApiController";
import {CalendarApiController} from "../../../../controller/CalendarApiController";
import {Column, Grid, Tile} from "carbon-components-react";

export type EventProps = {
  orgId: string;
  calendarId: string;
  eventId: string;
} & RequiredUserContextProps;

export type EventState = {
  org?: Organization;
  calendar?: Calendar;
  event?: CalendarEvent;
}

export class EventComponent extends React.Component<EventProps, EventState> {

  constructor(props: EventProps) {
    super(props);
    this.state = {

    }
  }

  override componentDidMount() {
    const accessToken: string = this.props.userContext.accessToken;
    OrganizationApiController.findOrganizationById(accessToken, this.props.orgId, (org, error) => {
      if (org) {
        this.setState({org: org})
      }
    })

    CalendarApiController.getCalendar(accessToken, this.props.orgId, this.props.calendarId, (calendar, error) => {
      if (calendar) {
        this.setState({calendar: calendar})
      }
    })

    CalendarApiController.getEvent(accessToken, this.props.orgId, this.props.calendarId, this.props.eventId, (event, error) => {
      if (event) {
        this.setState({event: event})
      }
    });
  }

  private showPage() {
    if (!this.state.event || !this.state.calendar || !this.state.org)
      return;
    return (
      <Grid>
        <Column xlg={6}>
          <Tile>
            <p>{this.state.event.title}</p>
            <p>{this.state.event.description}</p>
            <p>Membres</p>
          </Tile>
        </Column>
        <Column xlg={10}>
          <Tile>

          </Tile>
        </Column>
      </Grid>
    )
  }

  override render() {
    return (
      <>
        {this.showPage()}
      </>
    )
  }

}
