import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Organization} from "./organization.schema";
import { ObjectIDPipe } from "../utility/ObjectID.pipe";
import { OrganizationHelper } from "./organization.helper";

@Injectable()
export class OrganizationPipe implements PipeTransform {

  constructor(@InjectModel('Organization') private orgModel: Model<Organization>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIDPipe().transform(value, metadata);
    const org = await OrganizationHelper.populateAndExecute(this.orgModel.findOne({_id: value}));
    if (org === null || org === undefined)
      throw new BadRequestException('Invalid Organization ID');
    return org;
  }
}
