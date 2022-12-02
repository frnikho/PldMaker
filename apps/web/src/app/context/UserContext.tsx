import React, { useCallback, useContext, useEffect, useState } from "react";
import { Favour, LoginBody, LoginToken, RegisterBody, RegisterResponse, User } from "@pld/shared";
import api, { ApiError, ErrorType } from "../util/Api";
import { useCookies } from "react-cookie";
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";
import { emitBody, SocketContext } from "./SocketContext";
import { AxiosError } from "axios";
import * as socketio from "socket.io-client";

export type UserContextProps = {
  init: () => void;
  login: (loginBody: LoginBody, callback: (user: User | null , error?: ApiError) => unknown) => void;
  register: (registerBody: RegisterBody, callback: (user: User | null , error?: ApiError) => unknown) => void;
  refreshUser: (callback: (user: User | null, error?: ApiError) => unknown) => void;
  refreshFavours: () => void;
  logout: () => void;
  isLogged: LoginState;
  user?: User;
  favours?: Favour;
  accessToken: string;
  setAccessToken: (token: string) => void;
  requiredMfa: boolean;
  saveOtpToken: (token: string, callback: (user: User | null, error?: ApiError) => unknown) => void;
}

export type RequiredUserContextProps = {
  userContext: UserContextProps
}

export enum LoginState {
  logged,
  not_logged,
  loading,
}

type UserToken = {
  user: User;
  accessToken: string;
}

export const UserContext = React.createContext<UserContextProps>({
  init: () => null,
  login: () => null,
  register: () => null,
  logout: () => null,
  isLogged: LoginState.loading,
  refreshUser: () => null,
  refreshFavours: () => null,
  accessToken: '',
  saveOtpToken: () => null,
  requiredMfa: false,
  setAccessToken: () => null,
});

export default ({children}: React.PropsWithChildren) => {

  const [accessToken, setAccessToken] = useState<string>('');
  const [user, setUser] = useState<undefined | User>(undefined);
  const [isLogged, setLoggedState] = useState(LoginState.loading);
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const [requiredMfa, setMfa] = useState<boolean>(false);
  const [favours, setFavours] = useState<Favour | undefined>(undefined);
  const socket = useContext<socketio.Socket>(SocketContext);

  const refreshUser = (callback: (user: User | null, error?: ApiError) => void) => {
    UserApiController.getMe(accessToken, (user, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else if (user !== null) {
        setUser(user);
        callback(user);
      }
    });
  }

  const loadFavour = useCallback((token?: string) => {
    UserApiController.getFavour(token ?? accessToken, (favours, error) => {
      if (error) {
        console.log(error);
      }
      if (favours !== null) {
        setFavours(favours);
      }
    });
  }, [accessToken, setFavours]);

  const refreshFavours = useCallback(() => {
    loadFavour();
  }, [loadFavour]);

  const loadUserFromCookies = useCallback((callback: (token?: UserToken, error?: string) => void): void => {
    const access_token = cookies.access_token;
    if (access_token !== undefined) {
      const loginBody: LoginToken = {access_token};
      UserApiController.getMe(loginBody.access_token, (user, error) => {
        if (user !== null && error === undefined) {
          socket.emit('LoggedUser:New', ...emitBody(loginBody.access_token));
          return callback({user, accessToken: loginBody.access_token});
        } else {
          if (error?.message === 'MFA_OTP_REQUIRED') {
            setLoggedState(LoginState.not_logged);
            setAccessToken(accessToken);
            setMfa(true);
          }
          callback(undefined, 'abc');
        }
      });
    } else {
      return callback(undefined, 'no cookies !');
    }
  }, [accessToken, cookies.access_token, socket]);

  const saveTokenFromCookies = useCallback((accessToken: string): void => {
      setCookie('access_token', accessToken, {path: '/'});
    }
    , [setCookie]);

  const clearTokenFromCookies = useCallback(() => {
    removeCookie('access_token');
  }, [removeCookie]);

  const logout = useCallback(() => {
      clearTokenFromCookies();
      setUser(undefined);
      setLoggedState(LoginState.not_logged);
    }
    , [clearTokenFromCookies, setUser, setLoggedState]);

  const saveOtpToken = (token: string, callback: (user: User | null, error?: ApiError) => unknown) => {
    UserApiController.getMe(token, (user, error) => {
      if (user !== null && error === undefined) {
        saveTokenFromCookies(token);
        setUser(user);
        setAccessToken(accessToken);
        setLoggedState(LoginState.logged);
        socket.emit('LoggedUser:New', ...emitBody(token));
        return callback(user);
      } else {
        saveTokenFromCookies(token);
        setAccessToken(token);
        setLoggedState(LoginState.logged);
        return callback(null, {type:ErrorType.MFA_OTP_REQUIRED, message: ['Mfa otp login required !']});
      }
    });
  }

  const login = useCallback((loginBody: LoginBody, callback: (user: User | null, error?: ApiError) => unknown): void => {
      api.post<LoginToken>(`auth/login`, loginBody).then((response) => {
        if (response.data !== undefined) {
          UserApiController.getMe(response.data.access_token, (user, error) => {
            if (user !== null && error === undefined) {
              saveTokenFromCookies(response.data.access_token);
              setUser(user);
              setAccessToken(response.data.access_token);
              setLoggedState(LoginState.logged);
              socket.emit('LoggedUser:New', ...emitBody(response.data.access_token));
              return callback(user);
            } else {
              saveTokenFromCookies(response.data.access_token);
              setAccessToken(response.data.access_token);
              setLoggedState(LoginState.not_logged);
              return callback(null, {type:ErrorType.MFA_OTP_REQUIRED, message: ['Mfa otp login required !']});
            }
          });
        } else {
          console.log("Response is undefined ");
        }
      }).catch((err: AxiosError<ApiError>) => {
        if (err?.response?.data !== undefined) {
          callback(null, err?.response?.data);
        } else {
          console.log("Error Axios", err);
          toast.error('Une erreur réseaux est survenue !', {icon: '🌐'});
        }
      });
    }
    , [socket, saveTokenFromCookies])

  const register = useCallback((registerBody: RegisterBody, callback: (user: User | null , error?: ApiError) => unknown) => {
    api.post<RegisterResponse>(`auth/register`, registerBody).then((response) => {
      saveTokenFromCookies(response.data.accessToken);
      setUser(response.data.user);
      setLoggedState(LoginState.logged);
      setAccessToken(response.data.accessToken);
      return callback(response.data.user);
    }).catch((error: AxiosError<ApiError>) => {
      if (error?.response?.data !== undefined)
        return callback(null, error?.response?.data);
    });
  }, [saveTokenFromCookies]);

  const init = useCallback(() => {
    loadUserFromCookies((data, error) => {
      if (data?.user !== undefined && error === undefined) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        setLoggedState(LoginState.logged);
        loadFavour(data.accessToken);
      } else {
        setLoggedState(LoginState.not_logged);
      }
    });
  }, [loadFavour, loadUserFromCookies]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <UserContext.Provider value={{refreshUser, refreshFavours, register, login, logout, setAccessToken, saveOtpToken, init, user, accessToken, isLogged, requiredMfa, favours}}>
      {children}
    </UserContext.Provider>
  );
};
