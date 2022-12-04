import { PersonalCalendar, SavePersonalCalendar } from "@pld/shared";
import api, { ApiError, authorize } from "../util/Api";

export type CalendarCallback = (calendar?: PersonalCalendar, error?: ApiError) => void;
export type CalendarsCallback = (calendar?: PersonalCalendar[], error?: ApiError) => void;

export class PersonalCalendarApiController {

  public static saveCalendar(accessToken: string, body: SavePersonalCalendar, callback: CalendarCallback) {
    api.put<PersonalCalendar>(`calendar`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(undefined, error);
    })
  }

  public static getCalendar(accessToken: string, callback: CalendarCallback) {
    api.get<PersonalCalendar>(`calendar`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(undefined, error);
    })
  }

  public static getUserCalendar(accessToken: string, userId: string, callback: CalendarCallback) {
    api.get<PersonalCalendar>(`calendar/user/${userId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(undefined, error);
    })
  }

  public static getOrgMembersCalendars(accessToken: string, userId: string, callback: CalendarsCallback) {
    api.get<PersonalCalendar[]>(`calendar/org/${userId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(undefined, error);
    })
  }

}
