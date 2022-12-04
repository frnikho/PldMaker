import { Button, InlineLoading } from "carbon-components-react";
import { ButtonKind } from "carbon-components-react/lib/components/Button/Button";

type Props = {
  loading: boolean;
  renderIcon?: unknown;
  style?: React.CSSProperties;
  kind?: ButtonKind;
  onClick: () => void;
};

export const LoadingButton = (props: React.PropsWithChildren<Props>) => {

  if (props.loading) {
    return <Button kind={props.kind} disabled style={props.style} renderIcon={props.renderIcon}>
      <InlineLoading description={"Chargement...."}/>
    </Button>
  }

  return (
    <Button kind={props.kind} onClick={props.onClick} style={props.style} renderIcon={props.renderIcon}>
      {props.children}
    </Button>
  );
};

export const LoadingButtonIcon = (props: React.PropsWithChildren<Props>) => {
  if (props.loading) {
    return <Button hasIconOnly disabled style={props.style} renderIcon={props.renderIcon}>
      <InlineLoading description={"Chargement...."}/>
    </Button>
  }

  return (
    <Button hasIconOnly onClick={props.onClick} style={props.style} renderIcon={props.renderIcon}>
      {props.children}
    </Button>
  );
};
