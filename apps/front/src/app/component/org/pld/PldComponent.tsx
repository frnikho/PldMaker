import React from "react";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {OrganizationApiController} from "../../../controller/OrganizationApiController";
import {PldApiController} from "../../../controller/PldApiController";
import {Organization} from "../../../../../../../libs/data-access/organization/Organization";
import {Pld} from "../../../../../../../libs/data-access/pld/Pld";
import {
  Accordion, AccordionItem,
  Button,
  Column, Grid, NumberInput, Select, SelectItem, SkeletonPlaceholder,
  SkeletonText, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextArea,
  TextInput,
  Tile,
} from "carbon-components-react";

import {Stack} from '@carbon/react';
import {User} from "../../../../../../../libs/data-access/user/User";
import {DodTableComponent} from "./DodTableComponent";
import {GenerateComponent} from "./GenerateComponent";
import {DodApiController} from "../../../controller/DodApiController";
import {Dod} from "../../../../../../../libs/data-access/pld/dod/Dod";
import {SignPldModal} from "../../../modal/pld/SignPldModal";
import {AddRevisionPldModal} from "../../../modal/pld/AddRevisionPldModal";
import {toast} from "react-toastify";

export type PldComponentProps = {
  pldId: string;
  orgId: string;
} & RequiredUserContextProps;

export type PldComponentState = {
  org?: Organization;
  pld?: Pld;
  dod: Dod[];
  openSignModal: boolean;
  openAddRevisionModal: boolean;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr") + " à " + date.toLocaleTimeString("fr");
}


