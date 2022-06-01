import React from "react";
import {Outlet} from "react-router-dom";
import {
  Button, ButtonSkeleton, Content,
  Header,
  HeaderContainer, HeaderGlobalAction, HeaderGlobalBar, HeaderMenu,
  HeaderMenuButton, HeaderMenuItem,
  HeaderName, HeaderNavigation,
  SideNav,
  SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem,
  SkipToContent
} from "carbon-components-react";

import {Bee, Notification, Login, Dashboard, Events} from '@carbon/icons-react'

import {UserContext, UserContextProps} from "../context/UserContext";
import {AuthModalComponent} from "../component/AuthModalComponent";

export type MainPageLayoutState = {
  modal: {
    login: boolean;
    register: boolean;
  }
}

export class MainPageLayout extends React.Component<unknown, MainPageLayoutState> {

  constructor(props) {
    super(props);
    this.state = {
      modal: {
        login: false,
        register: false,
      }
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
        <AuthModalComponent openLoginModal={this.state.modal.login} openRegisterModal={this.state.modal.register}/>
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
    return <h4 style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '20px'}}>{auth.user?.email}</h4>
  }
  override render() {
    return (
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
            <HeaderName href="#" prefix="PLD">
                [Maker]
            </HeaderName>
            <HeaderGlobalBar>
{/*              <HeaderGlobalAction
                aria-label="Notifications"
                onClick={() => null}>
                <Notification size={20} />
              </HeaderGlobalAction>*/}
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
            <Outlet/>
          </Content>
        </>
       )}
     />
    )
  }

}
