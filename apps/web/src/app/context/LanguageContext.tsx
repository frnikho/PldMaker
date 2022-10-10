import React from "react";
import { ReactCookieProps, withCookies } from "react-cookie";
import { AvailableLangue, getTranslation } from "../language";

export const LANGUAGE_COOKIE_NS = 'language';
export const DEFAULT_LANGUAGE: keyof AvailableLangue = 'fr';
export type LanguageContextProps = React.PropsWithChildren<ReactCookieProps>;
export type LanguageContextState = {
  language: keyof AvailableLangue;
  changeLange: (language: keyof Required<AvailableLangue>) => void;
  translate: (languageConfig: any) => string;
}

export const LanguageContext = React.createContext<LanguageContextState>({
  language: DEFAULT_LANGUAGE,
  changeLange: () => null,
  translate: (languageConfig: any) => getTranslation(languageConfig, DEFAULT_LANGUAGE)
});


export class LanguageContextProvider extends React.Component<LanguageContextProps, LanguageContextState> {

  constructor(props: LanguageContextProps) {
    super(props);
    this.state = {
      language: DEFAULT_LANGUAGE,
      changeLange: this.changeLanguage.bind(this),
      translate: this.getTranslation.bind(this),
    }
  }

  override componentDidMount() {
    const language = this.props.cookies?.get('language');
    if (language === undefined) {
      this.props.cookies?.set(LANGUAGE_COOKIE_NS, DEFAULT_LANGUAGE, {path: '/'});
    } else {
      this.setState({language})
    }
  }

  public changeLanguage(language: keyof Required<AvailableLangue>) {
    this.props.cookies?.set(LANGUAGE_COOKIE_NS, language, {path: '/'});
    this.setState({
      language: language
    });
  }

  public getTranslation(languageConfig: any): string {
    return languageConfig[this.state.language];
  }

  override render() {
    return (
      <LanguageContext.Provider value={{...this.state}}>
        {this.props['children']}
      </LanguageContext.Provider>
    );
  }
}

export type LanguageProps = {
  language: LanguageContextState;
}

export const withLanguage = (Component) => {
  return props =>
    (<LanguageContext.Consumer>
      {value => <Component {...props} language={value}/>}
    </LanguageContext.Consumer>);
}

export default withCookies(LanguageContextProvider);
