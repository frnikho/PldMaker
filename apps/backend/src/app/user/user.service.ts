import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { User, UserDocument } from './user.schema';

import * as Mongoose from 'mongoose';
@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    public create(user: User): Promise<User> {
        return this.userModel.create(user);
    }

    public find(userObjectId: string): Promise<User | null> {
        return this.userModel.findOne({_id: userObjectId}).exec();
    }

    public delete(userObjectId: string): Promise<unknown> {
        return this.userModel.deleteOne({_id: userObjectId}).exec();
    }

    public update(userObjectId: string, user: User): Promise<Mongoose.UpdateWriteOpResult> {
        return this.userModel.updateOne({_id: userObjectId}, user, {new: true}).exec();
    }

}
