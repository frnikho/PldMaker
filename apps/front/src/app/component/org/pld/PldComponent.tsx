import React from "react";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {OrganizationApiController} from "../../../controller/OrganizationApiController";
import {PldApiController} from "../../../controller/PldApiController";
import {Organization} from "../../../../../../../libs/data-access/organization/Organization";
import {Pld} from "../../../../../../../libs/data-access/pld/Pld";
import {
  Column, DataTable,
  ExpandableTile, Grid, SkeletonPlaceholder,
  SkeletonText,
  TextInput,
  Tile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent
} from "carbon-components-react";

import {Stack} from '@carbon/react';
import {User} from "../../../../../../../libs/data-access/user/User";
import {DodTableComponent} from "./DodTableComponent";
import {GenerateComponent} from "./GenerateComponent";

export type PldComponentProps = {
  pldId: string;
  orgId: string;
} & RequiredUserContextProps;

export type PldComponentState = {
  org?: Organization;
  pld?: Pld;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr") + " à " + date.toLocaleTimeString("fr");
}


export class PldComponent extends React.Component<PldComponentProps, PldComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      org: undefined,
      pld: undefined
    }
  }

  override componentDidMount() {
    this.loadOrg();
    this.loadPld();
  }

  private loadOrg() {
    OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        console.log(error);
      }
      if (org !== null) {
        this.setState({
          org: org,
        })
      }
    });
  }

  private loadPld() {
    PldApiController.findPld(this.props.userContext.accessToken, this.props.pldId, (pld, error) => {
      if (error) {
        console.log(error);
      }
      if (pld !== null) {
       setTimeout(() => {
         this.setState({
           pld: pld,
         })
       }, 1000);
      }
    });
  }

  private showLastAuthorPld() {
    if (this.state.pld === undefined)
      return;
    if (this.state.pld?.revisionsUpdated.length > 0) {
      console.log(this.state.pld?.revisionsUpdated[this.state.pld?.revisionsUpdated.length]);//TODO check revision update author
      return;
    } else {
      return ((this.state.org?.owner as User).email);
    }
  }

  private showQuickInformationPanel() {
    return (
      <Tile>
        <Stack gap={6}>
          <div>
            <h4>Date de création</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatDate(new Date(this.state.pld?.created_date ?? ""))}</p>}
          </div>
          <div>
            <h4 style={{}}>Dernière mise a jour: </h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatDate(new Date(this.state.pld?.updated_date ?? ""))}</p>}
            {this.state.pld === undefined ? <SkeletonText/> : <p>par <b>{this.showLastAuthorPld()}</b></p>}

          </div>
          <div>
            <Stack orientation={"horizontal"}>
              <Column lg={3}>
                <h4 style={{}}>Version actuelle </h4>
                {this.state.pld === undefined ? <SkeletonPlaceholder/> : <h1>{this.state.pld?.version}</h1>}
              </Column>
              <Column lg={3}>
                <h4 style={{}}>Nombre de révisions </h4>
                {this.state.pld === undefined ? <SkeletonPlaceholder/> : <h1>{this.state.pld?.revisionsUpdated.length}</h1>}
              </Column>
            </Stack>
          </div>
        </Stack>
      </Tile>
    )
  }

  private showInfoPanel() {
    return (
      <TextInput id={"pld-description"} value={"abc"} labelText={""}/>
    )
  }

  private showGeneratePanel() {
    if (this.state.org === undefined || this.state.pld === undefined) {
      return (<SkeletonPlaceholder style={{width: '100%'}}/>)
    } else {
      return (<GenerateComponent org={this.state.org} pld={this.state.pld}/>)

    }
  }

  private onDodCreated() {

  }

  private onDodUpdated() {

  }
  private onDodDeleted() {

  }

  private showDatabasePanel() {
    return <DodTableComponent userContext={this.props.userContext} onCreatedDod={this.onDodCreated} onDeleteDod={this.onDodDeleted} onUpdateDod={this.onDodUpdated}/>
  }

  override render() {
    return (
      <>
        <Grid>
          <Column lg={11}>
            <ExpandableTile expanded={true}>
              <TileAboveTheFoldContent>
                <h1>Informations du pld</h1>
              </TileAboveTheFoldContent>
              <TileBelowTheFoldContent>
                {this.showInfoPanel()}
              </TileBelowTheFoldContent>
            </ExpandableTile>
            <ExpandableTile expanded={true}>
              <TileAboveTheFoldContent>
                <h1>Dod</h1>
              </TileAboveTheFoldContent>
              <TileBelowTheFoldContent>
                {this.showDatabasePanel()}
              </TileBelowTheFoldContent>
            </ExpandableTile>
            <ExpandableTile expanded={true}>
              <h1>Documents du pld</h1>
            </ExpandableTile>
            <ExpandableTile expanded={true}>
              <h1>Génération du DOCX/PDF</h1>
              {this.showGeneratePanel()}
            </ExpandableTile>
          </Column>
          <Column lg={5}>
            {this.showQuickInformationPanel()}
          </Column>
        </Grid>
      </>
    );
  }
}
