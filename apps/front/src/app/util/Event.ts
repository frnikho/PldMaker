import {CalendarEvent} from "@pld/shared";
import {EventInput} from "@fullcalendar/react";
import {toast} from "react-toastify";
import {RuntimeException} from "@nestjs/core/errors/exceptions/runtime.exception";

export const parseEvents = (calendarEvent: CalendarEvent[]): EventInput[] => {
  return calendarEvent.map((event) => {
    if (event.deadline !== undefined) {
      return {
        id: event._id,
        start: event.deadline.startDate,
        end: event.deadline.endDate,
        color: `#${event.color}`,
        title: event.title,
        allDay: event.allDay,
      }
    } else if (event.date !== undefined) {
      return {
        id: event._id,
        start: event.date,
        end: event.date,
        color: `#${event.color}`,
        title: event.title,
        allDay: event.allDay,
      }
    } else {
      toast('erreur non gérer', {type: 'warning'})
      throw new RuntimeException('');
    }
  })
}
