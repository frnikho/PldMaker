import api, {ApiError, authorize, ErrorType} from "../util/Api";
import {User} from "../../../../../libs/data-access/user/User";
import {AxiosError, AxiosResponse} from "axios";
import {UpdateUserBody} from "../../../../../libs/data-access/user/UpdateUserBody";

export type CallbackUser = (user: User | null, error?: ApiError) => void;

export class UserApiController {

  public static getMe(accessToken: string, callback: CallbackUser) {
    api.get<User>('user', authorize(accessToken)).then((response) => {
      callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      callback(null, err.response?.data);
    });
  }

  public static findUserByEmail(accessToken: string, userEmail: string, callback: CallbackUser) {
    api.get<User | null>(`user/find/email/${userEmail}`, authorize(accessToken)).then((response: AxiosResponse<User | null>) => {
      if (response.data?._id === undefined)
        return callback(null, {error: 'Aucun utilisateur trouvé avec cette adresse email', type: ErrorType.NO_USER_FOUND_EMAIL});
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

  public static findUserById(userId: string, callback: CallbackUser) {
    api.get<User>(`user/find/id/${userId}`).then((response: AxiosResponse<User>) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data)
    });
  }

  public static updateUser(accessToken: string, userBody: UpdateUserBody, callback: CallbackUser) {
    api.patch<User>(`user/update`, userBody, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err) => {
      return callback(null, err.response?.data);
    })
  }

}
