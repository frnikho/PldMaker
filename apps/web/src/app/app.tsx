import React from "react";
import UserContextProvider from "./context/UserContext";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./page/HomePage";
import {MainPageLayout} from "./layout/MainPageLayout";
import {NewOrganizationPage} from "./page/organization/NewOrganizationPage";
import OrganizationPage from "./page/OrganizationPage";
import NewPldPage from "./page/organization/pld/NewPldPage";
import PldPage from "./page/organization/pld/PldPage";
import UserPage from "./page/UserPage";
import {PageNotFound} from "./page/PageNotFound";
import NewTemplatePage from "./page/organization/template/NewTemplatePage";
import {ViewMode} from "./component/template/NewTemplateComponent";
import ManageOrganizationPage from "./page/organization/ManageOrganizationPage";
import {DevicePage} from "./page/DevicePage";
import {FAQPage} from "./page/FAQPage";
import NewCalendarPage from "./page/organization/calendar/NewCalendarPage";
import CalendarPage from "./page/organization/calendar/CalendarPage";
import EventPage from "./page/organization/calendar/event/EventPage";
import { AuthOtpPage } from "./page/AuthOtpPage";
import { Abc } from "./util/Page";

export function App() {

  const navigate = useNavigate();

  const onRedirect = (url: string) => {
    navigate(url);
  }

  return (
    <UserContextProvider>
      <Routes>
        <Route path={"/abc"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route index element={<Abc/>}/>
        </Route>
        <Route path={"/"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route index element={<HomePage/>}/>
        </Route>
        <Route path={"/profile"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route index element={<UserPage/>}/>
        </Route>
        <Route path={"/devices"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route index element={<DevicePage/>}/>
        </Route>
        <Route path={"/faq"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route index element={<FAQPage/>}/>
        </Route>
        <Route path={"/auth/otp"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route index element={<AuthOtpPage navigate={navigate}/>}/>
        </Route>
        <Route path={"/organization"} element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route path={"new"} element={<NewOrganizationPage/>}/>
          <Route path={":id"} element={<OrganizationPage/>}/>
          <Route path={":id/manage"} element={<ManageOrganizationPage/>}/>
          <Route path={":id/pld/new"} element={<NewPldPage/>}/>
          <Route path={":id/pld/:pldId"} element={<PldPage/>}/>
          <Route path={":id/calendar"}>
            <Route index element={<Navigate to={"new"}/>}/>
            <Route path={"new"} element={<NewCalendarPage/>}/>
            <Route path={":calendarId"} element={<CalendarPage/>}/>
            <Route path={":calendarId/event"}>
              <Route path={":eventId"} element={<EventPage/>}/>
            </Route>
          </Route>
          <Route path={":id/template"}>
            <Route index element={<Navigate to={"new"}/>}/>
            <Route path={"new"} element={<NewTemplatePage navigate={navigate} mode={ViewMode.New}/>}/>
            <Route path={":templateId"} element={<Navigate to={"preview"}/>}/>
            <Route path={":templateId/edit"} element={<NewTemplatePage mode={ViewMode.Edit}/>}/>
            <Route path={":templateId/preview"} element={<NewTemplatePage mode={ViewMode.Preview}/>}/>
          </Route>
        </Route>
        <Route path='*' element={<MainPageLayout onRedirectUrl={onRedirect}/>}>
          <Route path={'*'} element={<PageNotFound />}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
