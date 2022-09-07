import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { User } from "./user.schema";
import { ObjectIDPipe } from "../utility/ObjectID.pipe";

@Injectable()
export class UserPipe implements PipeTransform {

  constructor(@InjectModel('User') private userModel: Model<User>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIDPipe().transform(value, metadata);
    const user = await this.userModel.findOne({_id: value}).exec();
    if (user === null || user === undefined)
      throw new BadRequestException('Invalid User ID');
    return user;
  }
}
