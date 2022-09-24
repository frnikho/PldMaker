import {Injectable} from '@nestjs/common';
import { DeviceBody, AddFavourBody, UpdateUserBody, User, Mfa, Favour } from "@pld/shared";
import { UserHelper } from "./user.helper";

@Injectable()
export class UserService {

    constructor(private userHelper: UserHelper) {}

    public create(user: any) {
      return this.userHelper.create(user);
    }

    public find(userId: string) {
      return this.userHelper.find(userId);
    }

    public findUser(loggedUser: User, userFound: User) {
      //TODO check loggedUser permission !
    }

    public finds(usersId: string[]) {
      return this.userHelper.findMany(usersId);
    }

    public findByEmail(email: string) {
      return this.userHelper.findByEmail(email);
    }

    public findWithPassword({email = undefined}) {
      return this.userHelper.findByEmailWithPassword(email);
    }

    public delete(user: User) {
        return this.userHelper.delete(user)
    }

    public update(user: User) {
      return this.userHelper.update(user);
    }

    public updateByBody(user: User, body: UpdateUserBody) {
      return this.userHelper.updateWithBody(user, body);
    }

    public async addDevices(user: User, ip: string, body: DeviceBody) {
      return this.userHelper.addDevice(user, ip, body);
    }

    public cleanDevices(user: User) {
      return this.userHelper.cleanAllDevices(user);
    }

    public findFavour(user: User) {
     return this.userHelper.findFavour(user);
    }

    public addFavour(user: User, body: AddFavourBody) {
      return this.userHelper.addFavourWithBody(user, body);
    }

    public removeFavour(user: User, favour: Favour, itemToDelete: string) {
     return this.userHelper.removeFavour(user, favour, itemToDelete);
    }
}
