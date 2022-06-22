import {Injectable} from '@nestjs/common';
import {Model, Query} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from './user.schema';
import {UpdateUserBody} from "../../../../../libs/data-access/user/UpdateUserBody";
import {AddFavourBody, FavourType} from "../../../../../libs/data-access/user/Favour";
import {Favour} from "./favour.schema";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Favour.name) private favourModel: Model<Favour>) {}

    public async create(user: User): Promise<UserDocument> {
      const createdUser = await this.userModel.create(user);
      await this.favourModel.create({owner: createdUser._id});
      return createdUser;
    }

    public async find(userObjectId: string): Promise<UserDocument | null> {
      const user = await this.userModel.findOne({_id: userObjectId}).exec();

      return user;
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

    public findFavour(ownerId: string) {
      return this.favourModel.findOne({owner: ownerId})
        .populate('pld')
        .populate('org')
        .exec();
    }

    public addFavour(userId: string, body: AddFavourBody) {
      let query: Query<Favour, any>;
      if (body.type === FavourType.Organization) {
        query = this.favourModel.findOneAndUpdate({owner: userId}, {$addToSet: {org : body.data_id}}, {new: true});
      } else {
        query = this.favourModel.findOneAndUpdate({owner: userId}, {$addToSet: {pld: body.data_id}}, {new: true});
      }
      return query
        .populate('pld')
        .populate('org')
        .exec();
    }

    public removeFavour(userId: string, favourId: string) {
      console.log(favourId);
      return this.favourModel.findOneAndUpdate({owner: userId}, {$pull: {org: favourId, pld: favourId}}, {new: true})
        .populate('pld')
        .populate('org')
        .exec();
    }

}
