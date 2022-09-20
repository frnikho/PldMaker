import React from "react";
import { Calendar, CalendarEvent, CalendarMemberStatus, Organization } from "@pld/shared";
import { RequiredUserContextProps } from "../../../../context/UserContext";
import { OrganizationApiController } from "../../../../controller/OrganizationApiController";
import { CalendarApiController } from "../../../../controller/CalendarApiController";
import { Breadcrumb, BreadcrumbItem, Button, Column, Grid } from "carbon-components-react";
import { Navigate } from "react-router-dom";
import { formatAllDayEventDate, formatLongDate, formatLongDayEventDate, formatShortDate } from "@pld/utils";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { CheckmarkFilled, Misuse, HelpFilled, Edit, TrashCan, Events} from "@carbon/icons-react";


export type EventProps = {
  orgId: string;
  calendarId: string;
  eventId: string;
} & RequiredUserContextProps;

export type EventState = {
  org?: Organization;
  calendar?: Calendar;
  event?: CalendarEvent;
  redirectUrl?: string;
}

export class EventComponent extends React.Component<EventProps, EventState> {

  constructor(props: EventProps) {
    super(props);
    this.state = {
      redirectUrl: undefined,
    }
  }

  override componentDidMount() {
    const accessToken: string = this.props.userContext.accessToken;
    OrganizationApiController.findOrganizationById(accessToken, this.props.orgId, (org, error) => {
      if (org) {
        this.setState({org: org})
      } else {
        toast(error?.message[0], {type: 'error'});
      }
    })

    CalendarApiController.getCalendar(accessToken, this.props.orgId, this.props.calendarId, (calendar, error) => {
      if (calendar) {
        this.setState({calendar: calendar})
      } else {
        toast(error?.message[0], {type: 'error'});
      }
    })

    CalendarApiController.getEvent(accessToken, this.props.orgId, this.props.calendarId, this.props.eventId, (event, error) => {
      if (event) {
        this.setState({event: event})
      } else {
        toast(error?.message[0], {type: 'error'});
      }
    });
  }

  private showUserIcon(member: CalendarMemberStatus) {
    if (member === CalendarMemberStatus.Declined) {
      return (<Misuse color={'red'}/>)
    } else if (member === CalendarMemberStatus.Accepted) {
      return (<CheckmarkFilled color={'green'}/>)
    } else {
      return (<HelpFilled/>)
    }
  }

  private showMembers() {
    return this.state.event?.invitedMembers.map((a) => {
      return (<>
        {a.user.firstname} {a.user.lastname.toUpperCase()} {this.showUserIcon(a.status)}
        </>);
    })
  }

  private showPage() {
    if (!this.state.event || !this.state.calendar || !this.state.org)
      return;
    return (
      <Grid>
        <Column xlg={4}>
          <h4 style={{fontWeight: 'bold', fontSize: 26}}>{this.state.event?.title}</h4>
          <h4 style={{fontSize: 24}}>{this.getEventDates()}</h4>
          <p style={{fontWeight: 'bold', fontSize: 20, marginTop: 28}}>Membres</p>
          {this.showMembers()}
        </Column>
        <Column xlg={10}>
          <ReactMarkdown>
            {this.state.event.description}
          </ReactMarkdown>
          Créer par {this.state.event.owner.firstname} {this.state.event.owner.lastname.toUpperCase()} le {formatLongDate(new Date(this.state.event.createdDate))}
        </Column>
        <Column xlg={2}>
          <Button iconDescription={'Inviter des membres'} renderIcon={Events} kind={'ghost'} hasIconOnly/>
          <Button iconDescription={'Modifier'} renderIcon={Edit} kind={'ghost'} hasIconOnly/>
          <Button iconDescription={'Supprimer'} renderIcon={TrashCan} kind={'danger'} hasIconOnly/>
        </Column>
      </Grid>
    )
  }

  private getEventDates() {
    const event = this.state.event;
    if (event === undefined)
      return '';
    if (event.date !== undefined) {
      if (event.allDay) {
        return formatShortDate(new Date(event.date));
      } else {
        return formatLongDate(new Date(event.date));
      }
    } else if (event.deadline !== undefined) {
      if (event.allDay)
        return <p style={{fontSize: 24}}>{formatAllDayEventDate(new Date(event.deadline.startDate))}<br/>{formatAllDayEventDate(new Date(event.deadline.endDate))}</p>;
      return <p style={{fontSize: 24}}>{formatLongDayEventDate(new Date(event.deadline.startDate))}<br/>{formatLongDayEventDate(new Date(event.deadline.endDate))}</p>;
    }
    return '';
  }

  override render() {
    return (
      <>
        {this.state.redirectUrl !== undefined ? <Navigate to={this.state.redirectUrl}/> : null}
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: `/`})}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: `/organization/${this.props.orgId}`})}>{this.state.org?.name ?? "Organisation"}</BreadcrumbItem>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: `/organization/${this.props.orgId}/calendar/${this.props.calendarId}`})}>Calendrier</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Event</BreadcrumbItem>
        </Breadcrumb>
        {this.showPage()}
      </>
    )
  }

}
