import * as React from "react";
import { Text } from "../../util/Dom";

type Props = {
  style?: React.CSSProperties;
  children: string;
};
export const Title = (props: Props) => {
  return (
    <Text style={props.style}>
      {props.children}
    </Text>
  );
};
