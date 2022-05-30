import React from "react";
import {Cookies, ReactCookieProps, withCookies} from "react-cookie";
import api from "../util/api";
import {User} from "../../../../../libs/data-access/user/User";
import {LoginToken} from "../../../../../libs/data-access/auth/LoginToken";
import {AxiosError, AxiosResponse} from "axios";
import {LoginBody} from "../../../../../libs/data-access/auth/LoginBody";
import {RegisterUserBody} from "../../../../../libs/data-access/auth/RegisterUserBody";
import {RegisterResponse} from "../../../../../libs/data-access/auth/RegisterResponse";

export const ACCESS_TOKEN_COOKIE_NS = 'access_token';

export type UserContextProps = {
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string) => Promise<unknown | null>;
  logout: () => void;
  isLogged: boolean;
  user?: User;
  accessToken?: string;
}

export const UserContext = React.createContext<UserContextProps>({
  login: async () => null,
  register: async () => null,
  logout: () => null,
  isLogged: false,
});

export type UserContextProviderState = UserContextProps
export type UserContextProviderProps = React.PropsWithChildren<unknown> & ReactCookieProps;

class UserContextProvider extends React.Component<UserContextProviderProps, UserContextProviderState> {

  constructor(props: UserContextProviderProps) {
    super(props);
    this.state = {
      logout: this.logout.bind(this),
      login: this.login.bind(this),
      register: this.register.bind(this),
      isLogged: false,
    }
  }

  override componentDidMount() {
    if (this.props.cookies !== undefined) {
      this.loadUserFromCookies(this.props.cookies).then((data) => {
        if (data?.user !== undefined) {
          this.setState({
            user: data.user,
            accessToken: data.accessToken
          })
        }
      });
    }
  }

  public async loadUserFromCookies(cookies: Cookies): Promise<{ user: User, accessToken: string } | null> {
    const access_token = cookies.get(ACCESS_TOKEN_COOKIE_NS);
    if (access_token !== undefined) {
      const loginBody: LoginToken = {access_token};
      const response: AxiosResponse | AxiosError = await api.post(`user`, loginBody);
      console.log(response);
    }
    return null;
  }

  public logout() {
    this.setState({
      user: undefined,
      isLogged: false,
    })
  }

  public async login(email: string, password: string): Promise<User | null> {
    const loginBody: LoginBody = {email, password};
    try {
      const response: AxiosResponse<LoginToken> = await api.post(`auth/login`, loginBody);
      console.log(response);
    } catch (ex) {
      console.log(ex);
      return null;
    }
    return null;
  }

  public async register(email: string, password: string): Promise<User | null> {
    const registerBody: RegisterUserBody = {password, email};
    try {
      const response: AxiosResponse<RegisterResponse> = await api.post(`auth/register`, registerBody);
      this.setState({
        isLogged: true,
        user: response.data.user,
        accessToken: response.data.accessToken
      });
      return response.data.user;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  override render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default withCookies(UserContextProvider);
