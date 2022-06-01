import React from "react";
import {RequiredUserContextProps} from "../context/UserContext";

type OrganizationHomeDashboardProps = {

} & RequiredUserContextProps

type OrganizationHomeDashboardState = {

}

export class OrganizationHomeDashboard extends React.Component<OrganizationHomeDashboardProps, OrganizationHomeDashboardState> {

  constructor(props: OrganizationHomeDashboardProps) {
    super(props);
  }

  override componentDidMount() {
    console.log(this.props.userContext?.user);
  }

  override render() {
    return (
      <div>

      </div>
    );
  }


}
