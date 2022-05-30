import React from "react";
import {Test} from "../app";
import {Button} from "carbon-components-react";
import {LoginModal} from "../modal/LoginModal";
import {RegisterModal} from "../modal/RegisterModal";

export type HomePageProps = unknown;
export type HomePageState = {
  loginOpenModal: boolean;
  registerOpenModal: boolean;
};

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      loginOpenModal: false,
      registerOpenModal: false,
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
          <Button onClick={() => this.setState({registerOpenModal: true})}>
            Register
          </Button>
          <LoginModal open={this.state.loginOpenModal} onDismiss={() => this.setState({loginOpenModal: false})}/>
          <RegisterModal open={this.state.registerOpenModal} onDismiss={() => this.setState({registerOpenModal: false})}/>
          <Test/>
        </>
    );
  }

}
