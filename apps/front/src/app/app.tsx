import React from "react";
import UserContextProvider from "./context/UserContext";
import {Route, Routes, useNavigate} from "react-router-dom";
import {HomePage} from "./page/HomePage";
import {MainPageLayout} from "./layout/MainPageLayout";
import {NewOrganizationPage} from "./page/organization/NewOrganizationPage";
import OrganizationPage from "./page/OrganizationPage";
import NewPldPage from "./page/organization/pld/NewPldPage";
import PldPage from "./page/organization/pld/PldPage";
import {UserPage} from "./page/UserPage";
import {PageNotFound} from "./page/PageNotFound";

export function App() {

  const navigate = useNavigate();

  const onRedirect = (url: string) => {
    navigate(url);
  }

  return (
    <UserContextProvider>
        <Routes>
          <Route path={"/"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
            <Route index element={<HomePage/>}/>
          </Route>
          <Route path={"/profile"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
            <Route index element={<UserPage/>}/>
          </Route>
          <Route path={"/organization"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
            <Route path={"new"} element={<NewOrganizationPage/>}/>
            <Route path={":id"} element={<OrganizationPage/>}/>
            <Route path={":id/pld/new"} element={<NewPldPage/>}/>
            <Route path={":id/pld/:pldId"} element={<PldPage/>}/>
          </Route>
          <Route path='*' element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
            <Route path={'*'} element={<PageNotFound />}/>
          </Route>
        </Routes>
    </UserContextProvider>
  );
}
