import api, {ApiError, authorize, ErrorType} from "../util/Api";
import { User, UpdateUserBody, AddFavourBody, Favour, RemoveFavourBody, Mfa, MfaOtpBody } from "@pld/shared";
import {AxiosError, AxiosResponse} from "axios";

export type CallbackUser = (user: User | null, error?: ApiError) => void;
export type CallbackFavour = (favour: Favour | null, error?: ApiError) => void;

export type CallbackMfa = (mfa: Mfa | null, error?: ApiError) => void;
export type CallbackMfas = (mfa: Mfa[], error?: ApiError) => void;

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
        return callback(null, {message: ['Aucun utilisateur trouvé avec cette adresse email'], type: ErrorType.NO_USER_FOUND_EMAIL});
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

  public static findUserById(userId: string, callback: CallbackUser) {
    api.get<User>(`user/${userId}`).then((response: AxiosResponse<User>) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data)
    });
  }

  public static getFavour(accessToken: string, callback: CallbackFavour) {
    api.get<Favour>(`user/favours/`, authorize(accessToken)).then((response: AxiosResponse<Favour>) => {
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

  public static addFavour(accessToken: string, body: AddFavourBody, callback: CallbackUser) {
    api.post(`user/favours/add`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }


  public static removeFavour(accessToken: string, body: RemoveFavourBody, callback: CallbackUser) {
    api.post(`user/favours/remove`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

  public static deleteAllDevice(accessToken: string, callback: CallbackUser) {
    api.post(`user/devices/clean`, {}, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

  public static getMfa(accessToken: string, callback: CallbackMfas) {
    api.get(`auth/mfa`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback([], err.response?.data);
    });
  }

  public static enableOtp(accessToken: string, callback: CallbackMfa) {
    api.post(`auth/mfa/otp/enable`, {}, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

  public static verifyOtp(accessToken: string, body: MfaOtpBody, callback: CallbackMfa) {
    api.post(`auth/mfa/otp/validate`, body, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

  public static deleteOtp(accessToken: string, otpId: string, callback: CallbackMfa) {
    api.delete(`auth/mfa/otp/${otpId}`, authorize(accessToken)).then((response) => {
      return callback(response.data);
    }).catch((err: AxiosError<ApiError>) => {
      return callback(null, err.response?.data);
    });
  }

}
