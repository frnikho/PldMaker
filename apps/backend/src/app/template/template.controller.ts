import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {TemplateService} from "./template.service";
import {TemplateBody} from "../../../../../libs/data-access/template/TemplateBody";
import {Template} from "./template.schema";

@Controller('template')
export class TemplateController {

  constructor(private service: TemplateService) {}

  @Get('find/id/:id')
  public async find(@Param('id') templateId: string) {
    return this.service.find(templateId);
  }

  @Post('update')
  public async update(@Body() body: Template) {
    return this.service.create(body);
  }

  @Post('create')
  public async create(@Body() body: TemplateBody) {
    return this.service.createBody(body);
  }
}
