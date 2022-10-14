import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import {TemplateService} from "./template.service";
import { OrganizationPipe } from "../organization/organization.pipe";
import { NewTemplateBody, Organization, Template, UpdateTemplateBody } from "@pld/shared";
import { TemplatePipe } from "./template.pipe";

@Controller('organization/:orgId/template')
export class TemplateController {

  constructor(private service: TemplateService) {}

  @Get()
  public getOrgTemplate(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.service.getOrgTemplate(req.user, org);
  }

  @Get(':templateId')
  public getTemplate(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('templateId', TemplatePipe) template: Template) {
    return this.service.getTemplate(req.user, org, template);
  }

  @Post()
  public async create(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: NewTemplateBody) {
    return this.service.create(req.user, org, body);
  }

  @Patch(':templateId')
  public async update(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('templateId', TemplatePipe) template: Template, @Body() body: UpdateTemplateBody) {
    return this.service.update(req.user, org, template, body);
  }

  @Delete(':templateId')
  public delete(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('templateId', TemplatePipe) template: Template) {
    return this.service.delete(req.user, org, template);
  }

}
