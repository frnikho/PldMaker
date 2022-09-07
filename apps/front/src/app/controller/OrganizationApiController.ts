import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {CreateOrganizationBody, Organization, InviteUserOrgBody, ManageMembersOrganizationBody, UpdateOrganizationBody} from "@pld/shared";
import {AxiosError} from "axios";

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

  public static inviteUser(accessToken: string, inviteBody: InviteUserOrgBody, callback: CallbackOrganization) {
    api.post<Organization>('organization/invite', inviteBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback(null, err.response?.data);
    });
  }

  public static revokeUser(accessToken: string, revokeBody: ManageMembersOrganizationBody, callback: CallbackOrganization) {
    api.post<Organization>('organization/revoke', revokeBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback(null, err.response?.data);
    });
  }

  public static findOrganizationById(accessToken: string, orgId: string, callback: CallbackOrganization) {
    api.get<Organization | null>(`organization/${orgId}`, authorize(accessToken)).then((response) => {
      callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback(null, err.response?.data ?? {message: ['Test abc'], type: ErrorType.NO_USER_FOUND_EMAIL});
    })
  }

  public static createUserOrganizations(accessToken: string, body: CreateOrganizationBody, callback: CallbackOrganization) {
    api.post<Organization>('organization/create', body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static updateOrg(accessToken: string, body: UpdateOrganizationBody, callback: CallbackOrganization) {
    api.patch<Organization>(`organization/${body.orgId}/update`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

}
