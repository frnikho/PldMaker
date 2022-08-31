import React from "react";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {RequiredUserContextProps} from "../../context/UserContext";
import {ApiError} from "../../util/Api";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonSet,
  ClickableTile,
  Column, Form,
  Grid, NumberInput,
  SkeletonPlaceholder, SkeletonText, TextArea, Tile,
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add, Settings, Renew, RecentlyViewed} from '@carbon/icons-react'
import {NavProps, redirectNavigation, withNav} from "../../util/Navigation";
import {PageState} from "../../util/Page";
import {PldApiController} from "../../controller/PldApiController";
import {FieldData} from "../../util/FieldData";
import {SocketContext} from "../../context/SocketContext";
import {ShowFavourIcon} from "../../util/User";
import {OrgHistoryModal} from "../../modal/org/OrgHistoryModal";

import {RequiredLabel} from "../../util/Label";

import {Organization, Pld, FavourType, Calendar} from "@pld/shared";
import {formatLongDate, formatShortDate} from "@pld/utils";
import {CalendarApiController} from "../../controller/CalendarApiController";
import {toast} from "react-toastify";
import {CircularProgress} from "../utils/CircularProgress";

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export type OrganizationComponentProps = {
  orgId?: string;
  onError: (error: ApiError) => void;
} & RequiredUserContextProps & NavProps;

export type OrganizationComponentState = {
  org?: Organization;
  pld: FieldData<Pld[]>;
  calendars: FieldData<Calendar[]>;
  openHistoryDialog: boolean;
} & PageState;

