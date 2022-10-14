import React from "react";
import { UserContextProps } from "../../../context/UserContext";
import { NavigationState, withParams } from "../../../util/Navigation";
import { Page } from "../../../util/Page";
import { RouteMatch } from "react-router-dom";
import { EditTemplateComponent } from "../../../component/template/EditTemplateComponent";

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
    return <EditTemplateComponent orgId={this.props.params['id'] ?? ''} templateId={this.props.params['templateId'] ?? ''}/>
  }

}

export default withParams(NewTemplatePage);
