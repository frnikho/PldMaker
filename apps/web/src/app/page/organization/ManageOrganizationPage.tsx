import React from "react";
import {AuthPage} from "../../util/Page";
import {UserContextProps} from "../../context/UserContext";
import {withParams} from "../../util/Navigation";
import {CircularProgress} from "../../component/utils/CircularProgress";
import { ManageOrganizationComponent } from "../../component/org/ManageOrganizationComponent";
import { RouteMatch } from "react-router-dom";

class ManageOrganizationPage extends AuthPage<RouteMatch, unknown> {

  override showLoading(auth: UserContextProps): JSX.Element {
    return (<CircularProgress/>);
  }

  override showLogged(auth: UserContextProps): JSX.Element {
    return (<ManageOrganizationComponent orgId={this.props.params['id'] ?? ''}/>);

  }

  override showNotLogged(auth: UserContextProps): JSX.Element {
    return (<>
      Not logged
    </>);
  }

}

export default withParams(ManageOrganizationPage);