export class PldComponent extends React.Component<PldComponentProps, PldComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      dod: [],
      org: undefined,
      pld: undefined,
      openAddRevisionModal: false,
      openSignModal: false,
    }
    this.onClickUpdatePld = this.onClickUpdatePld.bind(this);
    this.onDodUpdated = this.onDodUpdated.bind(this);
    this.onDodDeleted = this.onDodDeleted.bind(this);
    this.onDodCreated = this.onDodCreated.bind(this);
  }

  override componentDidMount() {
    this.loadOrg();
    this.loadPld();
    this.loadDod();
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
        toast(error.error, {type: 'error'});
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

  private loadDod() {
    DodApiController.findDodWithPld(this.props.userContext.accessToken, this.props.pldId, (dod, error) => {
      if (error) {
        toast(error.error, {type: 'error'})
      } else {
        this.setState({
          dod: dod,
        });
      }
    });
  }

  private onClickUpdatePld() {
    PldApiController.updatePld(this.props.userContext.accessToken, {
      title: this.state.pld?.title,
      pldId: this.props.pldId,
      promotion: this.state.pld?.promotion,
      manager: this.state.pld?.manager._id,
      description: this.state.pld?.description,
    }, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
        toast('Pld mit a jour 👍 !', {type: 'success'});
        this.loadPld();
      }
    });
  }

  private showLastAuthorPld() {
    if (this.state.pld === undefined)
      return;
    if (this.state.pld?.revisions.length > 0) {
      console.log(this.state.pld.revisions[this.state.pld.revisions.length-1]);
      return this.state.pld.revisions[this.state.pld.revisions.length-1].owner;
    } else {
      return ((this.state.org?.owner as User).email);
    }
  }

  private showPldState() {
    return (
      <Tile style={{marginTop: '20px'}}>
        <Stack gap={6}>
          <div>
            <h4>Status du PLD:</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <h4>{this.state.pld?.status.toUpperCase() ?? ""}</h4>}
          </div>
        </Stack>
      </Tile>
    )
  }

  private showQuickInformationPanel() {
    return (
      <Tile>
        <Stack gap={6}>
          <div>
            <h4>Date de création:</h4>
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
                {this.state.pld === undefined ? <SkeletonPlaceholder/> : <h1>{this.state.pld?.revisions.length}</h1>}
              </Column>
            </Stack>
          </div>
        </Stack>
      </Tile>
    )
  }

  private showInfoPanel() {
    if (this.state.pld === undefined || this.state.org === undefined)
      return;
    return (
      <>
        <Stack gap={6}>
          <TextInput id={"pld-title"} value={this.state.pld.title} labelText={"Titre du pld"} onChange={(e) => {
            if (this.state.pld !== undefined) {
              this.setState({
                pld: {
                  ...this.state.pld,
                  title: e.currentTarget.value,
                }
              })
            }
          }}/>
          <TextArea rows={4} id={"pld-description"} labelText={"Description"} value={this.state.pld.description} onChange={(e) => {
            if (this.state.pld !== undefined) {
              this.setState({
                pld: {
                  ...this.state.pld,
                  description: e.currentTarget.value,
                }
              })
            }
          }}/>

          <NumberInput id={"promotion"} iconDescription={""} label={"Promotion"} value={this.state.pld.promotion} onChange={(e) => {
            if (this.state.pld !== undefined) {
              this.setState({
                pld: {
                  ...this.state.pld,
                  promotion: parseFloat(e.imaginaryTarget.value),
                }
              })
            }
          }}/>

          <Select
            id="new-pld-manager"
            onChange={(e) => {
              if (this.state.pld === undefined || this.state.org === undefined)
                return;
              const selectedManager = ([...this.state.org.members, this.state.org.owner]).find((member) => member._id === e.currentTarget.value);
              if (selectedManager === undefined)
                return;
              this.setState({
                pld: {
                  ...this.state.pld,
                  manager: selectedManager,
                }
              })
            }}
            labelText="Manager"
            value={(this.state.pld.manager as User)._id}>
            <SelectItem text={(this.state.org.owner as User).email} value={(this.state.org.owner as User)._id} />
            {(this.state.org.members as User[]).map((user, index) => {
              return (<SelectItem key={index} value={user._id} text={user.email}/>)
            })}
          </Select>

          <Button onClick={this.onClickUpdatePld}>Mettre a jour</Button>

          <Accordion>
            {this.showRevisions()}
          </Accordion>
        </Stack>
      </>
    )
  }

  private showRevisions() {
    if (this.state.pld === undefined)
      return;
    if (this.state.pld.revisions.length <= 0) {
      return (
        <AccordionItem title={"Dernieres révisions du documents"}>
          <h4>Aucune révisions disponible, vous pouvez en créer dans les "Actions" en bas de page.</h4>
        </AccordionItem>
      )
    }
    return (
      <AccordionItem title="Dernieres révisions du documents">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader id={"date"} key={"date"}>Date</TableHeader>
              <TableHeader id={"version"} key={"version"}>Version</TableHeader>
              <TableHeader id={"auteur"} key={"auteur"}>Auteur</TableHeader>
              <TableHeader id={"sections"} key={"sections"}>Section(s)</TableHeader>
              <TableHeader id={"comments"} key={"comments"}>Commentaires</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.pld.revisions.map((revision, index) => {
              return (
                <TableRow key={index}>
                  <TableCell key={index + ':date'}>{formatDate(new Date(revision.created_date))}</TableCell>
                  <TableCell key={index + ':revision'}>{revision.version}</TableCell>
                  <TableCell key={index + ':auteur'}>{this.state.org?.name}</TableCell>
                  <TableCell key={index + ':sections'}>{revision.sections.join(', ')}</TableCell>
                  <TableCell key={index + ':comments'}>{revision.comments ?? 'Non-défini'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </AccordionItem>
    )
  }

  private showGeneratePanel() {
    if (this.state.org === undefined || this.state.pld === undefined) {
      return (<SkeletonPlaceholder style={{width: '100%'}}/>)
    } else {
      return (<GenerateComponent org={this.state.org} pld={this.state.pld} dod={this.state.dod}/>)

    }
  }

  private onDodCreated() {
    this.loadDod();
  }

  private onDodUpdated() {
    this.loadDod();
  }

  private onDodDeleted() {
    this.loadDod();
  }

  private showDataTable() {
    if (this.state.pld === undefined || this.state.org === undefined)
      return <SkeletonPlaceholder/>
    return <DodTableComponent userContext={this.props.userContext} onCreatedDod={this.onDodCreated} onDeleteDod={this.onDodDeleted} onUpdateDod={this.onDodUpdated} pld={this.state.pld} org={this.state.org} dod={this.state.dod}/>
  }

  private showModals() {
    if (this.state.org === undefined || this.state.pld === undefined)
      return;
    return (
      <>
        <SignPldModal
          open={this.state.openSignModal}
          onDismiss={() => {
            this.setState({
              openSignModal: false,
            })
          }}
          onSuccess={() => null}/>
        <AddRevisionPldModal
          userContext={this.props.userContext}
          version={this.state.pld.version}
          versionShifting={this.state.org.versionShifting}
          org={this.state.org}
          pld={this.state.pld}
          open={this.state.openAddRevisionModal}
          onDismiss={() => {
            this.setState({
              openAddRevisionModal: false,
            })
          }}
          onSuccess={() => {
            this.setState({
              openAddRevisionModal: false,
            })
            toast('Révision ajoutée avec succés 👍 !', {type: 'success'})
            this.loadPld();
          }}/>
      </>
    )
  }

  override render() {
    return (
        <Grid>
          {this.showModals()}
          <Column lg={12} md={8}>
            <Stack gap={6}>
            <Tile>
              <h1 style={{marginBottom: '20px'}}>Informations du pld</h1>
              {this.showInfoPanel()}
            </Tile>
            <Tile>
              <h1>Dod</h1>
              {this.showDataTable()}
            </Tile>
            <Tile>
              <h1>Documents du pld</h1>
            </Tile>
            <Tile>
              <h1>Génération du DOCX/PDF</h1>
              {this.showGeneratePanel()}
            </Tile>
              <Tile>
                <h1>Actions</h1>
                <Button onClick={() => {this.setState({openAddRevisionModal: true})}}>Ajouter une révision</Button>
                <Button onClick={() => {this.setState({openSignModal: true})}}>Signer le PLD</Button>
              </Tile>
            </Stack>
          </Column>
          <Column lg={4} md={8}>
            {this.showQuickInformationPanel()}
            {this.showPldState()}
          </Column>
        </Grid>
    );
  }
}
