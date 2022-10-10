import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { User } from "@pld/shared";
import { ObjectIdPipe } from "../pipe/objectId.pipe";

@Injectable()
export class UserPipe implements PipeTransform {

  constructor(@InjectModel('User') private userModel: Model<User>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const user = await this.userModel.findOne({_id: value}).select('+preference').exec();
    if (user === null || user === undefined)
      throw new BadRequestException('Invalid User ID');
    return user;
  }
}
