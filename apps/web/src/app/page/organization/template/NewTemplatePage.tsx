import React from "react";
import { UserContextProps } from "../../../context/UserContext";
import { NavigationState, withParams } from "../../../util/Navigation";
import { Page } from "../../../util/Page";
import { CreateTemplateComponent } from "../../../component/template/CreateTemplateComponent";
import { RouteMatch } from "react-router-dom";

type TemplateUrlParams = {
  id: string;
  templateId?: string;
}

export type NewTemplateProps = {

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
    return <CreateTemplateComponent orgId={this.props.params['id'] ?? ''}/>
  }

}

export default withParams(NewTemplatePage);
