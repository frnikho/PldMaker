import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ObjectIdPipe } from "../../pipe/objectId.pipe";
import { OrganizationSection } from "./organization-section.schema";
import { OrganizationSectionHelper } from "./organization-section.helper";

@Injectable()
export class OrganizationSectionPipe implements PipeTransform {

  constructor(@InjectModel('OrganizationSection') private orgSectionModel: Model<OrganizationSection>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const orgSection = await OrganizationSectionHelper.populateAndExecute(this.orgSectionModel.findOne({_id: value}));
    if (orgSection === null || orgSection === undefined)
      throw new BadRequestException('Invalid Organization Section ID');
    return orgSection;
  }
}
