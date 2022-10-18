import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ApiErrorsCodes, buildException, User } from "@pld/shared";
import { ObjectIdPipe } from "../pipe/objectId.pipe";
import { ApiException } from "../exception/api.exception";

@Injectable()
export class UserPipe implements PipeTransform {

  constructor(@InjectModel('User') private userModel: Model<User>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const user = await this.userModel.findOne({_id: value}).select('+preference').exec();
    if (user === null || user === undefined)
      throw new ApiException(buildException(ApiErrorsCodes.INVALID_OBJECT_ID, 'Invalid User ID'));
    return user;
  }
}
