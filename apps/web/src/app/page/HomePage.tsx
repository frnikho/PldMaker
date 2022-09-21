import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {ClickableTile, Column, Grid, SkeletonPlaceholder, Tile} from "carbon-components-react";
import {SocketContext} from "../context/SocketContext";
import Lottie from 'lottie-react'

import {Stack} from '@carbon/react';
import {AuthModalComponent} from "../component/AuthModalComponent";
import {OrganizationHomeDashboard} from "../component/home/OrganizationHomeDashboard";
import {FAQComponent} from "../component/home/FAQComponent";
import { Navigate } from "react-router-dom";

export type HomePageProps = unknown;
export type HomePageState = {
  login: boolean;
  register: boolean;
  redirect?: string;
};

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      login: false,
      register: false,
    }
    this.switchModal = this.switchModal.bind(this);
    this.onUserRegistered = this.onUserLogged.bind(this);
    this.onUserLogged = this.onUserLogged.bind(this);
    this.onDismissModal = this.onDismissModal.bind(this);
  }

  public openLoginModal() {
    this.setState({
      login: true,
      register: false
    })
  }

  public openRegisterModal() {
    this.setState({
      login: false,
      register: true
    })
  }

  public onUserRegistered() {
    this.setState({
      register: false,
      login: false,
    });
  }

  public onUserLogged() {
    this.setState({
      register: false,
      login: false,
    });
  }

  public switchModal() {
    if (this.state.login) {
      this.setState({
        login: false,
        register: true
      });
    } else {
      this.setState({
        login: true,
        register: false
      });
    }
  }

  public onDismissModal() {
    this.setState({
      login: false,
      register: false,
    })
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return this.showWelcome();
    } else if (authContext.isLogged === LoginState.logged) {
      return this.showDashboard(authContext);
    }
    return (
      <>
        <SkeletonPlaceholder style={{height: '20px', width: '20%'}}/>
        <SkeletonPlaceholder style={{marginTop: '50px', height: '20px', width: '20%'}}/>
      </>
    )
  }

  private showWelcome() {
    return (
      <Stack gap={6}>
        <AuthModalComponent onRedirect={() => this.setState({redirect: 'auth/otp'})} onDismiss={this.onDismissModal} openLoginModal={this.state.login} openRegisterModal={this.state.register} switchModal={this.switchModal} onUserRegistered={this.onUserRegistered} onUserLogged={this.onUserLogged}/>
        <Tile>
          <h1 style={{fontWeight: 500}}>Bienvenue sur votre PLD <span style={{fontWeight: 'bold'}}>[Maker]</span></h1>
          <p style={{marginTop: 10}}>PLD Maker est une web app vous permettant de suivre votre avancement dans votre EIP</p>
        </Tile>
        <Grid>
          <Column sm={4} md={3} xlg={5}>
            <ClickableTile onClick={() => this.setState({login: true})}>
              <h3>Se connecter</h3>
              <p style={{marginTop: 5, marginBottom: 20}}>Retrouvez l'avancement de vos PLD ainsi que de leurs contenus en vous connectant</p>
              <Lottie animationData={require('../../assets/animations/login.json')} loop={true} style={{height: '300px'}}/>
            </ClickableTile>
          </Column>
          <Column sm={4} md={3} xlg={5}>
            <ClickableTile onClick={() => this.setState({register: true})}>
              <h3>Créer mon compte</h3>
              <p style={{marginTop: 5, marginBottom: 20}}>En vous inscrivant, vous pourrez créer et suivre l'avancement de vos PLDs avec votre équipe</p>
              <Lottie animationData={require('../../assets/animations/register.json')} loop={true} style={{height: '300px'}}/>
            </ClickableTile>
          </Column>
          <Column sm={4} md={3} xlg={6}>
            <Tile>
              <FAQComponent home={true}/>
            </Tile>
          </Column>
        </Grid>
      </Stack>
    )
  }

  private showDashboard(userContext: UserContextProps) {
    return (
      <Stack>
        <Tile>
          <p style={{fontSize: 20}}>Hello World</p>
          <p style={{fontSize: 14}}>Bienvenue sur votre tableau de bord</p>
        </Tile>
        <div style={{marginTop: 20}}>
          <h1>Bienvenue sur votre tableau de bord</h1>
          <p>Ici vous pouvez suivre l'avancement des PLDs et de leurs DoDs de vos différentes Organisation</p>
        </div>
        <div style={{marginTop: 40}}>
          <OrganizationHomeDashboard userContext={userContext}/>
        </div>
      </Stack>
    )
  }

  override render() {
    return (
      <>
        {this.state.redirect ? <Navigate to={this.state.redirect}/> : null}
        <UserContext.Consumer>
          {userContext => this.showState(userContext)}
        </UserContext.Consumer>
      </>
    );
  }

}

