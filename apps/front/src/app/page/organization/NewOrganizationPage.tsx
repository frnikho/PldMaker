import {NewOrgComponent} from "../../component/org/NewOrgComponent";
import React from "react";
import {Loading} from "carbon-components-react";
import {UserContext} from "../../context/UserContext";
import {NavigationState, redirectNavigation} from "../../util/Navigation";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";

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

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <UserContext.Consumer>
          {(auth) => {
            if (!auth.isLogged) {
              return <Loading style={{margin: 'auto'}} withOverlay={false}/>
            } else {
              return (<NewOrgComponent userContext={auth} onOrgCreated={this.onOrgCreate}/>);
            }
          }}
        </UserContext.Consumer></>
    );
  }
}
