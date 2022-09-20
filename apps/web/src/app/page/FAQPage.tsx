import React from "react";
import {FAQComponent} from "../component/home/FAQComponent";

export type FAQPageProps = unknown;
export type FAQPageState = unknown;

export class FAQPage extends React.Component<FAQPageProps, FAQPageState> {

  override render() {
    return (<FAQComponent home={false}/>)
  }

}
