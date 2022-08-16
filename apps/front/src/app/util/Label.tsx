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

export type HelpLabelProps = {
  message: string;
  italic?: boolean;
}

export class HelpLabel extends React.Component<HelpLabelProps, any> {
  static defaultProps = {
    italic: true,
  }

  constructor(props) {
    super(props);
  }

  override render() {
    return (
      <FormLabel style={{fontStyle: this.props.italic ? 'italic' : 'normal', color: 'black'}}>
        {this.props.message}
      </FormLabel>
    );
  }

}
