import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Button, ButtonSet, ContentSwitcher, DataTableSkeleton,
  Row,
  SkeletonPlaceholder, Switch,
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";
import Lottie from "lottie-react";
import {FlexGrid} from '@carbon/react'
import {NavigationState, redirectNavigation} from "../../util/Navigation";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";

import {View, Add, QHintonPlot} from '@carbon/icons-react'

type OrganizationHomeDashboardProps = {

} & RequiredUserContextProps

type OrganizationHomeDashboardState = {
  loading: boolean;
  organization: Organization[];
} & NavigationState

export class OrganizationHomeDashboard extends React.Component<OrganizationHomeDashboardProps, OrganizationHomeDashboardState> {

  constructor(props: OrganizationHomeDashboardProps) {
    super(props);
    this.state = {
      loading: true,
      organization: [],
    }
    this.onClickCreateOrganization = this.onClickCreateOrganization.bind(this);
  }

  override componentDidMount() {
    if (this.props.userContext.accessToken === undefined)
      return;
    OrganizationApiController.getMeOrganizations(this.props.userContext.accessToken, (orgs, error) => {
      if (!error) {
        this.setState({
          organization: orgs,
          loading: false,
        });
      } else {
        //TODO check error
      }
    });
    console.log(this.props.userContext?.user);
  }

  private onClickCreateOrganization() {
    this.setState({
      navigateUrl: 'organization/new'
    })
  }

  private showLoading() {
    if (!this.state.loading) {
      return;
    }
    return (
      <>
        <SkeletonPlaceholder style={{margin: '10px', height: '60px', width: '100%'}}/>
        <DataTableSkeleton/>
      </>
    )
  }

  private showOrganizations() {
    if (this.state.organization.length <= 0) {
      return;
    }

    return (
      <Table style={{marginTop: '20px'}}>
        <TableHead>
          <TableRow>
            <TableHeader id={"name"} key={"name"}>Nom de l'organisation</TableHeader>
            <TableHeader id={"name"} key={"description"}>Description</TableHeader>
            <TableHeader id={"name"} key={"created_date"}>Date de création</TableHeader>
            <TableHeader id={"name"} key={"action"}>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.organization.map((org, index) => (
            <TableRow key={index}>
              <TableCell key={index}>abc {org.name}</TableCell>
              <TableCell>{org.description}</TableCell>
              <TableCell>TODO</TableCell>
              <TableCell>
                <ButtonSet>
                  <Button
                    onClick={() => {this.setState({
                      navigateUrl: `/organization/${org._id}`
                    })}}
                    kind="ghost" renderIcon={View} iconDescription={"Gérer"} hasIconOnly/>
                </ButtonSet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  private showNoOrganizations() {
    if (this.state.organization.length !== 0 || this.state.loading) {
      return;
    }
    return (<>
      <FlexGrid>
        <Row>
          <h4>Vous n'avez pas rejoin ou créer d'organisation</h4>
          <Lottie animationData={require('../../../assets/animations/organization.json')} loop={true} style={{width: '300px'}}/>
          <h4><Button onClick={this.onClickCreateOrganization}>Cliquez ici pour en créer une !</Button></h4>
        </Row>
      </FlexGrid>
    </>)
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        <h1>Mes organizations <Button kind={"ghost"} onClick={this.onClickCreateOrganization} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h1>
        {this.showLoading()}
        {this.showNoOrganizations()}
        {this.showOrganizations()}
      </>
    );
  }


}
