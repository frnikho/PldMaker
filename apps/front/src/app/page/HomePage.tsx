import React from "react";
import {Test} from "../app";
import {Button} from "carbon-components-react";
import {LoginModal} from "../modal/LoginModal";

export type HomePageProps = unknown;
export type HomePageState = {
  loginOpenModal: boolean;
};

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      loginOpenModal: false,
    }
  }

  override componentDidMount() {
    console.log("Homepage");
  }



  override render() {
    return (
        <>
          <Button onClick={() => this.setState({loginOpenModal: true})}>
            Login
          </Button>
          <LoginModal open={this.state.loginOpenModal} onDismiss={() => this.setState({loginOpenModal: false})}/>
          <Test/>
        </>
    );
  }

}
