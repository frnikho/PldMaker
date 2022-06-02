import React from "react";
import {UserContext, UserContextProvider} from "./context/UserContext";
import {Button} from "carbon-components-react";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./page/HomePage";
import {MainPageLayout} from "./layout/MainPageLayout";

export class Test extends React.Component<unknown, unknown> {

  override render() {
    return (
        <UserContext.Consumer>
          {({isLogged, user, login, logout}) => {
            return (<>
              <h1>{isLogged}</h1>
              <h1>{user}</h1>
              <Button onClick={() => login()}>Login</Button>
              <Button onClick={() => logout()}>Logout</Button>
            </>)
          }}
        </UserContext.Consumer>
    )
  }

}

export class App extends React.Component<unknown, unknown> {

  override render() {
    return (
      <UserContextProvider>
        <Routes>
          <Route path={"/"} element={<MainPageLayout/>}>
            <Route index element={<HomePage/>}/>
          </Route>
        </Routes>
      </UserContextProvider>
    );
  }

}
