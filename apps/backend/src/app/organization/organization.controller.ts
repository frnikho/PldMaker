import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import {OrganizationService} from "./organization.service";
import { CreateOrganizationBody, Organization, RemoveUserOrgBody, UpdateOrganizationBody } from "@pld/shared";
import {
  InviteUserOrgBody,
} from "@pld/shared";
import { OrganizationPipe } from "./organization.pipe";

@Controller('organization')
export class OrganizationController {

  constructor(private orgService: OrganizationService) {}

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

  @Patch(':orgId/update')
  public async update(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: UpdateOrganizationBody) {
    return this.orgService.updateByBody(req.user, org, body);
  }

  @Delete(':orgId/delete')
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

}
