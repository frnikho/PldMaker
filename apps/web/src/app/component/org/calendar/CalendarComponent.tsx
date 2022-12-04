import React, { useCallback, useEffect, useMemo, useState } from "react";
import {Calendar, CalendarEvent, Organization} from "@pld/shared";
import {Data} from "../../../util/FieldData";
import FullCalendar, {EventClickArg} from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import listGridPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { Breadcrumb, BreadcrumbItem, Button, ButtonSet } from "carbon-components-react";

import {TrashCan, CalendarAdd, Edit} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import {CalendarApiController} from "../../../controller/CalendarApiController";
import { useNavigate } from "react-router-dom";
import {parseEvents} from "../../../util/Event";
import { useAuth } from "../../../hook/useAuth";
import { useModals } from "../../../hook/useModals";
import { SelectSlotModal } from "../../../modal/org/calendar/event/SelectSlotModal";
import { CreateMeetupModal } from "../../../modal/org/calendar/event/CreateMeetupModal";
import { useLanguage } from "../../../hook/useLanguage";
import { DeleteCalendarModal } from "../../../modal/org/calendar/DeleteCalendarModal";
import { successToast } from "../../../manager/ToastManager";

type Props = {
  calendarId: string;
  orgId: string;
  calendar: Data<Calendar>;
  org: Data<Organization>;
};

type Modal = {
  selectSlot: boolean;
  meetup: boolean;
  updateCalendar: boolean;
  deleteCalendar: boolean;
}

export const CalendarComponent = (props: Props) => {

  const navigate = useNavigate();
  const userCtx = useAuth();
  const {getCurrentLanguage} = useLanguage();
  const {meetup, selectSlot, deleteCalendar, updateModals, updateAllModals} = useModals<Modal>({selectSlot: false, meetup: false, updateCalendar: false, deleteCalendar: false});
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const loadEvents = useCallback(() => {
      CalendarApiController.getEvents(userCtx.accessToken, props.orgId, props.calendarId, (events, error) => {
        if (error) {
          console.log(error);
        } else {
          setEvents(events);
        }
      });
    }, [userCtx.accessToken, props.orgId, props.calendarId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const onSlotSelected = useCallback((date: Date) => {
      updateAllModals({selectSlot: false, meetup: true, deleteCalendar: false, updateCalendar: false});
      setSelectedSlotDate(date);
    }, [updateAllModals, setSelectedSlotDate]);

  const onNewMeetupClose = (reopenSlot: boolean) => {
    console.log(reopenSlot);
    if (reopenSlot) {
      console.log('REOPEN');
      updateAllModals({meetup: false, selectSlot: true, deleteCalendar: false, updateCalendar: false});
    } else {
      updateAllModals({meetup: false, selectSlot: false, deleteCalendar: false, updateCalendar: false});
    }
  }

  const onNewMeetupCreated = () => {
    updateModals('meetup', false);
    loadEvents();
  }

  const onClickEvent = (eventArg: EventClickArg) => {
    const event: CalendarEvent | undefined = events.find((evt) => evt._id === eventArg.event.id);
    if (event === undefined)
      return;
    navigate(`event/${event._id}`);
  }

  const showModals = useMemo(() => {
    if (!props.org.value || !props.calendar.value)
      return;
    return (
      <>
        <DeleteCalendarModal org={props.org.value} calendar={props.calendar.value} open={deleteCalendar} onDismiss={() => updateModals('deleteCalendar', false)} onSuccess={() => {
          navigate(`/organization/${props.org.value!._id}`);
          successToast("Calendrier supprimer avec succès !");
        }}/>
        <SelectSlotModal org={props.org.value} open={selectSlot} onDismiss={() => updateModals('selectSlot', false)} onSuccess={(d) => onSlotSelected(d as Date)}/>
      </>
    )
  }, [onSlotSelected, selectSlot, deleteCalendar, navigate, updateModals, props.calendar.value, props.org.value]);

  return (
    <>
      {showModals}
      {props.org.value !== undefined && selectedSlotDate !== undefined ? <CreateMeetupModal calendarId={props.calendarId} date={selectedSlotDate} org={props.org.value} open={meetup} onDismiss={(reopenSlot) => onNewMeetupClose(reopenSlot as boolean)} onSuccess={onNewMeetupCreated}/> : null}
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Calendrier</BreadcrumbItem>
      </Breadcrumb>
      <Stack gap={6}>
        <Stack gap={1}>
          <h3 style={{fontWeight: 'bold'}}>{props.calendar.value?.description}</h3>
          <p>{props.calendar.value?.name}</p>
        </Stack>
        <Stack gap={2}>
          <Button style={{marginBottom: 18}} renderIcon={CalendarAdd} onClick={() => updateModals('selectSlot', true)}>Créer une réunion</Button>
        </Stack>
      </Stack>
      <div>
      </div>
      <FullCalendar
        eventClick={onClickEvent}
        aspectRatio={2}
        locale={getCurrentLanguage()}
        headerToolbar={{start: 'dayGridMonth,dayGridWeek,listWeek',  center: 'title', end: 'prev,next'}}
        footerToolbar={{right: 'prev,next'}}
        selectable={true}
        events={(arg, successCallback) => {successCallback(parseEvents(events))}}
        plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin, listGridPlugin ]}
        initialView="dayGridMonth"
      />
      <ButtonSet>
        <Button renderIcon={Edit} onClick={() => updateModals('updateCalendar', true)}>Modifier</Button>
        <Button kind={'danger'} renderIcon={TrashCan} onClick={() => updateModals('deleteCalendar', true)}>Supprimer</Button>
      </ButtonSet>
    </>
  );
};
