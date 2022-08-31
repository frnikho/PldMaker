import {Calendar, NewCalendarBody} from "@pld/shared";
import api, {ApiError, authorize} from "../util/Api";

export type CallbackCalendar = (calendar: Calendar | null, error?: ApiError) => void;
export type CallbackCalendars = (calendar: Calendar[], error?: ApiError) => void;

export class CalendarApiController {

  public static createCalendar(accessToken: string, orgId: string, body: NewCalendarBody, callback: CallbackCalendar) {
    api.post<Calendar>(`organization/${orgId}/calendar/new`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((error: ApiError) => {
      return callback(null, error);
    })
  }

  public static getCalendars(accessToken: string, orgId: string, callback: CallbackCalendars) {
    api.get<Calendar[]>(`organization/${orgId}/calendar`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: ApiError) => {
      return callback([], err);
    });
  }
}
