import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {PldService} from "./pld.service";
import {ObjectIDPipe} from "../ObjectID.pipe";
import {PldOrgCreateBody, PldOrgFindsBody} from "../../../../../libs/data-access/pld/PldBody";
import {CreatePldRevisionBody} from "../../../../../libs/data-access/pld/Pld";
import {PldUpdateBody} from "../../../../../libs/data-access/pld/PldUpdateBody";
import {EventEmitter2} from "@nestjs/event-emitter";

@Controller('pld')
export class PldController {

  constructor(private pldService: PldService, private eventEmitter: EventEmitter2) {}

  @Get('organization/find/:orgId')
  public async getPldOrganization(@Request() req, @Param('orgId', new ObjectIDPipe()) orgId: string) {
    return this.pldService.findByOrganizationOwner([orgId]);
  }

  @Get('me')
  public async getOwnPld() {

  }

  @Get('find/:pldId')
  public async getPldById(@Request() req, @Param('pldId', new ObjectIDPipe()) pldId: string) {
    return this.pldService.find(pldId);
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
