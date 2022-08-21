import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {OrganizationService} from "./organization.service";
import {CreateOrganizationBody} from "@pld/shared";
import {
  InviteUserOrgBody,
  ManageMembersOrganizationBody
} from "@pld/shared";
import {UpdateOrganizationBody} from "@pld/shared";
import {DeleteOrganizationBody} from "@pld/shared";
import {ObjectIDPipe} from "../ObjectID.pipe";
import {EventEmitter2} from "@nestjs/event-emitter";

@Controller('organization')
export class OrganizationController {

  constructor(private orgService: OrganizationService, private eventEmitter: EventEmitter2) {
  }

  @Post('create')
  public async create(@Request() req, @Body() orgBody: CreateOrganizationBody) {
    return this.orgService.createByBody(orgBody, req.user._id);
  }

  @Post('update')
  public async update(@Request() req, @Body() body: UpdateOrganizationBody) {
    this.eventEmitter.emit('Org:Update', body.orgId);
    return this.orgService.updateByBody(req.user._id, body);
  }

  @Post('delete')
  public async delete(@Request() req, @Body() body: DeleteOrganizationBody) {
    return this.orgService.deleteByBody(req.user, body);
  }

  @Get(['', 'get'])
  public async get(@Request() req) {
    return this.orgService.findOrgsByAuthorAndMembers(req.user._id);
  }

  @Get('find/id/:orgId')
  public async getOrg(@Request() req, @Param('orgId', new ObjectIDPipe()) orgId: string) {
    return this.orgService.find(orgId);
  }

  @Get('find/name/:orgName')
  public async findOrgName(@Param('orgName') orgName: string) {
    //TODO finish function controller
  }

  @Post('invite')
  public async addMember(@Request() req, @Body() orgBody: InviteUserOrgBody) {
    this.eventEmitter.emit('Org:Update', orgBody.orgId);
    return this.orgService.addMembersByEmail(req.user._id, orgBody);
  }

  @Post('revoke')
  public async removeMember(@Request() req, @Body() orgBody: ManageMembersOrganizationBody) {
    this.eventEmitter.emit('Org:Update', orgBody.orgId);
    return this.orgService.removeMembers(orgBody.orgId, req.user._id, orgBody.membersId);
  }

}
