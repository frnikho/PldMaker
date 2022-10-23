import React from "react";
import { Button, ButtonProps, InlineLoading } from "carbon-components-react";
import { ButtonStyle } from "@pld/ui";

export type LoadingButtonProps = {
  isloading: boolean;
  message?: string;
} & Partial<ButtonProps>;

type OnlyButtonProps = Omit<ButtonProps, 'isloading'>;

export type LoadingButtonState = {

}

export class LoadingButtonComponent extends React.Component<React.PropsWithChildren<LoadingButtonProps>, LoadingButtonState> {

  constructor(props: LoadingButtonProps) {
    super(props);
  }

  override render() {
    if (this.props.isloading) {
      return (
        <Button style={ButtonStyle.default} disabled {...this.props}>
          <InlineLoading description={this.props.message ?? 'Chargement en cours ...'}/>
        </Button>
      )
    } else {
      return (
        <Button disabled={false} {...this.props}>
          {this.props.children}
        </Button>
      )
    }
  }

}
