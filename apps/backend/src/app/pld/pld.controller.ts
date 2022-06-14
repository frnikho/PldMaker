import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {PldService} from "./pld.service";
import {ObjectIDPipe} from "../ObjectID.pipe";
import {PldOrgCreateBody} from "../../../../../libs/data-access/pld/PldBody";
import {CreatePldRevisionBody} from "../../../../../libs/data-access/pld/Pld";
import {PldUpdateBody} from "../../../../../libs/data-access/pld/PldUpdateBody";
import {EventEmitter2} from "@nestjs/event-emitter";

@Controller('pld')
export class PldController {

  constructor(private pldService: PldService, private eventEmitter: EventEmitter2) {}

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

  @Post('update')
  public async updatePld(@Body() body: PldUpdateBody) {
    this.eventEmitter.emit('Pld:Update', body.pldId);
    return this.pldService.updateWithBody(body);
  }

  @Post(':pldId/revision')
  public async addRevision(@Request() req, @Param('pldId', new ObjectIDPipe()) pldId: string, @Body() body: CreatePldRevisionBody) {
    this.eventEmitter.emit('Pld:Update', pldId);
    return this.pldService.addRevision(pldId, body);
  }

}
