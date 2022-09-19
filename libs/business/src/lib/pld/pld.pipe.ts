import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ObjectIdPipe } from "../pipe/objectId.pipe";
import { Pld } from "./pld.schema";
import { PldHelper } from "./pld.helper";

@Injectable()
export class PldPipe implements PipeTransform {

  constructor(@InjectModel('Pld') private pldModel: Model<Pld>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const pld = await PldHelper.populateAndExecute(this.pldModel.findOne({_id: value}));
    if (pld === null || pld === undefined)
      throw new BadRequestException('Invalid PLD ID');
    return pld;
  }
}
