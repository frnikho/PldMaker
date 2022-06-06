import {Body, Controller, Get, Param, Post, Request, UseFilters} from '@nestjs/common';
import {OrganizationService} from "./organization.service";
import {CreateOrganizationBody} from "../../../../../libs/data-access/organization/CreateOrganizationBody";
import {
  ManageMembersOrganizationBody
} from "../../../../../libs/data-access/organization/ManageMembersOrganizationBody";
import {UpdateOrganizationBody} from "../../../../../libs/data-access/organization/UpdateOrganizationBody";
import {DeleteOrganizationBody} from "../../../../../libs/data-access/organization/DeleteOrganizationBody";
import {MongoExceptionFilter} from "../mongo.exceptionfilter";
import {ObjectIDPipe} from "../ObjectID.pipe";

@Controller('organization')
export class OrganizationController {

  constructor(private orgService: OrganizationService) {
  }

  @Post('create')
  public async create(@Request() req, @Body() orgBody: CreateOrganizationBody) {
    return this.orgService.createByBody(orgBody, req.user._id);
  }

  @Post('update')
  public async update(@Request() req, @Body() body: UpdateOrganizationBody) {
    return this.orgService.updateByBody(req.user._id, body);
  }

  @Post('delete')
  public async delete(@Request() req, @Body() body: DeleteOrganizationBody) {
    return this.orgService.deleteByBody(req.user, body);
  }

  @Get(['', 'get'])
  public async get(@Request() req) {
    return this.orgService.findOrgsByAuthor(req.user._id);
  }

  @Get('find/id/:orgId')
  public async getOrg(@Request() req, @Param('orgId', new ObjectIDPipe()) orgId: string) {
    return this.orgService.find(orgId);
  }

  @Get('find/name/:orgName')
  public async findOrgName(@Request() req, @Param('orgName') orgName: string) {
    //TODO finish function controller
  }

  @Post('addMembers')
  public async addMember(@Request() req, @Body() orgBody: ManageMembersOrganizationBody) {
    return this.orgService.addMembers(orgBody.orgId, req.user._id, orgBody.membersId);
  }

  @Post('removeMembers')
  public async removeMember(@Request() req, @Body() orgBody: ManageMembersOrganizationBody) {
    return this.orgService.removeMembers(orgBody.orgId, req.user._id, orgBody.membersId);
  }

}