class OrganizationComponent extends React.Component<OrganizationComponentProps, OrganizationComponentState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;

  constructor(props: OrganizationComponentProps) {
    super(props);
    this.state = {
      openHistoryDialog: false,
      org: undefined,
      loading: false,
      navigateUrl: undefined,
      calendars: {
        value: [],
        loading: true,
      },
      pld: {
        value: [],
        loading: true,
      },
    }
    this.onClickCreateDocument = this.onClickCreateDocument.bind(this);
    this.onClickCreatePld = this.onClickCreatePld.bind(this);
    this.onClickCreateTemplate = this.onClickCreateTemplate.bind(this);
    this.onClickCreateCalendar = this.onClickCreateCalendar.bind(this);
  }

  override componentDidMount() {
    this.loadOrg();
    this.loadCalendars();
  }

  private loadCalendars() {
    if (this.props.orgId === undefined)
      return;
    CalendarApiController.getCalendars(this.props.userContext.accessToken, this.props.orgId, (calendar, error) => {
      if (!error) {
        this.setState({
          calendars: {
            value: calendar,
            loading: false,
          }
        })
      } else {
        toast('Une erreur est survenue lors du chargement des calendriers !', {type: 'error', icon: '❌'});
        console.log(error);
        this.setState({calendars: {loading: false, value: []}})
      }
    });
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
/*    this.setState({
      navigateUrl: 'document'
    })*/
  }

  private onClickCreateTemplate() {
    this.setState({
      navigateUrl: 'template/new'
    })
  }

  private onClickCreateCalendar() {
    this.setState({
      navigateUrl: 'calendar/new'
    });
  }

  private showModals() {
    if (this.state.org === undefined) {
      return undefined;
    }
    return (
        <OrgHistoryModal org={this.state.org} open={this.state.openHistoryDialog} onDismiss={() => {this.setState({openHistoryDialog: false})}} onSuccess={() => null}/>
    )
  }

  private showEditableInfo() {
    if (this.state.org === undefined)
      return;
    return (
      <Form>
        <Stack gap={6}>
          <h4>Informations</h4>
          <TextArea rows={4} id={"description"} labelText={"Description"} value={this.state.org.description}/>
          <NumberInput iconDescription={""} id={"versionShifting"} value={this.state.org.versionShifting} label={<RequiredLabel message={"Versioning"}/>}/>
          <Button renderIcon={Renew} iconDescription={"Update"}>Mettre à jour</Button>
        </Stack>
      </Form>
    )
  }

  private showInfo() {
    if (this.state.org === undefined)
      return;
    return (
      <Tile>
        <Stack gap={4}>
          <Stack gap={3}>
            <h4>Date de création :</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatLongDate(new Date(this.state.org?.created_date ?? ""))}</p>}
          </Stack>
          <Stack gap={3}>
            <h4>Date de mise à jour :</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatLongDate(new Date(this.state.org?.updated_date ?? ""))}</p>}
          </Stack>
        </Stack>
      </Tile>
    )
  }

  private showMembers() {
    if (this.state.org === undefined)
      return;
    return (
      <Tile style={{marginTop: 20}}>
        <Stack>
          <h4>Membres :</h4>
          {[...this.state.org.members, this.state.org.owner].map((user, index) => <p key={index}>{user.email}</p>)}
        </Stack>
      </Tile>
    )
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
                <h4>{pld.title}</h4>
                <p>{pld.description}</p>
                <p>{pld.version}</p>
                <p>{pld.currentStep}</p>
                <br/>
                <p style={{fontStyle: 'italic'}}>Création</p>
                <p>{formatShortDate(new Date(pld.created_date ?? new Date()))}</p>
                <p style={{fontStyle: 'italic'}}>Dernière mise a jour</p>
                <p>{formatShortDate(new Date(pld.created_date ?? new Date()))}</p>
                <div style={{marginLeft: 'auto', marginRight: '0px', textAlign: 'end'}}>
                  <ShowFavourIcon type={FavourType.PLD} data={pld} clickable={false}/>
                </div>
              </ClickableTile>
            </Column>
          )
        })}
      </Grid>
    )
  }

  private showCalendars() {
    if (this.state.calendars.loading) {
      return <CircularProgress/>
    }
    return this.state.calendars.value.map((calendar) => {
      return (
        <ClickableTile>
          <p>{calendar.name}</p>
          <FullCalendar
            aspectRatio={4}

            locale={'fr'}
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
          />
        </ClickableTile>
      )
    })
  }

  private showCharts() {
    return (
      <div>
        {/*<ResponsiveCalendar
          data={data}
          from={new Date(this.state.org?.created_date ?? new Date())}
          to={new Date()}
          emptyColor="#eeeeee"
          colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
          margin={{ right: 40, left: 40 }}
          yearSpacing={20}
          monthBorderColor="#ffffff"
          dayBorderWidth={1}
          dayBorderColor="#ffffff"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left'
            }
          ]}
        />*/}
      </div>
    )
  }

  override render() {
    return (
      <>
        {this.showModals()}
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.props.navigate(`/`)}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{this.state.org?.name ?? "Organisation"}</BreadcrumbItem>
        </Breadcrumb>
        {this.showCharts()}
        <Stack gap={4}>
          {redirectNavigation(this.state.navigateUrl)}
          <h1>{this.state.org?.name}</h1>
          <Grid>
            <Column lg={12}>
              <Tile>
                {this.showEditableInfo()}
              </Tile>
            </Column>
            <Column lg={4}>
              <Stack>
                {this.showInfo()}
                {this.showMembers()}
              </Stack>
            </Column>
          </Grid>
          <h2 style={{marginTop: 10}}>Pld <Button kind={"ghost"} onClick={this.onClickCreatePld} hasIconOnly renderIcon={Add} iconDescription={"create org"}/></h2>
          {this.showPld()}
          <h2 style={{marginTop: 10}}>Calendriers <Button kind={"ghost"} onClick={this.onClickCreateCalendar} hasIconOnly renderIcon={Add} iconDescription={"Create calendar"}/></h2>
          {this.showCalendars()}
         {/* <h2>Templates <Button kind={"ghost"} onClick={this.onClickCreateTemplate} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
          <h2>Documents <Button kind={"ghost"} onClick={this.onClickCreateDocument} hasIconOnly renderIcon={Add} iconDescription={"Créer/Ajouter un document"}/></h2>*/}
          <ButtonSet style={{marginTop: 10, marginBottom: '20px'}}>
            <Button onClick={() => this.props.navigate('manage')} renderIcon={Settings} iconDescription={"Settings"}>Gérer</Button>
            <Button disabled onClick={() => this.setState({openHistoryDialog: true})} renderIcon={RecentlyViewed} iconDescription={"History"}>Historique</Button>
          </ButtonSet>
        </Stack>
      </>
    );
  }
}

export default withNav(OrganizationComponent);
