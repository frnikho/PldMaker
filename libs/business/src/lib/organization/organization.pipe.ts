import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { Organization } from "./organization.schema";
import { OrganizationHelper } from "./organization.helper";
import { ObjectIdPipe } from "../pipe/objectId.pipe";

@Injectable()
export class OrganizationPipe implements PipeTransform {

  constructor(@InjectModel('Organization') private orgModel: Model<Organization>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const org = await OrganizationHelper.populateAndExecute(this.orgModel.findOne({_id: value}));
    if (org === null || org === undefined)
      throw new BadRequestException('Invalid Organization ID');
    return org;
  }
}
