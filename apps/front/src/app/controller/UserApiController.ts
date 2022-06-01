import api, {authorize} from "../util/Api";
import {User} from "../../../../../libs/data-access/user/User";
import {AxiosError} from "axios";

export class UserApiController {

  public static getMe(accessToken: string, callback: (user: User | null, error?: string) => unknown) {
    api.get<User>('user', authorize(accessToken)).then((response) => {
      if (response.data) {
        callback(response.data);
      }
    }).catch((err: AxiosError<any>) => {
      callback(null, 'TBD');
    });
  }

}
