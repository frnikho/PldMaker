import * as DOMPurify from 'dompurify';
import { getHTMLPlaceholders } from "./Placeholders";
import React from "react";

type Props = {
  children: string;
  style?: React.CSSProperties;
}

export const Text = (props: Props) => {
  return (
    <p style={props.style} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(getHTMLPlaceholders(props.children))}}/>
  )
}
