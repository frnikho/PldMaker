import React, { useEffect, useState } from "react";
import {Calendar, CalendarEvent, Organization} from "@pld/shared";
import {Data} from "../../../util/FieldData";
import FullCalendar, {DateSelectArg, EventClickArg} from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import listGridPlugin from '@fullcalendar/list';
import interactionPlugin, {DateClickArg} from "@fullcalendar/interaction";
import { Breadcrumb, BreadcrumbItem, Button, ButtonSet, Tile } from "carbon-components-react";

import {TrashCan} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import {CalendarApiController} from "../../../controller/CalendarApiController";
import { useNavigate } from "react-router-dom";
import {parseEvents} from "../../../util/Event";
import { useAuth } from "../../../hook/useAuth";
import { useModals } from "../../../hook/useModals";
import { CreateEventModal } from "../../../modal/org/calendar/CreateEventModal";

type Props = {
  calendarId: string;
  orgId: string;
  calendar: Data<Calendar>;
  org: Data<Organization>;
};

export const CalendarComponent = (props: Props) => {

  const navigate = useNavigate();
  const userCtx = useAuth();
  const {newEvent, updateModals} = useModals({newEvent: false});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [select, setSelect] = useState<DateSelectArg | undefined>(undefined);
  const [selectDate, setSelectDate] = useState<undefined | Date>(undefined);

  useEffect(() => {
    CalendarApiController.getEvents(userCtx.accessToken, props.orgId, props.calendarId, (events, error) => {
      if (error) {
        console.log(error);
      } else {
        setEvents(events);
      }
    });
  }, []);

  const onClickNewDate = (date: DateClickArg) => {
    updateModals('newEvent', true);
    setSelect(undefined);
    setSelectDate(date.date);
  }

  const onClickNewLongEvent = () => {
    updateModals('newEvent', true);
    setSelect(undefined);
  }

  const showAction = () => {
    return (
      <Tile>
        <Button>Créer un event</Button>
        <Button>Ajouter un bot discord</Button>
      </Tile>
    );
  }

  const showSelectedDate = () => {
    if (select === undefined) {
      return;
    }
    return (
      <Tile>
        <Stack gap={2}>
          <h4>Dates sélectionnées: </h4>
          <div>
            <p>{new Date(select.start).toLocaleDateString('fr')}</p>
            <p>au</p>
            <p>{new Date(select.end).toLocaleDateString('fr')}</p>
          </div>
          <br/>
          <Button onClick={onClickNewLongEvent}>Créer un évent</Button>
          <Button kind={"ghost"} onClick={() => setSelect(undefined)}>Désélectionner les dates</Button>
        </Stack>
      </Tile>
    )
  }

  const onClickEvent = (eventArg: EventClickArg) => {
    const event: CalendarEvent | undefined = events.find((evt) => evt._id === eventArg.event.id);
    if (event === undefined)
      return;
    navigate(`event/${event._id}`);
  }

  return (
    <>
      {/*{props.org.value !== undefined && props.calendar.value !== undefined ? <NewEventModal org={props.org.value}
                                                                                            calendar={props.calendar.value}
                                                                                            userContext={userCtx}
                                                                                            open={newEvent}
                                                                                            onSuccess={(event) => {
                                                                                              updateModals('newEvent', false);
                                                                                              navigate(`event/${event._id}`);
                                                                                            }}
                                                                                            onDismiss={() => updateModals('newEvent', false)}
                                                                                            type={select ? NewEventType.LONG_EVENT : NewEventType.SIMPLE_EVENT}
                                                                                            dates={select ? [select.start, select.end] : [selectDate ?? new Date()]}/> : null}*/}
      <CreateEventModal open={newEvent} onDismiss={() => updateModals('newEvent', false)} onSuccess={() => null}/>
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Calendrier</BreadcrumbItem>
      </Breadcrumb>
      <h4 style={{fontWeight: 'bold', fontSize: 26}}>{props.org.value?.name}</h4>
      <p style={{marginBottom: 18}}>{props.calendar.value?.name}</p>
      <div>

      </div>
      <FullCalendar
        eventClick={onClickEvent}
        aspectRatio={2}
        headerToolbar={{start: 'dayGridMonth,dayGridWeek,listWeek',  center: 'title', end: 'prev,next'}}
        footerToolbar={{right: 'prev,next'}}
        selectable={true}
        events={(arg, successCallback) => {successCallback(parseEvents(events))}}
        editable={true}
        dateClick={(arg) => {onClickNewDate(arg)}}
        select={(arg) => {
          const diffDays = Math.ceil(Math.abs(arg.end.getTime() - arg.start.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 1)
            return;
          setSelect(arg);
          updateModals('newEvent', true);
        }}
        locale={'fr'}
        plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin, listGridPlugin ]}
        initialView="dayGridMonth"
      />
      <ButtonSet>
        <Button kind={'danger'} renderIcon={TrashCan}>Supprimer</Button>
      </ButtonSet>
    </>
  );
};
