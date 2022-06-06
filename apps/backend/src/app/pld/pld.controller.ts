import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {PldService} from "./pld.service";
import {ObjectIDPipe} from "../ObjectID.pipe";
import {PldOrgCreateBody} from "../../../../../libs/data-access/pld/PldBody";

@Controller('pld')
export class PldController {

  constructor(private pldService: PldService) {}

  @Get('organization/find/:orgId')
  public async getPldOrganization(@Request() req, @Param('orgId', new ObjectIDPipe()) orgId: string) {
    return this.pldService.findByOrganizationOwner(orgId);
  }

  @Get('find/:pldId')
  public async getPld(@Request() req, @Param('pldId', new ObjectIDPipe()) pldId: string) {
    return this.pldService.find(pldId);
  }

  @Post('organization/create')
  public async createPld(@Request() req, @Body() body: PldOrgCreateBody) {
    return this.pldService.createForOrgWithBody(body);
  }

}
