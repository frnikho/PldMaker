import React from "react";
import { UserContextProps } from "../../../context/UserContext";
import NewTemplateComponent, { ViewMode } from "../../../component/template/NewTemplateComponent";
import { NavigationState, withParams } from "../../../util/Navigation";
import { RouteMatch } from "react-router/lib/router";
import { Page } from "../../../util/Page";

type TemplateUrlParams = {
  id: string;
  templateId?: string;
}

export type NewTemplateProps = {
  mode: ViewMode;
} & RouteMatch;

export type NewTemplateState = unknown & NavigationState;

class NewTemplatePage extends Page<NewTemplateProps, NewTemplateState> {

  constructor(props) {
    super(props);
    this.state = {
      navigateUrl: undefined,
    }
  }

  renderPage(context: UserContextProps): React.ReactNode {
    console.log(this.props.navigate);
    return <NewTemplateComponent orgId={this.props.params['id'] ?? ''} navigate={this.props.navigate} mode={ViewMode.New} userContext={context}/>
  }

}

export default withParams(NewTemplatePage);
