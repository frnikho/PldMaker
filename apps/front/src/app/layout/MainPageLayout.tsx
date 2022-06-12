import React from "react";
import {Outlet} from "react-router-dom";
import {
  Column, Content, Dropdown, Grid,
  Header,
  HeaderContainer, HeaderGlobalAction, HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName, OverflowMenu, OverflowMenuItem,
  SideNav,
  SideNavItems, SideNavLink,
  SkipToContent, Tile
} from "carbon-components-react";

import {Layer} from '@carbon/react';

import {Bee, Login, Dashboard, Events, UserAvatar, Notification} from '@carbon/icons-react'

import {UserContext, UserContextProps} from "../context/UserContext";
import {AuthModalComponent} from "../component/AuthModalComponent";
import {NavigationState} from "../util/Navigation";

export type MainPageLayoutProps = {
  onRedirectUrl: (url: string) => void;
};

export type MainPageLayoutState = {
  modal: {
    login: boolean;
    register: boolean;
  }
} & NavigationState;

export class MainPageLayout extends React.Component<MainPageLayoutProps, MainPageLayoutState> {

  constructor(props: MainPageLayoutProps) {
    super(props);
    this.state = {
      modal: {
        login: false,
        register: false,
      },
      navigateUrl: undefined,
    }
  }

  public openLoginModal() {
    this.setState({
      modal: {
        login: true,
        register: false
      }
    })
  }

  public openRegisterModal() {
    this.setState({
      modal: {
        login: false,
        register: true
      }
    })
  }

  public showLoginButton(auth: UserContextProps): JSX.Element {
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
        <OverflowMenuItem itemText="Mon profile" onClick={(e) => {
          this.props.onRedirectUrl('/profile')
        }} />
        <OverflowMenuItem itemText="Settings" />
        <OverflowMenuItem hasDivider itemText="Se déconnecter" onClick={(e) => {
          auth.logout();
          this.props.onRedirectUrl('/');
        }} />
      </OverflowMenu>
    </>)
  }
  override render() {
    return (
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
         <>
           <AuthModalComponent openLoginModal={this.state.modal.login} openRegisterModal={this.state.modal.register}/>
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
                {(auth) => {
                  if (!auth.isLogged) {
                    return this.showLoginButton(auth);
                  } else {
                    return this.showLoginAvatar(auth);
                  }
                }}
              </UserContext.Consumer>
            </HeaderGlobalBar>
            <SideNav
              aria-label="Side navigation"
              isRail
              expanded={isSideNavExpanded}
              onOverlayClick={onClickSideNavExpand}>
                <SideNavItems>
                <SideNavLink
                  renderIcon={Dashboard}>
                    Dashboard
                </SideNavLink>
                <SideNavLink
                  renderIcon={Events}>
                    Organisation
                </SideNavLink>
              </SideNavItems>
            </SideNav>
          </Header>
          <Content id="main-content">
            <Grid>
              <Column sm={4} md={8} lg={16}>
                <Outlet/>
              </Column>
            </Grid>
          </Content>
        </>
       )}
     />
    )
  }

}
