import React from "react";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {RequiredUserContextProps} from "../../context/UserContext";
import {ApiError} from "../../util/Api";
import {
  Breadcrumb, BreadcrumbItem,
  Button, ButtonSet,
  ClickableTile,
  Column,
  Grid,
  SkeletonPlaceholder,
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add, Settings} from '@carbon/icons-react'
import {NavProps, redirectNavigation, withNav} from "../../util/Navigation";
import {PageState} from "../../util/Page";
import {PldApiController} from "../../controller/PldApiController";
import {Pld} from "../../../../../../libs/data-access/pld/Pld";
import {FieldData} from "../../util/FieldData";
import {SocketContext} from "../../context/SocketContext";

export type OrganizationComponentProps = {
  orgId?: string;
  onError: (error: ApiError) => void;
} & RequiredUserContextProps & NavProps;

export type OrganizationComponentState = {
  org?: Organization;
  pld: FieldData<Pld[]>;
} & PageState;

class OrganizationComponent extends React.Component<OrganizationComponentProps, OrganizationComponentState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props: OrganizationComponentProps) {
    super(props);
    this.state = {
      org: undefined,
      loading: false,
      navigateUrl: undefined,
      pld: {
        value: [],
        loading: true,
      },
    }
    this.onClickCreateDocument = this.onClickCreateDocument.bind(this);
    this.onClickCreatePld = this.onClickCreatePld.bind(this);
    this.onClickCreateTemplate = this.onClickCreateTemplate.bind(this);
  }

  override componentDidMount() {
    this.loadOrg();
  }

  private loadOrg() {
    if (this.props.orgId === undefined)
      return;
    OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        return this.props.onError(error);
      }
      if (org !== null) {
        this.setState({
          org: org
        });
        this.loadPld(org._id);
      }
    });
  }

  private loadPld(orgId: string) {
    PldApiController.findOrgPld(this.props.userContext.accessToken, orgId, (pld, error) => {
      if (!error) {
        this.setState({
          pld: {
            loading: false,
            value: pld
          }
        })
      }
    });
  }

  private onClickCreatePld() {
    this.setState({
      navigateUrl: 'pld/new'
    })
  }

  private onClickCreateDocument() {
    return undefined;
  }

  private onClickCreateTemplate() {
    return undefined;
  }

  private showPld() {
    if (this.state.pld.loading) {
      return (
        <SkeletonPlaceholder/>
      )
    }
    return (
      <Grid>
        {this.state.pld.value.map((pld, index) => {
          return (
            <Column key={index} sm={4} md={8} lg={4}>
              <ClickableTile onClick={() => {this.setState({navigateUrl: `pld/${pld._id}`})}}>
                {pld.title}
              </ClickableTile>
            </Column>
          )
        })}
      </Grid>
    )
  }

  override render() {
    return (
      <>
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.props.navigate(`/`)}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{this.state.org?.name ?? "Organisation"}</BreadcrumbItem>
        </Breadcrumb>
        <Stack gap={3}>
          {redirectNavigation(this.state.navigateUrl)}
          <h2>Pld <Button kind={"ghost"} onClick={this.onClickCreatePld} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
          {this.showPld()}
          <h2>Templates <Button kind={"ghost"} onClick={this.onClickCreateTemplate} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
          <h2>Documents <Button kind={"ghost"} onClick={this.onClickCreateDocument} hasIconOnly renderIcon={Add} iconDescription={"Créer/Ajouter un document"}/></h2>
          <ButtonSet style={{marginBottom: '20px'}}>
            <Button onClick={() => this.props.navigate('manage')}><Settings size={24}/> Gérer</Button>
          </ButtonSet>
        </Stack>
      </>
    );
  }
}

export default withNav(OrganizationComponent);
