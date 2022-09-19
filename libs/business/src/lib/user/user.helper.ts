import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { AddFavourBody, Device, DeviceBody, Favour, FavourType, UpdateUserBody, User } from "@pld/shared";

@Injectable()
export class UserHelper {

  private readonly logger = new Logger('UserHelper');

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
    this.logger.debug(`New user created: ${createdUser._id}`);
    const createdFavour = await this.favourModel.create({owner: createdUser._id});
    this.logger.debug(`Favour's user created: ${createdFavour._id}`);
    return createdUser;
  }

  public find(userId: string) {
    return UserHelper.populateAndExecute(this.userModel.findOne({_id: userId}));
  }

  public findMany(userIds: string[]) {
    this.logger.debug(`Searching users: ${userIds}`);
    return UserHelper.populateAndExecute(this.userModel.find({_id: {$in: userIds}}));
  }

  public findByEmail(email: string) {
    this.logger.debug(`Searching user by email: ${email}`);
    return UserHelper.populateAndExecute(this.userModel.findOne({email: email}));
  }

  public findByEmailWithPassword(email: string) {
    this.logger.debug(`Searching user with visible password field (email: ${email})`);
    return UserHelper.populateAndExecute(this.userModel.findOne({email: email}).select('+password'));
  }

  public delete(user: User) {
    this.logger.debug(`Deleting user (${user.email} - ${user._id})`);
    return UserHelper.populateAndExecute(this.userModel.findOneAndDelete({_id: user._id}));
  }

  public update(user: User) {
    this.logger.debug(`Updating user content: `);
    this.logger.debug(user);
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, user, {new: true}));
  }

  public updateWithBody(user: User, body: UpdateUserBody) {
    this.logger.debug(`Updating user content (${user.email} - ${user._id}): `);
    this.logger.debug(body);
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, body, {new: true}));
  }


  public addDevice(user: User, ip: string, body: DeviceBody) {
    this.logger.debug(`Adding a new device for user (${user.email} - ${user._id}): `);
    this.logger.debug(body);
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
    this.logger.debug(`Deleting all user recent connected devices (${user.email} - ${user._id}) `);
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, {devices: []}, {new: true}));
  }

  public addFavourWithBody(user: User, body: AddFavourBody) {
    this.logger.debug(`Adding favour for user (${user.email} - ${user._id}): `);
    this.logger.debug(body);
    if (body.type === FavourType.CALENDAR) {
      return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$addToSet: {calendars : body.data_id}}, {new: true}));
    } else if (body.type === FavourType.ORG) {
      return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$addToSet: {org : body.data_id}}, {new: true}));
    } else {
      return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$addToSet: {pld: body.data_id}}, {new: true}));
    }
  }

  public findFavour(user: User) {
    this.logger.debug(`Searching user favours (${user.email} - ${user._id})`);
    return UserHelper.populateAndExecuteFavour(this.favourModel.findOne({owner: user._id}));
  }

  public removeFavour(user: User, favour: Favour) {
    this.logger.debug(`Deleting user favour (${user.email} - ${user._id}):`);
    this.logger.debug(favour);
    return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$pull: {org: favour._id, pld: favour._id}}, {new: true}));
  }

}
