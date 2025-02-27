import React from "react";
import UserContextProvider from "./context/UserContext";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./page/HomePage";
import {MainPageLayout} from "./layout/MainPageLayout";
import {NewOrganizationPage} from "./page/organization/NewOrganizationPage";
import OrganizationPage from "./page/organization/OrganizationPage";
import NewPldPage from "./page/organization/pld/NewPldPage";
import PldPage from "./page/organization/pld/PldPage";
import UserPage from "./page/user/UserPage";
import {PageNotFound} from "./page/PageNotFound";
import NewTemplatePage from "./page/organization/template/NewTemplatePage";
import ManageOrganizationPage from "./page/organization/ManageOrganizationPage";
import {DevicePage} from "./page/user/DevicePage";
import {FAQPage} from "./page/FAQPage";
import NewCalendarPage from "./page/organization/calendar/NewCalendarPage";
import CalendarPage from "./page/organization/calendar/CalendarPage";
import { EventPage } from "./page/organization/calendar/event/EventPage";
import { AuthOtpPage } from "./page/AuthOtpPage";
import EditTemplatePage from "./page/organization/template/EditTemplatePage";
import { ChangelogPage } from "./page/ChangelogPage";
import { MyCalendarPageComponent } from "./page/calendar/MyCalendarPageComponent";
import { ChangePasswordPage } from "./page/user/ChangePasswordPage";
import { ResetPasswordPage } from "./page/auth/ResetPasswordPage";

export function App() {

  const navigate = useNavigate();

  return (
    <UserContextProvider>
      <Routes>
        <Route path={"/"} element={<MainPageLayout/>}>
          <Route index element={<HomePage/>}/>
        </Route>
        <Route path={"/profile"} element={<MainPageLayout />}>
          <Route index element={<UserPage/>}/>
          <Route path={"password"} element={<ChangePasswordPage/>}/>
        </Route>
        <Route path={"/devices"} element={<MainPageLayout />}>
          <Route index element={<DevicePage/>}/>
        </Route>
        <Route path={"/faq"} element={<MainPageLayout redirectIfNotLogged={false}/>}>
          <Route index element={<FAQPage/>}/>
        </Route>
        <Route path={"/calendar"} element={<MainPageLayout />}>
          <Route index element={<MyCalendarPageComponent/>}/>
        </Route>
        <Route path={"/changelog"} element={<MainPageLayout redirectIfNotLogged={false}/>}>
          <Route index element={<ChangelogPage/>}/>
        </Route>
        <Route path={"/auth"} element={<MainPageLayout redirectIfNotLogged={false}/>}>
          <Route path={"otp"} element={<AuthOtpPage navigate={navigate}/>}/>
          <Route path={"reset-password"} element={<ResetPasswordPage/>}></Route>
        </Route>
        <Route path={"/organization"} element={<MainPageLayout />}>
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
            <Route path={"new"} element={<NewTemplatePage navigate={navigate}/>}/>
            <Route path={":templateId"} element={<EditTemplatePage navigate={navigate}/>}/>
          </Route>
        </Route>
        <Route path='*' element={<MainPageLayout redirectIfNotLogged={false}/>}>
          <Route path={'*'} element={<PageNotFound />}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
