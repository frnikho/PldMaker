import React from "react";
import UserContextProvider from "./context/UserContext";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./page/HomePage";
import {MainPageLayout} from "./layout/MainPageLayout";
import {NewOrganizationPage} from "./page/organization/NewOrganizationPage";
import OrganizationPage from "./page/OrganizationPage";
import NewPldPage from "./page/organization/pld/NewPldPage";
import PldPage from "./page/organization/pld/PldPage";

export class App extends React.Component<unknown, unknown> {

  override render() {
    return (
      <UserContextProvider>
        <Routes>
          <Route path={"/"} element={<MainPageLayout/>}>
            <Route index element={<HomePage/>}/>
          </Route>
          <Route path={"/organization"} element={<MainPageLayout/>}>
            <Route path={"new"} element={<NewOrganizationPage/>}/>
            <Route path={":id"} element={<OrganizationPage/>}/>
            <Route path={":id/pld/new"} element={<NewPldPage/>}/>
            <Route path={":id/pld/:pldId"} element={<PldPage/>}/>
          </Route>
        </Routes>
      </UserContextProvider>
    );
  }

}
