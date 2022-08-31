import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Organization} from "./organization.schema";

@Injectable()
export class OrganizationPipe implements PipeTransform {

  constructor(@InjectModel('Organization') private orgModel: Model<Organization>) {
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    return await this.orgModel.findOne({_id: value}).exec();
  }
}
