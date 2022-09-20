import React from "react";
import {Loading, LoadingProps} from "carbon-components-react";

export class CircularProgress extends React.Component<unknown & LoadingProps, unknown> {

  override render() {
    return (
      <Loading {...this.props} withOverlay={false}/>
    );
  }
}
