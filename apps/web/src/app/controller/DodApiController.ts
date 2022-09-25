import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {AxiosError} from "axios";
import { Dod, DodCreateBody, DodFindPldBody, DodStatus, DodUpdateBody, SetDodStatus } from "@pld/shared";

export type CallbackDod = (dod: Dod | null, error?: ApiError) => void;
export type CallbackDods = (dod: Dod[], error?: ApiError) => void;

export class DodApiController {

  public static createDod(accessToken: string, orgId: string, pldId: string, body: DodCreateBody, callback: CallbackDod) {
    api.post<Dod>(`organization/${orgId}/pld/${pldId}/dod`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

  public static updateDod(accessToken: string, orgId: string, pldId: string, dodId: string, dodBody: DodUpdateBody, callback: CallbackDod) {
    api.patch(`organization/${orgId}/pld/${pldId}/dod/${dodId}/`, dodBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    });
  }

  public static findDodWithPld(accessToken: string, orgId: string, pldId: string, callback: CallbackDods) {
    api.get<Dod[]>(`organization/${orgId}/pld/${pldId}/dod`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback([], err.response.data)
      return callback([], {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

  public static updateDodStatus(accessToken: string, orgId: string, pldId: string, dodId: string, body: SetDodStatus, callback: CallbackDod) {
    api.patch<Dod>(`organization/${orgId}/pld/${pldId}/dod/${dodId}/status`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    });
  }

  public static deleteDod(accessToken: string, orgId: string, pldId: string, dodId: string, callback: CallbackDod) {
    api.delete<Dod>(`organization/${orgId}/pld/${pldId}/dod/${dodId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }
}
