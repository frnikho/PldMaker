import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Button, ButtonSet, ClickableTile, Column, DataTableSkeleton, Grid,
  SkeletonPlaceholder,
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow, Tile
} from "carbon-components-react";
import Lottie from "lottie-react";
import {Stack} from '@carbon/react'
import {NavigationState, redirectNavigation} from "../../util/Navigation";
import {Organization, Pld, Dod} from "@pld/shared";

import {View, Add} from '@carbon/icons-react'
import { formatShortDate } from "@pld/utils";

type OrganizationHomeDashboardProps = unknown & RequiredUserContextProps

type OrganizationHomeDashboardState = {
  loading: boolean;
  organization: Organization[];
  pld: Pld[];
  dods: Dod[];
} & NavigationState

const orgIllustrations = [
  require('../../../assets/illustrations/undraw_miro_qvwm.png'),
  require('../../../assets/illustrations/undraw_creative_team_re_85gn.png'),
  require('../../../assets/illustrations/undraw_shared_goals_re_jvqd.png'),
  require('../../../assets/illustrations/undraw_work_together_re_5yhn.png'),
  require('../../../assets/illustrations/undraw_team_collaboration_re_ow29.png'),
  require('../../../assets/illustrations/undraw_team_up_re_84ok.png'),
  require('../../../assets/illustrations/undraw_teamwork_hpdk.png'),
]

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

  private showOrgCards() {
    return (
      <Grid>
        {this.state.organization.map((org, index) => {
          return <Column xlg={4} lg={6} md={4} sm={4} key={index}>
            <ClickableTile style={style.card} onClick={() => {this.setState({
                navigateUrl: `/organization/${org._id}`
              })}}>
              <p style={style.cardTitle}>{org.name}</p>
              <p style={style.cardDescription}>{org.description.substring(0, 120)} {org.description.length > 120 ? '...' : ''}</p>
              <div style={style.cardImageContainer as any}>
                <img style={style.cardImage} src={orgIllustrations[Math.floor(Math.random() * orgIllustrations.length)]}/>
              </div>
              <p>Dernière mise a jour: <br/><span style={{fontWeight: 600}}>{formatShortDate(new Date(org.updated_date))}</span></p>
            </ClickableTile>
          </Column>
        })}
      </Grid>
    )
  }

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
        <h1 style={style.orgTitle}>Mes organizations <Button kind={"ghost"} onClick={this.onClickCreateOrganization} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h1>
        {this.showLoading()}
        {this.showNoOrganizations()}
        {this.showOrgCards()}
      </>
    );
  }
}

const style = {
  orgTitle: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 600,
  },
  cardDescription: {
    minHeight: 80,
  },
  cardImageContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  cardImage: {
    maxWidth: '100%',
    height: 150
  },
}
