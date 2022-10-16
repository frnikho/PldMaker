import * as React from "react";
import { AvailableLangue } from "../../language";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { useLanguage } from "../../hook/useLanguage";

import {Flag} from '@carbon/icons-react';

export const LanguageMenu = () => {

  const {getCurrentLanguage, changeCurrentLanguage} = useLanguage();

  const languages: (keyof AvailableLangue)[] = ['fr', 'en'];
  return (
    <OverflowMenu ariaLabel="overflow-menu" style={{marginTop: 'auto', marginBottom: 'auto'}} menuOffset={{left: -60}} renderIcon={Flag}>
      {languages.map((lang, index) => <OverflowMenuItem key={index} itemText={getCurrentLanguage() === lang ? `> ${lang.toUpperCase()}` : `${lang.toUpperCase()}`} requireTitle onClick={() => changeCurrentLanguage(lang)}/>)}
    </OverflowMenu>
  )
};
