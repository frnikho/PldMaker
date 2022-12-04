import { Calendar, CalendarEvent, NewCalendarBody, NewCalendarEvent, EventUpdateMemberStatusBody, EventManageMemberBody, EventUpdateBody } from "@pld/shared";
import api, {ApiError, authorize} from "../util/Api";

export type CallbackCalendar = (calendar: Calendar | null, error?: ApiError) => void;
export type CallbackCalendars = (calendar: Calendar[], error?: ApiError) => void;

export type CallbackEvent = (event: CalendarEvent | null, error?: ApiError) => void;
export type CallbackEvents = (event: CalendarEvent[], error?: ApiError) => void;


export class CalendarApiController {

  public static createCalendar(accessToken: string, orgId: string, body: NewCalendarBody, callback: CallbackCalendar) {
    api.post<Calendar>(`organization/${orgId}/calendar/new`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(null, error);
    })
  }

  public static createEvent(accessToken: string, orgId: string, calendarId: string, body: NewCalendarEvent, callback: CallbackEvent) {
    api.post<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(null, error);
    })
  }

  public static getEvents(accessToken: string, orgId: string, calendarId: string, callback: CallbackEvents) {
    api.get<CalendarEvent[]>(`organization/${orgId}/calendar/${calendarId}/event`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback([], error);
    })
  }

  public static getCalendars(accessToken: string, orgId: string, callback: CallbackCalendars) {
    api.get<Calendar[]>(`organization/${orgId}/calendar`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback([], err);
    });
  }

  public static getCalendar(accessToken: string, orgId: string, calendarId: string, callback: CallbackCalendar) {
    api.get<Calendar>(`organization/${orgId}/calendar/${calendarId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static getEvent(accessToken: string, orgId: string, calendarId: string, eventId: string, callback: CallbackEvent) {
    api.get<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event/${eventId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static updateMembersStatus(accessToken: string, orgId: string, calendarId: string, eventId: string, body: EventUpdateMemberStatusBody, callback: CallbackEvent) {
    api.patch<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event/${eventId}/member`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static inviteMembersStatus(accessToken: string, orgId: string, calendarId: string, eventId: string, body: EventManageMemberBody, callback: CallbackEvent) {
    api.post<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event/${eventId}/member/add`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static revokeMembersStatus(accessToken: string, orgId: string, calendarId: string, eventId: string, body: EventManageMemberBody, callback: CallbackEvent) {
    api.post<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event/${eventId}/member/revoke`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static update(accessToken: string, orgId: string, calendarId: string, eventId: string, body: EventUpdateBody, callback: CallbackEvent) {
    api.patch<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event/${eventId}`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static deleteEvent(accessToken: string, orgId: string, calendarId: string, eventId: string, callback: CallbackEvent) {
    api.delete<CalendarEvent>(`organization/${orgId}/calendar/${calendarId}/event/${eventId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

  public static deleteCalendar(accessToken: string, orgId: string, calendarId: string, callback: CallbackCalendar) {
    api.delete<Calendar>(`organization/${orgId}/calendar/${calendarId}/`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback(null, err);
    });
  }

}
