import React from "react";
import {Calendar, CalendarEvent, Organization} from "@pld/shared";
import {Data} from "../../../util/FieldData";
import FullCalendar, {DateSelectArg, EventClickArg} from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import listGridPlugin from '@fullcalendar/list';
import interactionPlugin, {DateClickArg} from "@fullcalendar/interaction";
import { Breadcrumb, BreadcrumbItem, Button, Column, Grid, Tile } from "carbon-components-react";
import {NewEventModal, NewEventType} from "../../../modal/org/calendar/NewEventModal";

import {Stack} from '@carbon/react';
import {RequiredUserContextProps} from "../../../context/UserContext";
import {CalendarApiController} from "../../../controller/CalendarApiController";
import {Navigate} from "react-router-dom";
import {parseEvents} from "../../../util/Event";

export type CalendarProps = {
  calendarId: string;
  orgId: string;
  calendar: Data<Calendar>;
  org: Data<Organization>;
} & RequiredUserContextProps;

export type CalendarState = {
  select?: DateSelectArg;
  modal: boolean;
  selectedDate?: Date;
  events: CalendarEvent[];
  redirectUrl?: string;
}

export class CalendarComponent extends React.Component<CalendarProps, CalendarState> {

  constructor(props: CalendarProps) {
    super(props);
    this.state = {
      select: undefined,
      selectedDate: undefined,
      modal: false,
      events: [],
    }
    this.showSelectedDate = this.showSelectedDate.bind(this);
    this.onClickNewLongEvent = this.onClickNewLongEvent.bind(this);
    this.onClickNewDate = this.onClickNewDate.bind(this);
    this.onClickEvent = this.onClickEvent.bind(this);
  }

  override componentDidMount() {
    CalendarApiController.getEvents(this.props.userContext.accessToken, this.props.orgId, this.props.calendarId, (events, error) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({
          events: events
        })
      }
    });
  }

  private onClickNewDate(date: DateClickArg) {
    this.setState({
      modal: true,
      select: undefined,
      selectedDate: date.date,
    })
  }

  private onClickNewLongEvent() {
    this.setState({
      modal: true,
      select: undefined,
    })
  }

  private showAction() {
    return (
      <Tile>
        <Button>Créer un event</Button>
        <Button>Ajouter un bot discord</Button>
      </Tile>
    );
  }

  private showSelectedDate() {
    if (this.state.select === undefined) {
      return;
    }
    return (
      <Tile>
        <Stack gap={2}>
          <h4>Dates sélectionnées: </h4>
          <div>
            <p>{new Date(this.state.select.start).toLocaleDateString('fr')}</p>
            <p>au</p>
            <p>{new Date(this.state.select.end).toLocaleDateString('fr')}</p>
          </div>
          <br/>
          <Button onClick={this.onClickNewLongEvent}>Créer un évent</Button>
          <Button kind={"ghost"} onClick={() => this.setState({select: undefined})}>Désélectionner les dates</Button>
        </Stack>
      </Tile>
    )
  }

  private showModal() {
    if (this.props.org.value === undefined || this.props.calendar.value === undefined)
      return;
    return (<NewEventModal org={this.props.org.value}
                           calendar={this.props.calendar.value}
                           userContext={this.props.userContext}
                           open={this.state.modal}
                           onSuccess={(event) => this.setState({redirectUrl: `event/${event._id}`, modal: false})}
                           onDismiss={() => this.setState({modal: false})}
                           type={this.state.select ? NewEventType.LONG_EVENT : NewEventType.SIMPLE_EVENT}
                           dates={this.state.select ? [this.state.select.start, this.state.select.end] : [this.state.selectedDate ?? new Date()]}/>);

  }

  private onClickEvent(eventArg: EventClickArg) {
    const event: CalendarEvent | undefined = this.state.events.find((evt) => evt._id === eventArg.event.id);
    if (event === undefined)
      return;
    this.setState({redirectUrl: `event/${event._id}`});
  }

  override render() {
    return (
      <>
        {this.state.redirectUrl !== undefined ? <Navigate to={this.state.redirectUrl}/> : null}
        {this.showModal()}
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: `/`})}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: `/organization/${this.props.orgId}`})}>{this.props.org.value?.name ?? "Organisation"}</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Calendrier</BreadcrumbItem>
        </Breadcrumb>
        <h4 style={{fontWeight: 'bold', fontSize: 26}}>{this.props.org.value?.name}</h4>
        <p style={{marginBottom: 18}}>{this.props.calendar.value?.name}</p>
        <FullCalendar
          eventClick={this.onClickEvent}
          aspectRatio={1.5}
          headerToolbar={{start: 'dayGridMonth,dayGridWeek,listWeek',  center: 'title', end: 'prev,next'}}
          footerToolbar={{right: 'prev,next'}}
          selectable={true}
          events={(arg, successCallback) => {successCallback(parseEvents(this.state.events))}}
          editable={true}
          dateClick={(arg) => {this.onClickNewDate(arg)}}
          select={(arg) => {
            const diffDays = Math.ceil(Math.abs(arg.end.getTime() - arg.start.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1)
              return;
            this.setState({
              select: arg,
              modal: true,
            })
          }}
          locale={'fr'}
          plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin, listGridPlugin ]}
          initialView="dayGridMonth"
        />
      </>
    )
  }

}
