import React from "react";
import {LoginState, UserContext, UserContextProps} from "../../../context/UserContext";
import {SkeletonPlaceholder} from "carbon-components-react";
import {NewTemplateComponent, ViewMode} from "../../../component/template/NewTemplateComponent";
import {NavigationState, redirectNavigation, withParams} from "../../../util/Navigation";
import {RouteMatch} from "react-router/lib/router";

type TemplateUrlParams = {
  id: string;
  templateId?: string;
}

export type NewTemplateProps = {
  mode: ViewMode;
} & RouteMatch;

export type NewTemplateState = unknown & NavigationState;

class NewTemplatePage extends React.Component<NewTemplateProps, NewTemplateState> {

  constructor(props) {
    super(props);
    this.state = {
      navigateUrl: undefined,
    }
  }

  private showState(auth: UserContextProps) {
    const params = this.props.params as TemplateUrlParams;
    if (auth.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (auth.isLogged === LoginState.logged) {
      return <NewTemplateComponent userContext={auth} mode={ViewMode.New} orgId={params.id} templateId={params.templateId}/>
    }
    return (<SkeletonPlaceholder/>)
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => this.showState(auth)}
        </UserContext.Consumer>
      </>
    );
  }
}

export default withParams(NewTemplatePage);
