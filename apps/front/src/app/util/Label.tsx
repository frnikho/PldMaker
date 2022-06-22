import React from "react";

import {FormLabel} from "carbon-components-react";

export type RequiredLabelProps = {
  message: string;
}

export class RequiredLabel extends React.Component<RequiredLabelProps, unknown> {

  override render() {
    return (
      <FormLabel style={{display: 'flex'}}>{this.props.message} *</FormLabel>
    );
  }

}
