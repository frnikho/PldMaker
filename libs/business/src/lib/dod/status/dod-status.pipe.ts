import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { DodStatus } from "@pld/shared";
import { ObjectIdPipe } from "../../pipe/objectId.pipe";

@Injectable()
export class DodStatusPipe implements PipeTransform {

  constructor(@InjectModel('DodStatus') private dodStatusModel: Model<DodStatus>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const dodStatus = await this.dodStatusModel.findOne({_id: value}).exec();
    if (dodStatus === null || dodStatus === undefined)
      throw new BadRequestException('Invalid DodStatus ID');
    dodStatus._id = dodStatus._id.toString();
    return dodStatus;
  }
}
