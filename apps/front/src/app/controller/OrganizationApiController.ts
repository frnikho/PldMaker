import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {CreateOrganizationBody} from "../../../../../libs/data-access/organization/CreateOrganizationBody";
import {AxiosError} from "axios";
import {Organization} from "../../../../../libs/data-access/organization/Organization";

export type CallbackOrganizations = (orgs: Organization[], error?: ApiError) => void;
export type CallbackOrganization = (org: Organization | null, error?: ApiError) => void;

export class OrganizationApiController {

  public static getMeOrganizations(accessToken: string, callback: CallbackOrganizations) {
    api.get<Organization[]>('organization', authorize(accessToken)).then((response) => {
      callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback([], err.response?.data);
    });
  }

  public static getUserOrganizations(accessToken: string, userId: string, callback: CallbackOrganizations) {

  }

  public static findOrganizationById(accessToken: string, orgId: string, callback: CallbackOrganization) {
    api.get<Organization | null>(`organization/find/id/${orgId}`, authorize(accessToken)).then((response) => {
      callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback(null, err.response?.data ?? {error: 'Test abc', type: ErrorType.NO_USER_FOUND_EMAIL});
    })
  }

  public static createUserOrganizations(accessToken: string, body: CreateOrganizationBody, callback: CallbackOrganization) {
    api.post<Organization>('organization/create', body, authorize(accessToken)).then((response) => {
      console.log(response.data);
      callback(response.data);
    }).catch((err) => {
      console.log(err.response.data);
    });
  }

}
