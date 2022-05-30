import React from "react";
import {Outlet} from "react-router-dom";

export class MainPageLayout extends React.Component<unknown, unknown> {

  override render() {
    return (
      <Outlet/>
    );
  }

}
