import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ApiErrorsCodes, buildException, Favour } from "@pld/shared";
import { ObjectIdPipe } from "../pipe/objectId.pipe";
import { ApiException } from "../exception/api.exception";

@Injectable()
export class FavourPipe implements PipeTransform {

  constructor(@InjectModel('Favour') private favourModel: Model<Favour>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const favour = await this.favourModel.findOne({$or: [{pld: value}, {org: value}]}).exec();
    if (favour === null || favour === undefined)
      throw new ApiException(buildException(ApiErrorsCodes.INVALID_OBJECT_ID, 'Invalid Favour ID'));
    return favour;
  }
}
