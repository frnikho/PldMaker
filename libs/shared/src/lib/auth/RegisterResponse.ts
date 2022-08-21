import {User} from "../user/User";

export type RegisterResponse = {
  user: User;
  accessToken: string;
}
