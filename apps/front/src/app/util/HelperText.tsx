import React from "react";

import {Stack, Toggletip, ToggletipContent, ToggletipButton} from '@carbon/react';

import {Help, Information} from '@carbon/icons-react';

export type HelperProps = {
  type: ('help' | 'info');
  title: React.ReactNode;
  helpMessage: React.ReactNode;
  logoSize?: number;
}

export class HelperText extends React.Component<HelperProps, unknown> {

  private getIcon() {
    const props = {
      size: this.props.logoSize ?? 24,
    }
    if (this.props.type === 'info') {
      return (<Information className={"sb-tooltip-trigger"} {...props} style={{margin: 'auto'}}/>)
    } else {
      return (<Help className={"sb-tooltip-trigger"} {...props} style={{margin: 'auto'}}/>)
    }
  }

  private showLogo() {
    return (
      <Toggletip>
       <ToggletipButton label="Show information" style={{margin: 'auto'}}>
         {this.getIcon()}
       </ToggletipButton>
       <ToggletipContent>
          {this.props.helpMessage}
        </ToggletipContent>
      </Toggletip>
    )
  }

  override render() {
    return (
      <div className={"helper-component"}>
        <Stack orientation={"horizontal"}>
          {this.props.title}
          {this.showLogo()}
        </Stack>
      </div>
    );
  }

}
