import {Body, Controller, Delete, Get, Param, Post, Request} from '@nestjs/common';
import { Dod, DodCreateBody, DodFindPldBody, Pld } from "@pld/shared";
import {DodService} from "./dod.service";
import {UpdateDodStatusBody} from "@pld/shared";
import {DodStatus} from "@pld/shared";
import {EventEmitter2} from "@nestjs/event-emitter";
import {PldDocument} from "../pld/pld.schema";
import { PldPipe } from "../pld/pld.pipe";
import { DodPipe } from "./dod.pipe";

/**
 * @author Nicolas SANS
 * @date 06/09/2022
 */

@Controller('dod')
export class DodController {

  constructor(private dodService: DodService, private eventEmitter: EventEmitter2) {}

  @Post('create')
  public async createDod(@Request() req, @Body() dodBody: DodCreateBody) {
    const dodCreated = await this.dodService.createFromBody(dodBody);
    this.eventEmitter.emit('Dod:Update', (dodCreated.pldOwner as PldDocument)._id);
    return dodCreated;
  }

  @Get('find/pld/:pldId')
  public async findByPld(@Request() req, @Param('pldId', PldPipe) pld: Pld) {
    return this.dodService.findByPldId([pld._id]);
  }

  @Get('find/id/:id')
  public async find(@Request() req, @Param('pldId', DodPipe) dod: Dod) {
    return dod;
  }

  @Delete('delete/id/:id')
  public async delete(@Request() req, @Param('pldId', DodPipe) dod: Dod) {
    dod = await this.dodService.delete(dod._id);
    this.eventEmitter.emit('Dod:Update', (dod.pldOwner as any)._id);
    return dod;
  }

  @Post('update/status')
  public async updateStatus(@Request() req, @Body() body: UpdateDodStatusBody) {
    const dod = await this.dodService.updateStatus(req.user._id, body.dodId, body.status as DodStatus);
    this.eventEmitter.emit('Dod:Update', (dod.pldOwner as PldDocument)._id);
    return dod;
  }

  @Post(':id/update')
  public async updateDod(@Request() req, @Param('id', DodPipe) dod: Dod, @Body() body: DodCreateBody) {
    dod = await this.dodService.update(req.user._id, dod._id, body);
    this.eventEmitter.emit('Dod:Update', (dod.pldOwner as any)._id);
    return dod;
  }

  @Post('finds')
  public async getDod(@Request() req, @Body() body: DodFindPldBody) {
    return this.dodService.findByPldId(body.plds);
  }



}
