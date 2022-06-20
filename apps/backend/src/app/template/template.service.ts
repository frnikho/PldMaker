import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Template} from "./template.schema";
import {Model} from "mongoose";
import {TemplateBody} from "../../../../../libs/data-access/template/TemplateBody";

@Injectable()
export class TemplateService {

  constructor(@InjectModel(Template.name) private templateModel: Model<Template>) {}

  public find(templateId: string) {
    return this.templateModel.findOne({_id: templateId})
      .populate(['org', 'owner'])
      .exec();
  }

  public async create(template: Template) {
    return this.templateModel.create(template);
  }

  public async createBody(body: TemplateBody) {
    return this.templateModel.findOneAndUpdate({_id: body.orgId})
      .populate(['org', 'owner'])
      .exec();
  }

  public update(template: TemplateBody) {
    return this.templateModel.findOneAndUpdate({_id: template.pldId}, {data: template.data})
      .populate(['org', 'owner'])
      .exec();
  }

  public delete(templateId: string) {
    return this.templateModel.findOneAndDelete({_id: templateId})
      .exec();
  }

}
