import React from "react";
import {FAQComponent} from "../component/home/FAQComponent";

export type FAQPageProps = {}

export type FAQPageState = {

}

export class FAQPage extends React.Component<FAQPageProps, FAQPageState> {

  constructor(props: FAQPageProps) {
    super(props);
  }

  override render() {
    return (
      <>
        <FAQComponent home={false}/>
      </>
    )
  }

}
