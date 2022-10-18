import { useContext } from "react";
import { LanguageContext, LanguageContextState } from "../context/LanguageContext";
import { AvailableLanguages, AvailableLangue, language, LanguageType } from "../language";

export type NestedLanguageKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & keyof AvailableLanguages]: ObjectType[Key] extends AvailableLanguages
    ? `${Key}` | `${Key}.${NestedLanguageKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (keyof AvailableLanguages)];

export function useLanguage() {

  const languageCtx = useContext<LanguageContextState>(LanguageContext);

  const translate = (key: NestedLanguageKeyOf<LanguageType>, lang = languageCtx.language): string => {
    const text = key.split('.').reduce((a, b) => {
      return a[b];
    }, language);
    return (text[lang] ?? text['en']) as string;
  }

  return {
    translate,
    getCurrentLanguage: () => languageCtx.language,
    changeCurrentLanguage: (language: keyof AvailableLangue) => languageCtx.changeLange(language),
  }
}
