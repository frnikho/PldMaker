import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import {OrganizationService} from "./organization.service";
import {
  CreateOrganizationBody, DodStatus,
  MigrateOrganizationBody, NewDodStatus,
  Organization,
  OrganizationSection,
  OrganizationSectionBody,
  OrganizationSectionUpdateBody,
  RemoveUserOrgBody, UpdateDodStatus,
  UpdateOrganizationBody
} from "@pld/shared";
import {
  InviteUserOrgBody,
} from "@pld/shared";
import { OrganizationPipe } from "./organization.pipe";
import { OrganizationSectionService } from "./section/organization-section.service";
import { OrganizationSectionPipe } from "./section/organization-section.pipe";
import { DodStatusService } from "../dod/status/dod-status.service";
import { DodStatusPipe } from "../dod/status/dod-status.pipe";

@Controller('organization')
export class OrganizationController {

  constructor(private orgService: OrganizationService, private orgSectionService: OrganizationSectionService, private dodStatusService: DodStatusService) {}

  @Get()
  public get(@Request() req) {
    return this.orgService.getUserOrg(req.user);
  }

  @Post('create')
  public create(@Request() req, @Body() body: CreateOrganizationBody) {
    return this.orgService.createByBody(req.user, body);
  }

  @Get(':orgId')
  public getOrg(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.orgService.getOrg(req.user, org);
  }

  @Patch(':orgId')
  public update(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: UpdateOrganizationBody) {
    return this.orgService.updateByBody(req.user, org, body);
  }

  @Delete(':orgId')
  public delete(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.orgService.deleteWithBody(req.user, org);
  }

  @Post(':orgId/invite')
  public addMember(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() orgBody: InviteUserOrgBody) {
    return this.orgService.addMemberByEmail(req.user, org, orgBody);
  }

  @Post(':orgId/revoke')
  public removeMember(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: RemoveUserOrgBody) {
    return this.orgService.removeMember(req.user, org, body);
  }

  @Get(':orgId/section')
  public getSections(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.orgSectionService.getSections(req.user, org);
  }

  @Post(':orgId/section')
  public createSection(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: OrganizationSectionBody) {
    return this.orgSectionService.createSection(req.user, org, body);
  }

  @Patch(':orgId/section/:sectionId')
  public updateSection(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('sectionId', OrganizationSectionPipe) section: OrganizationSection, @Body() body: OrganizationSectionUpdateBody) {
    return this.orgSectionService.updateSection(req.user, org, section, body);
  }

  @Delete(':orgId/section/:sectionId')
  public removeSection(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('sectionId', OrganizationSectionPipe) section: OrganizationSection) {
    return this.orgSectionService.deleteSection(req.user, org, section);
  }

  @Post(':orgId/migrate')
  public migrate(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: MigrateOrganizationBody) {
    return this.orgService.migrate(req.user, org, body);
  }

  @Get(':orgId/status')
  public getDodStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.dodStatusService.getDodStatus(req.user, org);
  }

  @Post(':orgId/status')
  public createDodStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: NewDodStatus) {
    return this.dodStatusService.createDodStatus(req.user, org, body);
  }

  @Delete(':orgId/status/:statusId')
  public deleteDodStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('statusId', DodStatusPipe) status: DodStatus) {
    return this.dodStatusService.deleteDodStatus(req.user, org, status);
  }

  @Patch(':orgId/status/:statusId')
  public updateDodStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('statusId', DodStatusPipe) status: DodStatus, @Body() body: UpdateDodStatus) {
    return this.dodStatusService.updateDodStatus(req.user, org, status, body);
  }
}
