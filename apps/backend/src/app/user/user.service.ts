import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from './user.schema';
import {UpdateUserBody} from "../../../../../libs/data-access/user/UpdateUserBody";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    public async create(user: User): Promise<UserDocument> {
      return this.userModel.create(user);
    }

    public find(userObjectId: string): Promise<UserDocument | null> {
      return this.userModel.findOne({_id: userObjectId}).exec();
    }

    public finds(userObjectId: string[]): Promise<UserDocument[] | null> {
      return this.userModel.find({_id: {$in: userObjectId}}).exec();
    }

    public findByEmail(email: string): Promise<UserDocument | null> {
      return this.userModel.findOne({email}).exec();
    }

    public findWithPassword({email = undefined}): Promise<UserDocument | null> {
      return this.userModel.findOne({email}).select('+password').exec();
    }

    public delete(userObjectId: string): Promise<UserDocument | null> {
        return this.userModel.findOneAndDelete({_id: userObjectId}).exec();
    }

    public update(userObjectId: string, user: User): Promise<UserDocument | null> {
        return this.userModel.findOneAndUpdate({_id: userObjectId}, user, {new: true}).exec();
    }

    public updateByBody(userObjectId: string, userBody: UpdateUserBody): Promise<UserDocument | null> {
      return this.userModel.findOneAndUpdate({_id: userObjectId}, userBody, {new: true}).exec();
    }

}
