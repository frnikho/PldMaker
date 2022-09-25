import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {
  CreateOrganizationBody,
  Organization,
  InviteUserOrgBody,
  UpdateOrganizationBody,
  RemoveUserOrgBody,
  OrganizationSectionBody,
  OrganizationSection,
  OrganizationSectionUpdateBody, MigrateOrganizationBody, DodStatus, NewDodStatus, UpdateDodStatus
} from "@pld/shared";
import {AxiosError} from "axios";

export type CallbackOrganization = (org: Organization | null, error?: ApiError) => void;
export type CallbackOrganizations = (orgs: Organization[], error?: ApiError) => void;

export type CallbackOrganizationSection = (section: OrganizationSection | null, error?: ApiError) => void;
export type CallbackOrganizationSections = (section: OrganizationSection[], error?: ApiError) => void;

export type CallbackDodStatus = (dodStatus: DodStatus | null, error?: ApiError) => void;
export type CallbackDodsStatus = (dodStatus: DodStatus[], error?: ApiError) => void;

export class OrganizationApiController {

  public static getMeOrganizations(accessToken: string, callback: CallbackOrganizations) {
    api.get<Organization[]>('organization', authorize(accessToken)).then((response) => {
      callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback([], err.response?.data);
    });
  }

  public static inviteUser(accessToken: string, orgId: string, inviteBody: InviteUserOrgBody, callback: CallbackOrganization) {
    api.post<Organization>(`organization/${orgId}/invite`, inviteBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback(null, err.response?.data);
    });
  }

  public static revokeUser(accessToken: string, orgId: string, revokeBody: RemoveUserOrgBody, callback: CallbackOrganization) {
    api.post<Organization>(`organization/${orgId}/revoke`, revokeBody, authorize(accessToken)).then((response) => {
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
    api.patch<Organization>(`organization/${body.orgId}`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static createOrgSection(accessToken: string, orgId: string, body: OrganizationSectionBody, callback: CallbackOrganizationSection) {
    api.post<OrganizationSection>(`organization/${orgId}/section`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err) => {
      return callback(null, {type: ErrorType.API_ERROR, message: err.response.data.message});
    });
  }

  public static updateOrgSection(accessToken: string, orgId: string, sectionId: string, body: OrganizationSectionUpdateBody, callback: CallbackOrganizationSection) {
    api.patch<OrganizationSection>(`organization/${orgId}/section/${sectionId}`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((er) => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static getOrgSections(accessToken: string, orgId: string, callback: CallbackOrganizationSections) {
    api.get<OrganizationSection[]>(`organization/${orgId}/section`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback([], {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static deleteOrgSection(accessToken: string, orgId: string, sectionId: string, callback: CallbackOrganizationSection) {
    api.delete<OrganizationSection>(`organization/${orgId}/section/${sectionId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static deleteOrg(accessToken: string, orgId: string, callback: CallbackOrganization) {
    api.delete<Organization>(`organization/${orgId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['An error occurred !']});
    });
  }

  public static migrateOrg(accessToken: string, orgId: string, body: MigrateOrganizationBody, callback: CallbackOrganization) {
    api.post<Organization>(`organization/${orgId}/migrate`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch(() => {
      return callback(null, {type: ErrorType.UNAUTHORIZED, message: ['Vous n\'avez les privilèges requit !']});
    });
  }

  public static getOrgDodStatus(accessToken: string, orgId: string, callback: CallbackDodsStatus) {
    api.get<DodStatus[]>(`organization/${orgId}/status/`, authorize(accessToken)).then((response) => {
      return callback(response.data)
    }).catch(() => {
      return callback([], {type: ErrorType.API_ERROR, message: ['Une erreur est survenue !']});
    })
  }

  public static updateOrgDodStatus(accessToken: string, orgId: string, statusId: string, body: UpdateDodStatus, callback: CallbackDodStatus) {
    api.patch<DodStatus>(`organization/${orgId}/status/${statusId}`, body, authorize(accessToken)).then((response) => {
      return callback(response.data)
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['Une erreur est survenue !']});
    })
  }

  public static createOrgDodStatus(accessToken: string, orgId: string, body: NewDodStatus, callback: CallbackDodStatus) {
    api.post<DodStatus>(`organization/${orgId}/status/`, body, authorize(accessToken)).then((response) => {
      return callback(response.data)
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['Une erreur est survenue !']});
    })
  }

  public static deleteOrgDodStatus(accessToken: string, orgId: string, dodStatusId: string, callback: CallbackDodStatus) {
    api.delete<DodStatus>(`organization/${orgId}/status/${dodStatusId}`, authorize(accessToken)).then((response) => {
      return callback(response.data)
    }).catch(() => {
      return callback(null, {type: ErrorType.API_ERROR, message: ['Une erreur est survenue !']});
    })
  }

}
