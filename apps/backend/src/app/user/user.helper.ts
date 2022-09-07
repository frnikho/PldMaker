import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { AddFavourBody, Device, DeviceBody, Favour, FavourType, UpdateUserBody, User } from "@pld/shared";

@Injectable()
export class UserHelper {

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Favour') private favourModel: Model<Favour>) {}

  public static populateAndExecute<T>(query: Query<T, any>) {
    return query.exec();
  }

  public static populateAndExecuteFavour<T>(query: Query<T, any>) {
    return query.populate({
      path: 'pld',
      populate: [
        {
          path: 'owner',
        },
        {
          path: 'manager'
        }]
    })
      .populate({
        path: 'org',
        populate: [
          {
            path: 'owner'
          },
        ]
      })
      .exec();
  }

  public async create(user: User) {
    const createdUser = await this.userModel.create(user);
    await this.favourModel.create({owner: createdUser._id});
    return createdUser;
  }

  public find(userId: string) {
    return UserHelper.populateAndExecute(this.userModel.findOne({_id: userId}));
  }

  public findMany(userIds: string[]) {
    return UserHelper.populateAndExecute(this.userModel.find({_id: {$in: userIds}}));
  }

  public findByEmail(email: string) {
    return UserHelper.populateAndExecute(this.userModel.findOne({email: email}));
  }

  public findByEmailWithPassword(email: string) {
    return UserHelper.populateAndExecute(this.userModel.findOne({email: email}).select('+password'));
  }

  public delete(user: User) {
    return UserHelper.populateAndExecute(this.userModel.findOneAndDelete({_id: user._id}));
  }

  public update(user: User) {
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, user, {new: true}));
  }

  public updateWithBody(user: User, body: UpdateUserBody) {
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, body, {new: true}));
  }


  public addDevice(user: User, ip: string, body: DeviceBody) {
    if (user.devices.some((d) => d.agent === body.agent)) {
      user.devices = user.devices.map((d) => {
        if (d.agent !== body.agent)
          return d;
        d.lastConnection = new Date();
        return d;
      });
    } else {
      user.devices.push(new Device({ip: ip, agent: body.agent, language: body.language, os: body.os}))
    }
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, {devices: user.devices}, {new: true}));
  }

  public cleanAllDevices(user: User) {
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, {devices: []}, {new: true}));
  }

  public addFavourWithBody(user: User, body: AddFavourBody) {
    if (body.type === FavourType.Organization) {
      return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$addToSet: {org : body.data_id}}, {new: true}));
    } else {
      return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$addToSet: {pld: body.data_id}}, {new: true}));
    }
  }

  public findFavour(user: User) {
    return UserHelper.populateAndExecuteFavour(this.favourModel.findOne({owner: user._id}));
  }

  public removeFavour(user: User, favourId: string) {
    return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$pull: {org: favourId, pld: favourId}}, {new: true}));
  }

}
