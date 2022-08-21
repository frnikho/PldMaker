import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Button, ButtonSet, DataTableSkeleton,
  SkeletonPlaceholder,
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";
import Lottie from "lottie-react";
import {Stack} from '@carbon/react'
import {NavigationState, redirectNavigation} from "../../util/Navigation";
import {Organization, Pld, Dod} from "@pld/shared";

import {View, Add} from '@carbon/icons-react'
import {formatShortDate} from "@pld/utils";
import {ChartsDashboard} from "./ChartsDashboard";
import {PldApiController} from "../../controller/PldApiController";
import {DodApiController} from "../../controller/DodApiController";

type OrganizationHomeDashboardProps = unknown & RequiredUserContextProps

type OrganizationHomeDashboardState = {
  loading: boolean;
  organization: Organization[];
  pld: Pld[];
  dods: Dod[];
} & NavigationState

export class OrganizationHomeDashboard extends React.Component<OrganizationHomeDashboardProps, OrganizationHomeDashboardState> {

  constructor(props: OrganizationHomeDashboardProps) {
    super(props);
    this.state = {
      loading: true,
      organization: [],
      dods: [],
      pld: [],
    }
    this.onClickCreateOrganization = this.onClickCreateOrganization.bind(this);
  }

  private loadAllPld() {
    PldApiController.getAllOrgPld(this.props.userContext.accessToken, this.state.organization.map((org) => org._id), (pld, error) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({
          pld,
        });
        this.loadAllDod();
      }
    });
  }

  private loadAllDod() {
    DodApiController.findDods(this.props.userContext.accessToken, this.state.pld.map((pld) => pld._id), (dods, error) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({
          dods,
        })
      }
    });
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
        this.loadAllPld();
      } else {
        //TODO check error
      }
    });
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
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader id={"name"} key={"name"}>Nom de l'organisation</TableHeader>
            <TableHeader id={"description"} key={"description"}>Description</TableHeader>
            <TableHeader id={"created_date"} key={"created_date"}>Date de création</TableHeader>
            <TableHeader id={"author"} key={"author"}>Manager</TableHeader>
            <TableHeader id={"action"} key={"action"}>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.organization.map((org, index) => (
            <TableRow key={index}>
              <TableCell>{org.name}</TableCell>
              <TableCell>{org.description}</TableCell>
              <TableCell>{formatShortDate(new Date(org.created_date ?? new Date()))}</TableCell>
              <TableCell>{org.owner.email}</TableCell>
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

/*  private showCharts() {
    if (this.state.organization.length === 0 || this.state.pld.length === 0)
      return;
    return (
      <ChartsDashboard org={this.state.organization} dod={this.state.dods} pld={this.state.pld} userContext={this.props.userContext}/>
    )
  }*/

  private showNoOrganizations() {
    if (this.state.organization.length !== 0 || this.state.loading)
      return;
    return (
      <Stack>
        <Lottie animationData={require('../../../assets/animations/organization.json')} loop={true} style={{width: '300px'}}/>
        <h4>Vous n'avez pas rejoin ou créer d'organisation</h4>
        <h4><Button kind={"ghost"} onClick={this.onClickCreateOrganization}>Cliquez ici pour en créer une !</Button></h4>
      </Stack>)
  }

  override render() {
    return (
      <>
        {redirectNavigation(this.state.navigateUrl)}
        {/*<h1>Status</h1>
        {this.showCharts()}*/}
        <h1>Mes organizations <Button kind={"ghost"} onClick={this.onClickCreateOrganization} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h1>
        {this.showLoading()}
        {this.showNoOrganizations()}
        {this.showOrganizations()}
      </>
    );
  }
}
