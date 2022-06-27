import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {PldApiController} from "../../controller/PldApiController";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {Pld} from "../../../../../../libs/data-access/pld/Pld";
import {
  Accordion,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Button,
  ButtonSet,
  ButtonSkeleton,
  Column,
  ExpandableTile,
  Grid,
  NumberInput,
  ProgressIndicator,
  ProgressStep,
  Select,
  SelectItem,
  SkeletonPlaceholder,
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextArea,
  TextInput,
  Tile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from "carbon-components-react";

import {Stack, Toggletip, ToggletipButton, ToggletipContent} from '@carbon/react';

import {Classification, DocumentAdd, DocumentTasks, RecentlyViewed, Information, CheckmarkOutline, Incomplete} from '@carbon/icons-react';

import Lottie from "lottie-react";
import {User} from "../../../../../../libs/data-access/user/User";
import {DodTableComponent} from "../dod/DodTableComponent";
import {GenerateComponent} from "./GenerateComponent";
import {DodApiController} from "../../controller/DodApiController";
import {Dod} from "../../../../../../libs/data-access/dod/Dod";
import {SignPldModal} from "../../modal/pld/SignPldModal";
import {AddRevisionPldModal} from "../../modal/pld/AddRevisionPldModal";
import {toast} from "react-toastify";
import {PldStatus} from "../../../../../../libs/data-access/pld/PldStatus";
import {SocketContext} from "../../context/SocketContext";
import {ChangePldTypeModal} from "../../modal/pld/ChangePldTypeModal";
import {OnlineOrgMembersComponent} from "./OnlineOrgMembersComponent";
import {NavProps, withNav} from "../../util/Navigation";
import {ShowFavourIcon} from "../../util/User";
import {FavourType} from "../../../../../../libs/data-access/user/Favour";
import {IncompleteStatusIcon} from "../../icon/IncompleteStatusIcon";
import {RequiredLabel} from "../../util/Label";
import {formatLongDate} from "../../../../../../libs/utility/DateUtility";
import {PldHistoryModal} from "../../modal/pld/PldHistoryModal";

export type PldComponentProps = {
  pldId: string;
  orgId: string;
} & RequiredUserContextProps & NavProps;

export type PldComponentState = {
  org?: Organization;
  pld?: Pld;
  dod: Dod[];
  openSignModal: boolean;
  openHistoryModal: boolean;
  openAddRevisionModal: boolean;
  openChangePldType: boolean;
}

class PldComponent extends React.Component<PldComponentProps, PldComponentState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props) {
    super(props);
    this.state = {
      dod: [],
      org: undefined,
      pld: undefined,
      openAddRevisionModal: false,
      openSignModal: false,
      openChangePldType: false,
      openHistoryModal: false,
    }
    this.onClickUpdatePld = this.onClickUpdatePld.bind(this);
    this.onDodUpdated = this.onDodUpdated.bind(this);
    this.onDodDeleted = this.onDodDeleted.bind(this);
    this.onDodCreated = this.onDodCreated.bind(this);
    this.onPldTypeUpdated = this.onPldTypeUpdated.bind(this);
  }

  private registerListeners() {
    const socket = this.context;
    socket.on('Pld:Update', ({pldId}: { pldId: string }) => {
      if (this.props.pldId === pldId) {
        this.loadPld();
      }
    });
    socket.on('Dod:Update', ({pldId}: { pldId: string }) => {
      if (this.props.pldId === pldId) {
        this.loadDod();
      }
    });
  }

  override componentDidMount() {
    this.loadOrg();
    this.loadPld();
    this.loadDod();
    this.registerListeners();
  }

  private loadOrg() {
    OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        console.log(error);
      }
      if (org !== null) {
        this.setState({
          org: org,
        });
      }
    });
  }

  private loadPld() {
    PldApiController.findPld(this.props.userContext.accessToken, this.props.pldId, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
       this.setState({
         pld: pld,
       })
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
        toast('Pld mis à jour 👍', {type: 'success'});
      }
    });
  }

  private showLastAuthorPld() {
    if (this.state.pld === undefined || this.state.org?.owner === undefined)
      return;
    if (this.state.pld.revisions.length > 0) {
      return this.state.pld.revisions[this.state.pld.revisions.length-1].owner.email;
    } else {
      return ((this.state.org.owner as User).email);
    }
  }

  private showPldState() {
    return (
      <Tile>
        <Stack gap={6}>
          <h4>Status : {this.state.pld?.status.toUpperCase() ?? ""}</h4>
          {this.showSignButton()}
        </Stack>
      </Tile>
    )
  }

  private showQuickInformationPanel() {
    return (
      <Tile>
        <Stack gap={6}>
          <div>
            <h4>Date de création :</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatLongDate(new Date(this.state.pld?.created_date ?? ""))}</p>}
          </div>
          <div>
            <h4 style={{}}>Dernière mise à jour :</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatLongDate(new Date(this.state.pld?.updated_date ?? ""))}</p>}
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
      <Stack gap={6}>
        <TextInput id={"pld-title"} value={this.state.pld.title} labelText={<RequiredLabel message={"Titre"}/>} onChange={(e) => {
          if (this.state.pld !== undefined) {
            this.setState({
              pld: {
                ...this.state.pld,
                title: e.currentTarget.value,
              }
            })
          }
        }}/>
        <TextArea rows={4} id={"pld-description"} labelText={<RequiredLabel message={"Description"}/>} value={this.state.pld.description} onChange={(e) => {
          if (this.state.pld !== undefined) {
            this.setState({
              pld: {
                ...this.state.pld,
                description: e.currentTarget.value,
              }
            })
          }
        }}/>

        <NumberInput id={"promotion"} iconDescription={""} label={<RequiredLabel message={"Promotion"}/>} value={this.state.pld.promotion} onChange={(e) => {
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
          labelText={<RequiredLabel message={"Manager"}/>}
          value={(this.state.pld.manager as User)._id}>
          <SelectItem text={(this.state.org.owner as User).email} value={(this.state.org.owner as User)._id} />
          {(this.state.org.members as User[]).map((user, index) => {
            return (<SelectItem key={index} value={user._id} text={user.email}/>)
          })}
        </Select>

        <Button onClick={this.onClickUpdatePld}>Mettre à jour</Button>

        <Accordion>
          {this.showRevisions()}
        </Accordion>
        {this.showAddRevisionButton()}
      </Stack>
    )
  }

  private showRevisions() {
    if (this.state.pld === undefined)
      return;
    if (this.state.pld.revisions.length <= 0) {
      return (
        <AccordionItem title={"Dernieres révisions du documents"}>
          <h4 style={{margin: '10px'}}>Aucune révisions disponible, vous pouvez en créer dans les "Actions" en bas de page.</h4>
        </AccordionItem>
      )
    }
    return (
      <Stack gap={5}>
        <h4>Tableau des révisions</h4>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader id={"date"} key={"date"}>Date</TableHeader>
              <TableHeader id={"version"} key={"version"}>Version</TableHeader>
              <TableHeader id={"auteur"} key={"auteur"}>Auteur</TableHeader>
              <TableHeader id={"sections"} key={"sections"}>Section(s)</TableHeader>
              <TableHeader id={"comments"} key={"comments"}>Commentaires</TableHeader>
              <TableHeader id={"statusPld"} key={"statusPld"}>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.pld.revisions.map((revision, index) => {
              return (
                <TableRow key={index}>
                  <TableCell key={index + ':date'}>{formatLongDate(new Date(revision.created_date))}</TableCell>
                  <TableCell key={index + ':revision'}>{revision.version}</TableCell>
                  <TableCell key={index + ':auteur'}>{this.state.org?.name}</TableCell>
                  <TableCell key={index + ':sections'}>{revision.sections.join(', ')}</TableCell>
                  <TableCell key={index + ':comments'}>{revision.comments ?? 'Non-défini'}</TableCell>
                  <TableCell key={index + ':statusPld'}>{revision.currentStep}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Stack>
    )
  }

  private showAddRevisionButton() {
    if (this.state.org === undefined || this.state.pld === undefined) {
      return (<ButtonSkeleton/>)
    } else {
      return (<Button renderIcon={DocumentAdd} onClick={() => this.setState({openAddRevisionModal: true})}>Ajouter une révision</Button>)
    }
  }

  private showSignButton() {
   if (this.state.org === undefined || this.state.pld === undefined) {
     return (<ButtonSkeleton/>)
   } else {
     return (<Button renderIcon={DocumentTasks} onClick={() => this.setState({openSignModal: true})}>Signer le PLD</Button>);
   }
  }

  private showChangeStepButton() {
    if (this.state.org === undefined || this.state.pld === undefined) {
      return (<ButtonSkeleton/>)
    } else {
      return (<Button renderIcon={Classification} onClick={() => this.setState({openChangePldType: true})}>Changer l'état d'avancement</Button>)
    }
  }

  private showGenerateButton() {
    if (this.state.org === undefined || this.state.pld === undefined) {
      return (<ButtonSkeleton/>)
    } else {
      return (<GenerateComponent org={this.state.org} pld={this.state.pld} dod={this.state.dod}/>)
    }
  }

  private showHistoryButton() {
    if (this.state.org === undefined || this.state.pld === undefined) {
      return (<ButtonSkeleton/>)
    } else {
      return (<Button onClick={() => this.setState({openHistoryModal: true})} renderIcon={RecentlyViewed} iconDescription="">Voir tout les changements</Button>)
    }
  }

  private onPldTypeUpdated(step) {
    PldApiController.updatePld(this.props.userContext.accessToken, {
      pldId: this.props.pldId,
      currentStep: step
    }, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
        toast('PLD mis à jour 👍', {type: 'success'});
      }
    });
    this.setState({
      openChangePldType: false,
    });
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
        <PldHistoryModal
          pld={this.state.pld}
          org={this.state.org}
          dod={this.state.dod}
          open={this.state.openHistoryModal} onDismiss={() => this.setState({openHistoryModal: false})} onSuccess={() => {}}
        />
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
        <ChangePldTypeModal
          pld={this.state.pld}
          open={this.state.openChangePldType}
          onDismiss={() => this.setState({openChangePldType: false})}
          onSuccess={(a) => this.onPldTypeUpdated(a)}/>
      </>
    )
  }

  private showOnlineMembers() {
    if (this.state.org === undefined)
      return;
    return (<OnlineOrgMembersComponent org={this.state.org} userContext={this.props.userContext}/>)
  }

  private showStepOfPld() {
    if (this.state.pld === undefined)
      return;
    return (
      <Tile>
        <div style={{display: 'flex'}}>
          <h4>État d'avancement</h4>
          <div style={{marginLeft: 'auto', marginTop:'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'center'}}>
            <Toggletip>
              <ToggletipButton>
                <Information size={16} />
              </ToggletipButton>
              <ToggletipContent>
                <div style={{display: 'flex'}}>
                  <CheckmarkOutline size={14} style={{marginRight: '14px', marginTop: 'auto', marginBottom: 'auto'}}/>
                  <p>Completer</p>
                </div>
                <div style={{display: 'flex'}}>
                  <Incomplete size={14} style={{marginRight: '14px', marginTop: 'auto', marginBottom: 'auto'}}/>
                  <p>En cours</p>
                </div>
                <div style={{display: 'flex'}}>
                  <IncompleteStatusIcon size={14} style={{marginRight: '14px', marginTop: 'auto', marginBottom: 'auto'}}/>
                  <p>Pas commencer</p>
                </div>
              </ToggletipContent>
            </Toggletip>
          </div>
        </div>
        <ProgressIndicator style={{marginTop: '20px'}} vertical>
          <ProgressStep
            complete
            label="Création"
          />

          {this.state.pld.steps.map((step, index) => {
            if (this.state.pld === undefined)
              return null;
            const currentIndex = this.state.pld.steps.findIndex((step) => step === this.state.pld?.currentStep);
            return (<ProgressStep
              key={index}
              complete={index < currentIndex}
              current={currentIndex === index}
              label={`Édition (${step})`}
            />);
          }).filter((e) => e !== null)}
          <ProgressStep
            complete={this.state.pld.status === PldStatus.signed}
            label="Signé"
          />
        </ProgressIndicator>
      </Tile>
    )
  }

  private showBreadcrumb() {
    const item = (
      <>
        <BreadcrumbItem onClick={() => this.props.navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => {this.props.navigate(`/organization/${this.props.orgId}`);}}>{this.state.org?.name ?? "Organisation"}</BreadcrumbItem>
        <BreadcrumbItem onClick={() => null} isCurrentPage>{this.state.pld?.title ?? 'PLD'}</BreadcrumbItem>
      </>);
    if (this.state.org === undefined) {
      return (
        <BreadcrumbSkeleton style={{marginBottom: '40px'}}>
          {item}
        </BreadcrumbSkeleton>
      )
    } else {
      return (
        <Breadcrumb style={{marginBottom: '40px'}}>
          {item}
        </Breadcrumb>
      )
    }
  }

  override render() {
    return (
      <>
        {this.showBreadcrumb()}
        <Grid>
          {this.showModals()}
          <Column lg={12} md={8} sm={4}>
            <Stack gap={6}>
              <Tile>
                  <div style={{display: 'flex'}}>
                    <h1 style={{marginBottom: '20px'}}>Informations</h1>
                    <div style={{marginLeft: 'auto', marginRight: '0px', textAlign: 'end', marginTop:'auto', marginBottom: 'auto'}}>
                      {this.state.pld !== undefined  ? <ShowFavourIcon type={FavourType.PLD} data={this.state.pld}/> : null}
                    </div>
                  </div>
                {this.showInfoPanel()}
              </Tile>
              <Tile>
                <h1>DoDs</h1>
                {this.showDataTable()}
              </Tile>
              <ExpandableTile>
                <TileAboveTheFoldContent>
                  <h1>Documents</h1>
                  <p>Pour le moments, les documents ne sont pas encore disponible.</p>
                </TileAboveTheFoldContent>
                <TileBelowTheFoldContent>
                  <Lottie>
                    <Lottie animationData={require('../../../assets/animations/wip.json')} loop={true} style={{width: '300px'}}/>
                  </Lottie>
                </TileBelowTheFoldContent>
              </ExpandableTile>
              <ButtonSet style={{marginBottom: '20px'}}>
                {this.showChangeStepButton()}
                {this.showGenerateButton()}
                {this.showHistoryButton()}
              </ButtonSet>
            </Stack>
          </Column>
          <Column lg={4} md={8} sm={4}>
            <Stack gap={6}>
              {this.showQuickInformationPanel()}
              {this.showPldState()}
              {this.showStepOfPld()}
              {this.showOnlineMembers()}
            </Stack>
          </Column>
        </Grid>
      </>
    );
  }
}

export default withNav(PldComponent);
