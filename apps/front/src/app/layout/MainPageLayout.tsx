import React from "react";
import {Outlet} from "react-router-dom";
import {
  Column,
  Content,
  Grid,
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  OverflowMenu,
  OverflowMenuItem,
  SideNav, SideNavDivider,
  SideNavItems,
  SideNavLink, SideNavMenu, SideNavMenuItem,
  SkipToContent
} from "carbon-components-react";

import {Layer} from '@carbon/react';

import {Bee, Dashboard, Login, Notification, UserAvatar, Account, Legend} from '@carbon/icons-react'

import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {NavigationState} from "../util/Navigation";
import {AuthModalComponent} from "../component/AuthModalComponent";

export type MainPageLayoutProps = {
  onRedirectUrl: (url: string) => void;
};

export type MainPageLayoutState = {
  login: boolean;
  register: boolean;
} & NavigationState;

export class MainPageLayout extends React.Component<MainPageLayoutProps, MainPageLayoutState> {

  constructor(props: MainPageLayoutProps) {
    super(props);
    this.state = {
      login: false,
      register: false,
      navigateUrl: undefined,
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

  public showLoginButton(): JSX.Element {
    return (
      <>
        <HeaderGlobalAction
          onClick={() => this.openLoginModal()}
          aria-label="Connexion">
          <Login/>
        </HeaderGlobalAction>
        <HeaderGlobalAction
          onClick={() => this.openRegisterModal()}
          aria-label="Inscription">
          <Bee/>
        </HeaderGlobalAction>
      </>
    )
  }

  public showLoginAvatar(auth: UserContextProps): JSX.Element {
    let title: string;
    if (auth.user?.firstname !== undefined && auth.user.lastname !== undefined) {
      title = auth.user.firstname + ' ' + auth.user.lastname;
    } else {
      title = auth.user?.email.split('@')[0] ?? auth.user?.email ?? '';
    }
    return (<>
      <HeaderGlobalAction
        aria-label="Notifications">
        <Notification/>
      </HeaderGlobalAction>
      <OverflowMenu ariaLabel="overflow-menu" style={{marginTop: 'auto', marginBottom: 'auto'}} menuOffset={{left: -60}} renderIcon={UserAvatar}>
        <OverflowMenuItem itemText={title} requireTitle disabled/>
        <OverflowMenuItem itemText="Mon profile" onClick={() => {
          this.props.onRedirectUrl('/profile');
        }} />
        <OverflowMenuItem itemText={"Mes appareils"} onClick={() => {
          this.props.onRedirectUrl('/devices');
        }}/>
        <OverflowMenuItem hasDivider itemText="Se déconnecter" onClick={() => {
          auth.logout();
          this.props.onRedirectUrl('/');
        }} />
      </OverflowMenu>
    </>)
  }

  private showState(auth: UserContextProps) {
    if (auth.isLogged === LoginState.not_logged) {
      return this.showLoginButton();
    } else {
      return this.showLoginAvatar(auth);
    }
  }

  private showFavoursPld(auth: UserContextProps, onClickSideNavExpand: () => void) {
    return auth.favours?.pld.map((pld, index) => {
      return (
        <SideNavLink key={index} onClick={() => {
          onClickSideNavExpand();
          this.props.onRedirectUrl(`/organization/${pld.owner._id}/pld/${pld._id}`)
        }}>
          {pld.title}
        </SideNavLink>
      )
    })
  }

  private showFavoursOrg(auth: UserContextProps, onClickSideNavExpand: () => void) {
    return auth.favours?.org.map((org, index) => {
      return (
        <SideNavMenuItem key={index} onClick={() => {
          onClickSideNavExpand();
          this.props.onRedirectUrl(`/organization/${org._id}`)
        }}>
          {org.name}
        </SideNavMenuItem>
      )
    })
  }

  override render() {
    return (
      <>
        <AuthModalComponent onDismiss={this.onDismissModal} openLoginModal={this.state.login} openRegisterModal={this.state.register} switchModal={this.switchModal} onUserRegistered={this.onUserRegistered} onUserLogged={this.onUserLogged}/>
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <>
              <Header aria-label="IBM Platform Name">
                <SkipToContent />
                <HeaderMenuButton
                  aria-label="Open menu"
                  isCollapsible
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />
                <Layer onClick={() => this.props.onRedirectUrl('/')}>
                  <HeaderName prefix="PLD">
                    [Maker]
                  </HeaderName>
                </Layer>
                <HeaderGlobalBar>
                  <UserContext.Consumer>
                    {(auth) => this.showState(auth)}
                  </UserContext.Consumer>
                </HeaderGlobalBar>
                <SideNav
                  aria-label="Side navigation"
                  isRail
                  isFixedNav
                  expanded={isSideNavExpanded}
                  onOverlayClick={onClickSideNavExpand}>
                  <SideNavItems>
                    <SideNavLink
                      large
                      renderIcon={Dashboard}>
                      Dashboard
                    </SideNavLink>
                    <SideNavLink
                      large
                      renderIcon={Account}>
                      Organisations
                    </SideNavLink>
                    <SideNavLink
                      large
                      onClick={() => this.props.onRedirectUrl(`/faq`)}
                      renderIcon={Legend}>
                      FAQ
                    </SideNavLink>
                    <SideNavDivider/>
                    <SideNavMenu title="Organisation" large>
                      <UserContext.Consumer>
                        {(auth) => this.showFavoursOrg(auth, onClickSideNavExpand)}
                      </UserContext.Consumer>
                    </SideNavMenu>
                    <SideNavMenu title="PLD" large>
                      <UserContext.Consumer>
                        {(auth) => this.showFavoursPld(auth, onClickSideNavExpand)}
                      </UserContext.Consumer>
                    </SideNavMenu>
{/*                    <SideNavLink
                      large
                      renderIcon={Events}>
                      Organisation
                    </SideNavLink>
                    <UserContext.Consumer>
                      {(auth) => this.showFavoursPld(auth, onClickSideNavExpand)}
                    </UserContext.Consumer>
                    <SideNavLink
                      large
                      renderIcon={DocumentBlank}>
                      PLD
                    </SideNavLink>
                    <UserContext.Consumer>
                      {(auth) => this.showFavoursPld(auth, onClickSideNavExpand)}
                    </UserContext.Consumer>*/}
                  </SideNavItems>
                </SideNav>
              </Header>
              <Content id="main-content"
                   onClick={() => {
                     if (isSideNavExpanded)
                      onClickSideNavExpand();
                   }}>
                <Grid condensed={false}>
                  <Column sm={4} md={8} lg={16} style={{marginLeft: isSideNavExpanded ? 80 : 0, transition: '0.15s'}}>
                    <Outlet/>
                  </Column>
                </Grid>
              </Content>
            </>
          )}
        />
      </>
    )
  }

}
