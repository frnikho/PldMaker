import { NewTemplateBody, Template, UpdateTemplateBody } from "@pld/shared";
import api, { ApiError, authorize } from "../util/Api";
import { AxiosError } from "axios";

export type CallbackTemplate = (template: Template | null, error?: ApiError) => void;
export type CallbackTemplates = (templates: Template[], error?: ApiError) => void;

export class TemplateApiController {

  public static getTemplates(accessToken: string, orgId: string, callback: CallbackTemplates) {
    api.get<Template[]>(`organization/${orgId}/template/`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback([], err?.response?.data)
    })
  }

  public static getTemplate(accessToken: string, orgId: string, templateId: string, callback: CallbackTemplate) {
    api.get<Template>(`organization/${orgId}/template/${templateId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err?.response?.data)
    })
  }

  public static createTemplate(accessToken: string, orgId: string, body: NewTemplateBody, callback: CallbackTemplate) {
    api.post<Template>(`organization/${orgId}/template/`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err?.response?.data)
    })
  }

  public static updateTemplate(accessToken: string, orgId: string, templateId: string, body: UpdateTemplateBody, callback: CallbackTemplate) {
    api.patch<Template>(`organization/${orgId}/template/${templateId}`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err?.response?.data)
    });
  }

  public static deleteTemplate(accessToken: string, orgId: string, templateId: string, callback: CallbackTemplate) {
    api.delete<Template>(`organization/${orgId}/template/${templateId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err?.response?.data)
    });
  }

}
