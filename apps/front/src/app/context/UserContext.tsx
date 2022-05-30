import React from "react";

export type UserContextProps = {
  login: () => void;
  logout: () => void;
  isLogged: boolean;
  user?: string;
}

export const UserContext = React.createContext<UserContextProps>({
  login: () => null,
  logout: () => null,
  isLogged: false,
});

export type UserContextProviderState = UserContextProps

export type UserContextProviderProps = React.PropsWithChildren<unknown>;

export class UserContextProvider extends React.Component<UserContextProviderProps, UserContextProviderState> {

  constructor(props: UserContextProviderProps) {
    super(props);
    this.state = {
      logout: this.logout.bind(this),
      login: this.login.bind(this),
      isLogged: false,
    }
  }

  public logout() {
    console.log("logout");
    this.setState({
      user: 'Disconnected !',
      isLogged: false,
    })
  }

  public login() {
    console.log("login");
    this.setState({
      user: 'Connected !',
      isLogged: true,
    })
  }

  override render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
