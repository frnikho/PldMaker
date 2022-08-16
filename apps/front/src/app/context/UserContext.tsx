import React from "react";
import {Cookies, ReactCookieProps, withCookies} from "react-cookie";
import api, {ApiError} from "../util/Api";
import {User} from "../../../../../libs/data-access/user/User";
import {LoginToken} from "../../../../../libs/data-access/auth/LoginToken";
import {AxiosError} from "axios";
import {LoginBody} from "../../../../../libs/data-access/auth/LoginBody";
import {RegisterBody} from "../../../../../libs/data-access/auth/RegisterBody";
import {RegisterResponse} from "../../../../../libs/data-access/auth/RegisterResponse";
import {UserApiController} from "../controller/UserApiController";
import {emitBody, SocketContext} from "./SocketContext";
import {Favour} from "../../../../../libs/data-access/user/Favour";
import {toast} from "react-toastify";

export const ACCESS_TOKEN_COOKIE_NS = 'access_token';

export type UserContextProps = {
  login: (loginBody: LoginBody, callback: (user: User | null , error?: ApiError) => unknown) => void;
  register: (registerBody: RegisterBody, callback: (user: User | null , error?: ApiError) => unknown) => void;
  refreshUser: () => void;
  refreshFavours: () => void;
  logout: () => void;
  isLogged: LoginState;
  user?: User;
  favours?: Favour;
  accessToken: string;
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
  login: () => null,
  register: () => null,
  logout: () => null,
  isLogged: LoginState.loading,
  refreshUser: () => null,
  refreshFavours: () => null,
  accessToken: '',
});

export type UserContextProviderState = UserContextProps
export type UserContextProviderProps = React.PropsWithChildren<unknown> & ReactCookieProps;

class UserContextProvider extends React.Component<UserContextProviderProps, UserContextProviderState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props: UserContextProviderProps) {
    super(props);
    this.state = {
      logout: this.logout.bind(this),
      login: this.login.bind(this),
      register: this.register.bind(this),
      isLogged: LoginState.loading,
      user: undefined,
      accessToken: '',
      refreshUser: this.refreshUser.bind(this),
      refreshFavours: this.refreshFavours.bind(this),
    }
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
  }

  override componentDidMount() {
    if (this.props.cookies !== undefined) {
      this.loadUserFromCookies(this.props.cookies, (data, error) => {
        if (data?.user !== undefined && error === undefined) {
          this.setState({
            isLogged: LoginState.logged,
            user: data.user,
            accessToken: data.accessToken,
          });
          this.loadFavour(data.accessToken);
        } else {
          this.setState({
            isLogged: LoginState.not_logged,
          })
        }
      });
    }
  }

  public refreshFavours() {
    this.loadFavour();
  }

  public refreshUser() {
    UserApiController.getMe(this.state.accessToken, (user, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      }
      if (user !== null) {
        this.setState({
          user: user,
        })
      }
    });
  }

  public loadFavour(accessToken?: string) {
    UserApiController.getFavour(accessToken ?? this.state.accessToken, (favours, error) => {
      if (error) {
        console.log(error);
      }
      if (favours !== null) {
        this.setState({
          favours: favours,
        })
      }
    });
  }

  public loadUserFromCookies(cookies: Cookies, callback: (token?: UserToken, error?: string) => void): void {
    const access_token = cookies.get(ACCESS_TOKEN_COOKIE_NS);
    if (access_token !== undefined) {
      const loginBody: LoginToken = {access_token};
      UserApiController.getMe(loginBody.access_token, (user, error) => {
        if (user !== null && error === undefined) {
          this.context.emit('LoggedUser:New', ...emitBody(loginBody.access_token));
          return callback({user, accessToken: loginBody.access_token});
        }
      });
    } else {
      return callback(undefined, 'no cookies !');
    }
  }

  public saveTokenFromCookies(accessToken: string, cookies: Cookies): void {
    cookies.set(ACCESS_TOKEN_COOKIE_NS, accessToken, {path: '/'});
  }

  public clearTokenFromCookies(cookies: Cookies): void {
    cookies.remove(ACCESS_TOKEN_COOKIE_NS, {path: '/'});
  }

  public logout() {
    if (this.props.cookies === undefined)
      return;
    this.clearTokenFromCookies(this.props.cookies);
    this.setState({
      user: undefined,
      isLogged: LoginState.not_logged,
    });
  }

  public login(loginBody: LoginBody, callback: (user: User | null, error?: ApiError) => unknown): void {
    if (this.props.cookies === undefined) {
      // TODO check error
      console.log("error cookies")
      callback(null);
      return;
    }
    api.post<LoginToken>(`auth/login`, loginBody).then((response) => {
      if (response.data !== undefined) {
        UserApiController.getMe(response.data.access_token, (user, error) => {
          if (user !== null && error === undefined && this.props?.cookies !== undefined) {
            this.saveTokenFromCookies(response.data.access_token, this.props.cookies);
            this.setState({
              user: user,
              accessToken: response.data.access_token,
              isLogged: LoginState.logged
            })
            this.context.emit('LoggedUser:New', ...emitBody(response.data.access_token));
            return callback(user);
          } else {
            console.log('Error login:', error);
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

  public register(registerBody: RegisterBody, callback: (user: User | null , error?: ApiError) => unknown): void {
    api.post<RegisterResponse>(`auth/register`, registerBody).then((response) => {
      if (this.props.cookies !== undefined)
        this.saveTokenFromCookies(response.data.accessToken, this.props.cookies);
      this.setState({
        isLogged: LoginState.logged,
        user: response.data.user,
        accessToken: response.data.accessToken
      });
      return callback(response.data.user);
    }).catch((error: AxiosError<ApiError>) => {
      if (error?.response?.data !== undefined)
        return callback(null, error?.response?.data);
    });
  }

  override render() {
    return (
      <UserContext.Provider value={{...this.state}}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export type RequiredUserContextProps = {
  userContext: UserContextProps
}

export default withCookies(UserContextProvider);
