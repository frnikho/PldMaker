import { User } from "@pld/shared";

export enum UserEvents {
  OnUserDeleted = 'User.Deleted',
}

export class UserDeletedEvent {
  user: User;

  constructor(user: User) {
    this.user = user;
  }
}
