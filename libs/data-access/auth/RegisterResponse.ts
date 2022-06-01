import {User} from "../user/User";

export type RegisterResponse = {
  user: User;
  accessToken: string;
}

export type RegisterError = {
  error: string,
  message: string[],
  statusCode: number
}
