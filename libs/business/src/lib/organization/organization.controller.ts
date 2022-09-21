import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import {OrganizationService} from "./organization.service";
import {
  CreateOrganizationBody,
  MigrateOrganizationBody,
  Organization,
  OrganizationSection,
  OrganizationSectionBody,
  OrganizationSectionUpdateBody,
  RemoveUserOrgBody,
  UpdateOrganizationBody
} from "@pld/shared";
import {
  InviteUserOrgBody,
} from "@pld/shared";
import { OrganizationPipe } from "./organization.pipe";
import { OrganizationSectionService } from "./section/organization-section.service";
import { OrganizationSectionPipe } from "./section/organization-section.pipe";

@Controller('organization')
export class OrganizationController {

  constructor(private orgService: OrganizationService, private orgSectionService: OrganizationSectionService) {}

  @Get()
  public async get(@Request() req) {
    return this.orgService.getUserOrg(req.user);
  }

  @Post('create')
  public async create(@Request() req, @Body() body: CreateOrganizationBody) {
    return this.orgService.createByBody(req.user, body);
  }

  @Get(':orgId')
  public async getOrg(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.orgService.getOrg(req.user, org);
  }

  @Patch(':orgId')
  public async update(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: UpdateOrganizationBody) {
    return this.orgService.updateByBody(req.user, org, body);
  }

  @Delete(':orgId')
  public async delete(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.orgService.deleteWithBody(req.user, org);
  }

  @Post(':orgId/invite')
  public async addMember(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() orgBody: InviteUserOrgBody) {
    return this.orgService.addMemberByEmail(req.user, org, orgBody);
  }

  @Post(':orgId/revoke')
  public async removeMember(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: RemoveUserOrgBody) {
    return this.orgService.removeMember(req.user, org, body);
  }

  @Get(':orgId/section')
  public async getSections(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.orgSectionService.getSections(req.user, org);
  }

  @Post(':orgId/section')
  public async createSection(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: OrganizationSectionBody) {
    return this.orgSectionService.createSection(req.user, org, body);
  }

  @Patch(':orgId/section/:sectionId')
  public async updateSection(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('sectionId', OrganizationSectionPipe) section: OrganizationSection, @Body() body: OrganizationSectionUpdateBody) {
    return this.orgSectionService.updateSection(req.user, org, section, body);
  }

  @Delete(':orgId/section/:sectionId')
  public async removeSection(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('sectionId', OrganizationSectionPipe) section: OrganizationSection) {
    return this.orgSectionService.deleteSection(req.user, org, section);
  }

  @Post(':orgId/migrate')
  public async migrate(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: MigrateOrganizationBody) {
    return this.orgService.migrate(req.user, org, body);
  }

}
