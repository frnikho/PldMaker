import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { AddFavourBody, Device, DeviceBody, Favour, FavourType, UpdatePreference, UpdateUserBody, User } from "@pld/shared";
import { MailService } from "../mail/mail.service";
import { AvailableMail } from "../mail/mail.list";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { Express } from "express";
import { randomUUID } from "crypto";
import * as fs from 'fs';
import * as path from "path";

@Injectable()
export class UserHelper {

  private readonly logger = new Logger('UserHelper');

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Favour') private favourModel: Model<Favour>,
    private mailService: MailService,
    private eventEmitter: EventEmitter2,
    @InjectQueue('user') private userQueue: Queue) {}

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
    await this.mailService.sendWelcomeMail(user, AvailableMail.Welcome);
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

  public async delete(user: User) {
    this.logger.debug(`Deleting user (${user.email} - ${user._id})`);
    const job = await this.userQueue.add('delete', {user: user});
    return user;
    //return UserHelper.populateAndExecute(this.userModel.findOneAndDelete({_id: user._id}));
  }

  public update(user: User) {
    this.logger.debug(`Updating user content: `);
    this.logger.debug(user);
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, {...user, updated_date: new Date() }, {new: true}));
  }

  public uploadProfilePicture(user: User, file: Express.Multer.File) {
    this.userQueue.add('uploadProfilePicture', { user, file });
    return user;
  }

  public changeUserProfile(user: User, file: Express.Multer.File) {
    const filename = randomUUID();

    const client = this.createImageKitClient();
    console.log('Change user profile');
    console.log(Buffer.from((file.buffer as any).data, 'ascii'));
    client.upload({
      fileName: file.originalname,
      file: Buffer.from((file.buffer as any).data, 'ascii'),
    }).then((response) => {
      if (response.fileType === 'image') {
        this.userModel.updateOne({_id: user._id}, {profile_picture: response.url, updated_date: new Date()}).exec();
      } else {
        client.deleteFile(response.fileId).then((value) => {
          console.log(value);
        }).catch((err) => {
          console.log(err);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
    /*fs.writeFile(path.join(__dirname, './assets/static/', filename), Buffer.from((file.buffer as any).data, 'ascii'), 'binary', (err) => {
      if (err) {
        Logger.error('Une erreur est survenue lors de la sauvegarde d\'une photo de profile !');
      } else {
      }
    });*/
  }

  public updateWithBody(user: User, body: UpdateUserBody) {
    this.logger.debug(`Updating user content (${user.email} - ${user._id}): `);
    this.logger.debug(body);
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, { ...body, updated_date: new Date() }, {new: true}));
  }

  public addDevice(user: User, ip: string, body: DeviceBody) {
    this.logger.debug(`Adding a new device for user (${user.email} - ${user._id})`);
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
    this.logger.debug(`Adding favour for user (${user.email} - ${user._id})`);
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

  public async removeFavour(user: User, favour: Favour, itemToDelete: string) {
    this.logger.debug(`Deleting user favour (${user.email} - ${user._id})`);
    return UserHelper.populateAndExecuteFavour(this.favourModel.findOneAndUpdate({owner: user._id}, {$pull: {org: itemToDelete, pld: itemToDelete}}, {new: true}));
  }

  public async updatePreference(user: User, body: UpdatePreference) {
    return UserHelper.populateAndExecute(this.userModel.findOneAndUpdate({_id: user._id}, {preference: { ...body }}, {new: true}));
  }

  private createImageKitClient() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ImageKit = require('imagekit');
    return new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_ENDPOINT
    });
  }

}
