import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { Pld } from "./pld.schema";
import { ObjectIDPipe } from "../utility/ObjectID.pipe";

@Injectable()
export class PldPipe implements PipeTransform {

  constructor(@InjectModel('Pld') private pldModel: Model<Pld>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIDPipe().transform(value, metadata);
    const pld = await this.pldModel.findOne({_id: value}).exec();
    if (pld === null || pld === undefined)
      throw new BadRequestException('Invalid PLD ID');
    return pld;
  }
}
