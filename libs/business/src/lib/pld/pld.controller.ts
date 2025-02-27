import { Body, Controller, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { PldService } from "./pld.service";
import { PldPipe } from "./pld.pipe";
import { OrganizationPipe } from "../organization/organization.pipe";
import { PldOrgCreateBody, CreatePldRevisionBody, PldUpdateBody, Organization, Pld, UpdatePldRevisionBody } from "@pld/shared";

@Controller('organization/:orgId/pld')
export class PldController {

  constructor(private pldService: PldService) {}

  @Get()
  public async getPldOrganization(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.pldService.findByOrganizationOwner(req.user, org);
  }

  @Get(':pldId')
  public async getPldById(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld) {
    return this.pldService.findPld(req.user, org, pld);
  }

  @Post()
  public async createPld(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: PldOrgCreateBody) {
    return this.pldService.createForOrgWithBody(req.user, org, body);
  }

  @Patch(':pldId/update')
  public async updatePld(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Body() body: PldUpdateBody) {
    return this.pldService.updateWithBody(req.user, org, pld, body);
  }

  @Post(':pldId/revision')
  public async addRevision(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Body() body: CreatePldRevisionBody) {
    return this.pldService.addRevision(req.user, org, pld, body);
  }

  @Patch(':pldId/revision')
  public async editRevision(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('pldId', PldPipe) pld: Pld, @Body() body: UpdatePldRevisionBody) {
    return this.pldService.editRevision(req.user, org, pld, body);
  }

}
