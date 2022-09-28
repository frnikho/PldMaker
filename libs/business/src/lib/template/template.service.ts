import { Injectable } from '@nestjs/common';
import { Template, UpdateTemplateBody } from "@pld/shared";
import { TemplateHelper } from "./template.helper";
import { NewTemplateBody, Organization, User } from "@pld/shared";

@Injectable()
export class TemplateService {

  constructor(private templateHelper: TemplateHelper) {}

  public getOrgTemplate(user: User, org: Organization) {
    return this.templateHelper.getOrgTemplate(user, org);
  }

  public getTemplate(user: User, org: Organization, template: Template) {
    return template;
  }

  public async create(user: User, org: Organization, body: NewTemplateBody) {
    return this.templateHelper.create(user, org, body);
  }

  public update(user: User, org: Organization, template: Template, body: UpdateTemplateBody) {
    return this.templateHelper.update(user, org, template, body);
  }

  public delete(user: User, org: Organization, template: Template) {
    return this.templateHelper.delete(user, org, template);
  }

}
