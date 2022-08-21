import {PldOrgCreateBody, PldOrgFindsBody, CreatePldRevisionBody, Pld, PldUpdateBody} from "@pld/shared";
import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {AxiosError} from "axios";

export type PldCallback = (pld: Pld | null, error?: ApiError) => void
export type PldsCallback = (pld: Pld[], error?: ApiError) => void

export class PldApiController {

  public static createOrgPld(accessToken: string, body: PldOrgCreateBody, callback: PldCallback) {
    api.post<Pld>(`pld/organization/create`, body, authorize(accessToken)).then((response) => {
      callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        callback(null, err.response.data);
      callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static findOrgPld(accessToken: string, orgId: string, callback: PldsCallback) {
    api.get<Pld[]>(`pld/organization/find/${orgId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback([], err.response.data);
      return callback([], {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static getAllOrgPld(accessToken: string, orgId: string[], callback: PldsCallback) {
    api.post<Pld[]>(`pld/finds/`, new PldOrgFindsBody(orgId), authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback([], err.response.data);
      return callback([], {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static findPld(accessToken: string, pldId: string, callback: PldCallback) {
    api.get<Pld>(`pld/find/${pldId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data);
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static addRevision(accessToken: string, pldId: string, body: CreatePldRevisionBody, callback: PldCallback) {
    api.post(`pld/${pldId}/revision`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data);
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    })
  }

  public static updatePld(accessToken: string, body: PldUpdateBody, callback: PldCallback) {
    api.post<Pld>(`pld/update`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      if (err.response?.data !== undefined)
        return callback(null, err.response.data);
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    })
  }

}
