import React from "react";
import {Outlet} from "react-router-dom";

export class AuthPageLayout extends React.Component<unknown, unknown> {

  override render() {
    return (
      <Outlet />
    );
  }

}
