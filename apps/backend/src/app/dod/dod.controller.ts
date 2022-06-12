import {Body, Controller, Delete, Get, Param, Post, Request} from '@nestjs/common';
import {DodCreateBody} from "../../../../../libs/data-access/pld/dod/DodBody";
import {DodService} from "./dod.service";
import {ObjectIDPipe} from "../ObjectID.pipe";
import {UpdateDodStatusBody} from "../../../../../libs/data-access/pld/dod/UpdateDodStatusBody";
import {DodStatus} from "../../../../../libs/data-access/pld/dod/Dod";

@Controller('dod')
export class DodController {

  constructor(private dodService: DodService) {
  }

  @Post('create')
  public async createDod(@Request() req, @Body() dodBody: DodCreateBody) {
    return this.dodService.createFromBody(dodBody);
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
    return this.dodService.delete(id);
  }

  @Post('update/status')
  public async updateStatus(@Body() body: UpdateDodStatusBody) {
    return this.dodService.updateStatus(body.dodId, body.status as DodStatus);
  }

}
