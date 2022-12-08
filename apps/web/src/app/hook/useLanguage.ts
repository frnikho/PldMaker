import { useCallback, useContext } from "react";
import { LanguageContext, LanguageContextState } from "../context/LanguageContext";
import { AvailableLanguages, AvailableLangue, language, LanguageType } from "../language";
import { getPlaceholder } from "../util/Placeholders";

export type NestedLanguageKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & keyof AvailableLanguages]: ObjectType[Key] extends AvailableLanguages
    ? `${Key}` | `${Key}.${NestedLanguageKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (keyof AvailableLanguages)];

export function useLanguage() {

  const languageCtx = useContext<LanguageContextState>(LanguageContext);

  const translate = useCallback((key: NestedLanguageKeyOf<LanguageType>, lang = languageCtx.language): string => {
      const text = key.split('.').reduce((a, b) => {
        return a[b];
      }, language);
      return getPlaceholder((text[lang] ?? text['en']) as string, {html: true});
    }, [languageCtx.language]);

  return {
    translate,
    getCurrentLanguage: () => languageCtx.language,
    changeCurrentLanguage: (language: keyof AvailableLangue) => languageCtx.changeLange(language),
  }
}
