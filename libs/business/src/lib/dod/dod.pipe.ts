import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { Dod } from "@pld/shared";
import { ObjectIdPipe } from "../pipe/objectId.pipe";

@Injectable()
export class DodPipe implements PipeTransform {

  constructor(@InjectModel('Dod') private dodModel: Model<Dod>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const dod = await this.dodModel.findOne({_id: value}).exec();
    if (dod === null || dod === undefined)
      throw new BadRequestException('Invalid DoD ID');
    return dod;
  }
}
