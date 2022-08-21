import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {AxiosError} from "axios";
import {UpdateDodStatusBody, Dod, DodCreateBody, DodFindPldBody} from "@pld/shared";

export type CallbackDod = (dod: Dod | null, error?: ApiError) => void;
export type CallbackDods = (dod: Dod[], error?: ApiError) => void;

export class DodApiController {

  public static createDod(accessToken: string, dodBody: DodCreateBody, callback: CallbackDod) {
    api.post<Dod>(`dod/create`, dodBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

  public static updateDod(accessToken: string, dodId: string, dodBody: DodCreateBody, callback: CallbackDod) {
    api.post(`dod/${dodId}/update`, dodBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    });
  }

  public static findDodWithPld(accessToken: string, pldId: string, callback: CallbackDods) {
    api.get<Dod[]>(`dod/find/pld/${pldId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback([], err.response.data)
      return callback([], {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

  public static findDods(accessToken: string, pldId: string[], callback: CallbackDods) {
    api.post<Dod[]>(`dod/finds`, new DodFindPldBody(pldId), authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback([], err.response.data)
      return callback([], {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

  public static deleteDod(accessToken: string, dodId: string, callback: CallbackDod) {
    api.delete<Dod>(`dod/delete/id/${dodId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

  public static updateDodStatus(accessToken: string, body: UpdateDodStatusBody, callback: CallbackDod) {
    api.post<Dod>(`dod/update/status`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data)
      return callback(null, {message: ['An error occurred '], type: ErrorType.API_ERROR});
    })
  }

}
