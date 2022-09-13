import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { Dod, DodCreateBody, DodUpdateBody, Organization, Pld } from "@pld/shared";
import { DodService } from "./dod.service";
import { OrganizationPipe } from "../organization/organization.pipe";
import { PldPipe } from "../pld/pld.pipe";
import { DodPipe } from "./dod.pipe";

/**
 * @author Nicolas SANS
 * @date 06/09/2022
 */

@Controller('organization/:orgId/pld/:pldId/dod')
export class DodController {

  constructor(private dodService: DodService) {
  }

  @Post()
  public async createDod(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Body() dodBody: DodCreateBody) {
    return this.dodService.createWithBody(req.user, org, pld, dodBody);
  }

  @Get()
  public async get(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld) {
    return this.dodService.getPldDod(req.user, org, pld);
  }

  @Get(':dodId')
  public async getDod(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Param('dodId', DodPipe) dod: Dod) {
    return this.dodService.getDod(req.user, org, pld, dod);
  }

  @Patch(':dodId')
  public async updateDod(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Param('dodId', DodPipe) dod: Dod, @Body() body: DodUpdateBody) {
    return this.dodService.update(req.user, org, pld, dod, body);
  }

  @Delete(':dodId')
  public async deleteDod(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Param('dodId', DodPipe) dod: Dod) {
    return this.dodService.delete(req.user, org, pld, dod);
  }

}
