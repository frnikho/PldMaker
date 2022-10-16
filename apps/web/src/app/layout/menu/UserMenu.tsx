import * as React from "react";
import { useLanguage } from "../../hook/useLanguage";
import { useAuth } from "../../hook/useAuth";
import { LoginState } from "../../context/UserContext";
import { HeaderGlobalAction, OverflowMenu, OverflowMenuItem, SkeletonIcon } from "carbon-components-react";
import { LanguageMenu } from "./LanguageMenu";

import {Login, Bee, UserAvatar} from '@carbon/icons-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthModalComponent } from "../../component/AuthModalComponent";
import { toast } from "react-toastify";

type Modals = {
  openLogin: boolean;
  openRegister: boolean;
}

export const UserMenu = () => {

  const {user, isLogged, logout} = useAuth();
  const {translate} = useLanguage();
  const navigate = useNavigate();
  const [modals, setModals] = useState<Modals>({openLogin: false, openRegister: false});

  const updateModals = (key: keyof Modals, value: boolean) => {
    setModals({
      ...modals,
      [key]: value,
    })
  }

  const onUserRegistered = () => {
    updateModals('openRegister', false);
    toast('Inscription réalisé avec succès', {type: 'success'});
  }

  const onUserLogged = () => {
    updateModals('openLogin', false);
    toast('Connexion réalisé avec succès', {type: 'success'});
  }

  const switchModal = () => {
    if (modals.openLogin) {
      setModals({
        openLogin: false,
        openRegister: true
      })
    } else {
      setModals({
        openLogin: true,
        openRegister: false
      })
    }
  }

  const showAuthModal = () => <AuthModalComponent onRedirect={(path) => navigate(path)} onDismiss={() => setModals({openLogin: false, openRegister: false})} openLoginModal={modals.openLogin} openRegisterModal={modals.openRegister} switchModal={switchModal} onUserRegistered={onUserRegistered} onUserLogged={onUserLogged}/>

  if (isLogged === LoginState.logged) {
    return (
      <>
        {showAuthModal()}
        <LanguageMenu/>
        <OverflowMenu ariaLabel="overflow-menu" style={{marginTop: 'auto', marginBottom: 'auto'}} menuOffset={{left: -60}} renderIcon={UserAvatar}>
          <OverflowMenuItem itemText={user?.firstname + ' ' + user?.lastname} requireTitle disabled/>
          <OverflowMenuItem itemText={translate('menu.user.profile')} onClick={() => {
            navigate('/profile');
          }} />
          <OverflowMenuItem itemText={translate('menu.user.devices')} onClick={() => {
            navigate('/devices');
          }}/>
          <OverflowMenuItem hasDivider itemText={translate('menu.user.logout')} onClick={() => {
            logout();
            navigate('/');
          }} />
        </OverflowMenu>
      </>
    )
  } else if (isLogged === LoginState.not_logged) {
    return (
      <>
        {showAuthModal()}
        <LanguageMenu/>
        <HeaderGlobalAction
          onClick={() => updateModals('openLogin', true)}
          aria-label={translate('menu.user.login')}>
          <Login/>
        </HeaderGlobalAction>
        <HeaderGlobalAction
          onClick={() => updateModals('openRegister', true)}
          aria-label={translate('menu.user.register')}>
          <Bee/>
        </HeaderGlobalAction>
      </>
    );
  } else {
    return (<SkeletonIcon/>)
  }
};
