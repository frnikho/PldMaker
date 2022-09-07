import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {PldService} from "./pld.service";
import {ObjectIDPipe} from "../utility/ObjectID.pipe";
import { PldOrgCreateBody, PldOrgFindsBody, CreatePldRevisionBody, PldUpdateBody, Organization, Pld } from "@pld/shared";
import {EventEmitter2} from "@nestjs/event-emitter";
import { OrganizationPipe } from "../organization/organization.pipe";
import { PldPipe } from "./pld.pipe";

@Controller('pld')
export class PldController {

  constructor(private pldService: PldService, private eventEmitter: EventEmitter2) {}

  @Get('organization/find/:orgId')
  public async getPldOrganization(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.pldService.findByOrganizationOwner([org._id]);
  }

  @Get('me')
  public async getOwnPld() {
    //
  }

  @Get('find/:pldId')
  public async getPldById(@Request() req, @Param('pldId', PldPipe) pld: Pld) {
    return pld;
  }

  @Post('finds')
  public async getPlds(@Request() req, @Body() body: PldOrgFindsBody) {
    return this.pldService.findByOrganizationOwner(body.organizations);
  }

  @Post('organization/create')
  public async createPld(@Request() req, @Body() body: PldOrgCreateBody) {
    return this.pldService.createForOrgWithBody(body);
  }

  @Post('update')
  public async updatePld(@Request() req, @Body() body: PldUpdateBody) {
    this.eventEmitter.emit('Pld:Update', body.pldId);
    return this.pldService.updateWithBody(req.user._id, body);
  }

  @Post(':pldId/revision')
  public async addRevision(@Request() req, @Param('pldId', new ObjectIDPipe()) pldId: string, @Body() body: CreatePldRevisionBody) {
    this.eventEmitter.emit('Pld:Update', pldId);
    return this.pldService.addRevision(pldId, body);
  }

}
