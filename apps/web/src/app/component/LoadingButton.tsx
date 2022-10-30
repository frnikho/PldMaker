import React, { ReactNode } from "react";
import { Button, ButtonKind, ButtonProps, InlineLoading } from "carbon-components-react";
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

type Props = {
  loading: boolean;
  children: ReactNode;
  message?: string;
  icon?: object;
  style?: React.CSSProperties;
  kind?: ButtonKind;
  disabled?: boolean;
  onClick?: () => void;
};

export const LoadingButton = (props: Props) => {

  if (props.loading) {
    return (
      <Button style={props.style ?? ButtonStyle.default} disabled kind={props.kind ?? 'primary'} renderIcon={props.icon}>
        <InlineLoading description={props.message ?? 'Chargement en cours ...'}/>
      </Button>
    );
  } else {
    return (
      <Button style={props.style ?? ButtonStyle.default} disabled={props.disabled ?? false} renderIcon={props.icon} onClick={props.onClick}>
        {props.children}
      </Button>
    )
  }


};
