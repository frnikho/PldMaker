import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {ClickableTile, Column, Grid, SkeletonPlaceholder, Tile} from "carbon-components-react";
import {SocketContext} from "../context/SocketContext";
import Lottie from 'lottie-react'

import {Stack} from '@carbon/react';
import {AuthModalComponent} from "../component/AuthModalComponent";
import OrganizationHomeDashboard from "../component/home/OrganizationHomeDashboard";
import {FAQComponent} from "../component/home/FAQComponent";
import { Navigate } from "react-router-dom";
import { LanguageProps, withLanguage } from "../context/LanguageContext";
import { language } from "../language";

export type HomePageProps = LanguageProps;
export type HomePageState = {
  login: boolean;
  register: boolean;
  redirect?: string;
};

class HomePage extends React.Component<HomePageProps, HomePageState> {

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
        <Tile style={style.tile}>
          <h1 style={{fontWeight: 'bold'}}>Bienvenue sur PLD <span style={{fontWeight: 'bold'}}>[Maker]</span></h1>
          <p style={{marginTop: 10}}>PLD Maker est une application web opensource vous permettant de suivre votre avancement dans votre EIP.</p>
        </Tile>
        <Grid>
          <Column sm={4} md={3} xlg={5}>
            <ClickableTile style={style.tile} onClick={() => this.setState({login: true})}>
              <h3 style={{fontWeight: 'bold'}}>Se connecter</h3>
              <p style={{marginTop: 5, marginBottom: 20}}>Retrouvez l'avancement de vos PLD ainsi que de leurs contenus en vous connectant</p>
              <Lottie animationData={require('../../assets/animations/login.json')} loop={true} style={{height: '300px'}}/>
            </ClickableTile>
          </Column>
          <Column sm={4} md={3} xlg={5}>
            <ClickableTile style={style.tile} onClick={() => this.setState({register: true})}>
              <h3 style={{fontWeight: 'bold'}}>Créer mon compte</h3>
              <p style={{marginTop: 5, marginBottom: 20}}>En vous inscrivant, vous pourrez créer et suivre l'avancement de vos PLDs avec votre équipe</p>
              <Lottie animationData={require('../../assets/animations/register.json')} loop={true} style={{height: '300px'}}/>
            </ClickableTile>
          </Column>
          <Column sm={4} md={3} xlg={6}>
            <Tile style={style.tile}>
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
        <div style={{marginTop: 20}}>
          <h1 style={{fontWeight: 'bold'}}>{this.props.language.getTranslation(language.home.welcomeDashboard.title)}</h1>
          <p>{this.props.language.getTranslation(language.home.welcomeDashboard.subTitle)}</p>
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

const style = {
  tile: {
    borderRadius: 8,
  }
};

export default withLanguage(HomePage);
