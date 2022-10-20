import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Column,
  Content,
  Grid,
  Header,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  SideNav, SideNavDivider,
  SideNavItems,
  SideNavLink, SideNavMenu, SideNavMenuItem,
  SkipToContent
} from "carbon-components-react";

import {Layer} from '@carbon/react';

import {Dashboard, Legend, MessageQueue} from '@carbon/icons-react'

import {UserContext, UserContextProps} from "../context/UserContext";
import { useLanguage } from "../hook/useLanguage";
import { UserMenu } from "./menu/UserMenu";

export const MainPageLayout = () => {

  const {translate} = useLanguage();
  const navigate = useNavigate();

  const showFavoursPld = (auth: UserContextProps, onClickSideNavExpand: () => void) => {
    if (auth.favours?.pld === undefined || auth.favours.pld.length <= 0)
      return;
    return (
      <SideNavMenu defaultExpanded title="PLDs" large>
        {auth.favours?.pld.map((pld, index) => {
          return (
            <SideNavLink key={index} onClick={() => {
              onClickSideNavExpand();
              navigate(`/organization/${pld.org}/pld/${pld._id}`)
            }}>{pld.title}</SideNavLink>
          )
        })}
      </SideNavMenu>
    )
  }

  const showFavoursOrg = (auth: UserContextProps, onClickSideNavExpand: () => void) => {
    if (auth.favours?.org === undefined || auth.favours.org.length <= 0)
      return;
    return (
      <SideNavMenu defaultExpanded title="Organisations" large>
        {auth.favours?.org.map((org, index) => {
          return (
            <SideNavMenuItem key={index} onClick={() => {
              onClickSideNavExpand();
              navigate(`/organization/${org._id}`);
            }}>
              {org.name}
            </SideNavMenuItem>
          )
        })}
      </SideNavMenu>);
  }

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
            <Layer onClick={() => navigate('/')}>
              <HeaderName prefix="PLD">
                [Maker]
              </HeaderName>
            </Layer>
            <HeaderGlobalBar>
              <UserMenu/>
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
                  onClick={() => {
                    onClickSideNavExpand();
                    navigate("/");
                  }}
                  renderIcon={Dashboard}>
                  {translate('menu.sidebar.dashboard')}
                </SideNavLink>
                <SideNavLink
                  large
                  onClick={() => {
                    onClickSideNavExpand();
                    navigate(`/faq`);
                  }}
                  renderIcon={Legend}>
                  {translate('menu.sidebar.faq')}
                </SideNavLink>
                <SideNavLink
                  large
                  onClick={() => {
                    onClickSideNavExpand();
                    navigate(`/changelog`);
                  }}
                  renderIcon={MessageQueue}>
                  {translate('menu.sidebar.changelog')}
                </SideNavLink>
                <SideNavDivider/>
                <UserContext.Consumer>
                  {(auth) => showFavoursOrg(auth, onClickSideNavExpand)}
                </UserContext.Consumer>
                <UserContext.Consumer>
                  {(auth) => showFavoursPld(auth, onClickSideNavExpand)}
                </UserContext.Consumer>
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
  )
};
