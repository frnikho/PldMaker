import React from "react";
import UserContextProvider, {UserContext} from "./context/UserContext";
import {Button} from "carbon-components-react";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./page/HomePage";
import {MainPageLayout} from "./layout/MainPageLayout";

export class Test extends React.Component<unknown, unknown> {

  override render() {
    return (
        <UserContext.Consumer>
          {({isLogged, logout}) => {
            return (<>
              <h1>{isLogged}</h1>
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
