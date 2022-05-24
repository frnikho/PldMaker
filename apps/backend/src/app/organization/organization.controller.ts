import {Body, Controller, Get, Post, Request} from '@nestjs/common';
import {OrganizationService} from "./organization.service";
import {CreateOrganizationBody} from "../../../../../libs/data-access/organization/CreateOrganizationBody";

@Controller('organization')
export class OrganizationController {

  constructor(private orgService: OrganizationService) {
  }

  @Post('create')
  public async create(@Request() req, @Body() orgBody: CreateOrganizationBody) {
    return this.orgService.createByBody(orgBody, req.user._id);
  }

  @Get()
  public async get(@Request() req) {
    return this.orgService.findOrgsByAuthor(req.user._id);
  }

}
