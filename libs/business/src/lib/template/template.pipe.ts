import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ObjectIdPipe } from "../pipe/objectId.pipe";
import { Template } from "./template.schema";
import { TemplateHelper } from "./template.helper";
import { ApiException } from "../exception/api.exception";
import { ApiErrorsCodes, buildException } from "@pld/shared";

@Injectable()
export class TemplatePipe implements PipeTransform {

  constructor(@InjectModel('Template') private templateModel: Model<Template>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const template = await TemplateHelper.populateAndExecute(this.templateModel.findOne({_id: value}));
    if (template === null || template === undefined)
      throw new ApiException(buildException(ApiErrorsCodes.INVALID_OBJECT_ID, 'Invalid Template ID'));
    return template;
  }
}
