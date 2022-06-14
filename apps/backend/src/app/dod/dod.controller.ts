import {Body, Controller, Delete, Get, Param, Post, Request} from '@nestjs/common';
import {DodCreateBody} from "../../../../../libs/data-access/dod/DodBody";
import {DodService} from "./dod.service";
import {ObjectIDPipe} from "../ObjectID.pipe";
import {UpdateDodStatusBody} from "../../../../../libs/data-access/dod/UpdateDodStatusBody";
import {DodStatus} from "../../../../../libs/data-access/dod/Dod";
import {EventEmitter2} from "@nestjs/event-emitter";
import {PldDocument} from "../pld/pld.schema";

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
  public async findByPld(@Request() req, @Param('pldId', new ObjectIDPipe()) pldId: string) {
    return this.dodService.findByPldId(pldId);
  }

  @Get('find/id/:id')
  public async find(@Request() req, @Param('pldId', new ObjectIDPipe()) id: string) {
    return this.dodService.find(id);
  }

  @Delete('delete/id/:id')
  public async delete(@Request() req, @Param('id') id: string) {
    const dod = await this.dodService.delete(id);
    this.eventEmitter.emit('Dod:Update', (dod.pldOwner as PldDocument)._id);
    return dod;
  }

  @Post('update/status')
  public async updateStatus(@Body() body: UpdateDodStatusBody) {
    const dod = await this.dodService.updateStatus(body.dodId, body.status as DodStatus);
    this.eventEmitter.emit('Dod:Update', (dod.pldOwner as PldDocument)._id);
    return dod;
  }

}
