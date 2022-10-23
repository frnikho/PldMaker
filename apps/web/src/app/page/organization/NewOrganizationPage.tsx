import {NewOrgComponent} from "../../component/org/NewOrgComponent";
import React from "react";
import {Loading} from "carbon-components-react";
import {LoginState, UserContext, UserContextProps} from "../../context/UserContext";
import {NavigationState, redirectNavigation} from "../../util/Navigation";
import {Organization} from "@pld/shared";

export type NewOrganizationPageProps = unknown;
export type NewOrganizationPageState = NavigationState;

export class NewOrganizationPage extends React.Component<NewOrganizationPageProps, NewOrganizationPageState> {

  constructor(props: NewOrganizationPageProps) {
    super(props);
    this.onOrgCreate = this.onOrgCreate.bind(this);
    this.state = {
      navigateUrl: undefined,
    }
  }

  public onOrgCreate(org: Organization) {
    this.setState({
      navigateUrl: `/organization/${org._id}`
    })
  }

  private showState(authContext: UserContextProps) {
    if (authContext.isLogged === LoginState.not_logged) {
      return (<h1>Not logged</h1>)
    } else if (authContext.isLogged === LoginState.logged) {
      return (<NewOrgComponent onOrgCreated={this.onOrgCreate}/>)
    }
    return (<Loading style={{margin: 'auto'}} withOverlay={false}/>)
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => this.showState(auth)}
        </UserContext.Consumer></>
    );
  }
}
