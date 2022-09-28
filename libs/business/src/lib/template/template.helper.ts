import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Template} from "@pld/shared";
import { Model, Query } from "mongoose";
import { NewTemplateBody, Organization, UpdateTemplateBody, User } from "@pld/shared";

@Injectable()
export class TemplateHelper {

  constructor(@InjectModel(Template.name) private templateModel: Model<Template>) {}

  public static populateAndExecute<T, Z>(query: Query<T, Z>) {
    return query.populate(['owner', 'org']).exec();
  }

  public getOrgTemplate(user: User, org: Organization) {
    return TemplateHelper.populateAndExecute(this.templateModel.find({org: org}));
  }

  public async create(user: User, org: Organization, body: NewTemplateBody) {
    return this.templateModel.create({ ...body, org: org, owner: user });
  }

  public update(user: User, org: Organization, template: Template, body: UpdateTemplateBody) {
    return TemplateHelper.populateAndExecute(this.templateModel.findOneAndUpdate({_id: template._id}, {...body}, {new: true}));
  }

  public delete(user: User, org: Organization, template: Template) {
    return TemplateHelper.populateAndExecute(this.templateModel.findOneAndDelete({_id: template._id}));
  }

}
