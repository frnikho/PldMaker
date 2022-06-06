import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";

type PldHomeDashboardProps = {

} & RequiredUserContextProps

type PldHomeDashboardState = {
  pld: []
}

export class PldHomeDashboard extends React.Component<PldHomeDashboardProps, PldHomeDashboardState> {

  constructor(props: PldHomeDashboardProps) {
    super(props);
  }

  override componentDidMount() {
    if (this.props.userContext.accessToken === undefined)
      return;
    console.log(this.props.userContext?.user);
  }

  override render() {
    return (
      <div>

      </div>
    );
  }


}
