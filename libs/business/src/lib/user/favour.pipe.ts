import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { Favour } from "@pld/shared";
import { ObjectIdPipe } from "../pipe/objectId.pipe";

@Injectable()
export class FavourPipe implements PipeTransform {

  constructor(@InjectModel('Favour') private favourModel: Model<Favour>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const favour = await this.favourModel.findOne({_id: value}).exec();
    if (favour === null || favour === undefined)
      throw new BadRequestException('Invalid Favour ID');
    return favour;
  }
}
