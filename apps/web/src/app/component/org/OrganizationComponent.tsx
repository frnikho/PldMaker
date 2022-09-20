import React  from "react";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {RequiredUserContextProps} from "../../context/UserContext";
import {ApiError} from "../../util/Api";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ClickableTile,
  Column, Form,
  Grid, NumberInput,
  SkeletonPlaceholder, SkeletonText, TextArea, Tile,
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add, Settings, Renew} from '@carbon/icons-react'
import {NavProps, redirectNavigation, withNav} from "../../util/Navigation";
import {PageState} from "../../util/Page";
import {PldApiController} from "../../controller/PldApiController";
import {FieldData} from "../../util/FieldData";
import {SocketContext} from "../../context/SocketContext";
import {OrgHistoryModal} from "../../modal/org/OrgHistoryModal";

import {RequiredLabel} from "../../util/Label";

import {Organization, Pld, Calendar} from "@pld/shared";
import {formatLongDate} from "@pld/utils";
import {CalendarApiController} from "../../controller/CalendarApiController";
import {toast} from "react-toastify";
import {CircularProgress} from "../utils/CircularProgress";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

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

const pldIllustration = [
  require('../../../assets/illustrations/pld/undraw_content_structure_re_ebkv.png'),
  require('../../../assets/illustrations/pld/undraw_google_docs_re_evm3.png'),
  require('../../../assets/illustrations/pld/undraw_live_collaboration_re_60ha.png'),
  require('../../../assets/illustrations/pld/undraw_blog_post_re_fy5x.png'),
  require('../../../assets/illustrations/pld/undraw_secure_files_re_6vdh.png'),
  require('../../../assets/illustrations/pld/undraw_reviewed_docs_re_9lmr.png'),
  require('../../../assets/illustrations/pld/undraw_personal_documents_re_vcf2.png'),
  require('../../../assets/illustrations/pld/undraw_online_everywhere_re_n3lr.png'),
  require('../../../assets/illustrations/pld/undraw_my_personal_files_re_3q0p.png'),
  require('../../../assets/illustrations/pld/undraw_hiring_re_yk5n.png'),
  require('../../../assets/illustrations/pld/undraw_folder_files_re_2cbm.png'),
  require('../../../assets/illustrations/pld/undraw_customer_survey_re_v9cj.png'),
]

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

  private updateOrgData(key: string, data: any) {
    if (this.state.org === undefined)
      return;
  }

  private showEditableInfo() {
    if (this.state.org === undefined)
      return;
    return (
      <Form>
        <Stack gap={6}>
          <TextArea rows={4} id={"description"} labelText={"Description"} defaultValue={this.state.org.description}/>
          <NumberInput iconDescription={""} id={"versionShifting"} defaultValue={this.state.org.versionShifting} label={<RequiredLabel message={"Versioning"}/>} value={this.state.org.versionShifting}/>
          <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <Button renderIcon={Renew} iconDescription={"Update"} style={{borderRadius: 8}}>Mettre à jour</Button>
            <Button onClick={() => this.props.navigate('manage')} style={{borderRadius: 8}} renderIcon={Settings} iconDescription={"Settings"}>Paramètre</Button>
          </div>
        </Stack>
      </Form>
    )
  }

  private showInfo() {
    if (this.state.org === undefined)
      return;
    return (
      <Tile style={{borderRadius: 10}}>
        <Stack gap={6}>
          <Stack gap={1}>
            <h4 style={{fontWeight: 600}}>Date de création :</h4>
            {this.state.pld === undefined ? <SkeletonText/> : <p>{formatLongDate(new Date(this.state.org?.created_date ?? ""))}</p>}
          </Stack>
          <Stack gap={1}>
            <h4 style={{fontWeight: 600}}>Date de mise à jour :</h4>
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
      <Tile style={{marginTop: 20, borderRadius: 10}}>
        <Stack>
          <h4 style={{fontWeight: 600}}>Membres :</h4>
          {[...this.state.org.members, this.state.org.owner].map((user, index) => (
            <div key={index}>
              <p>{user.lastname.toUpperCase()} {user.firstname}</p>
              <p style={{fontWeight: 100, fontStyle: 'italic'}}>{user.email}</p>
            </div>
          ))}
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
            <Column key={index} sm={4} md={8} lg={5}>
              <ClickableTile onClick={() => {this.setState({navigateUrl: `pld/${pld._id}`})}} style={{borderRadius: 10}}>
                <p style={{fontWeight: 600, fontSize: 26}}>{pld.title} (v{pld.version})</p>
                <p>{pld.description.substring(0, 160)}</p>
                <br/>
                <div style={{width: '100%', textAlign: 'center', marginTop: 20, marginBottom: 20}}>
                  <img style={{maxWidth: '100%', height: 160}} src={pldIllustration[Math.floor(Math.random() * pldIllustration.length)]}/>
                </div>
                <p>Dernière mise a jour le</p>
                <p style={{fontWeight: 'bold'}}>{formatLongDate(new Date(pld.updated_date))}</p>
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
    return this.state.calendars.value.map((calendar, index) => {
      return (
        <ClickableTile style={{borderRadius: 10}} key={index} onClick={() => this.setState({navigateUrl: `calendar/${calendar._id}`})}>
          <h4 style={{fontWeight: 600, fontSize: 26}}>{calendar.name}</h4>
          <p>{calendar.description}</p>
          <FullCalendar
            aspectRatio={3}
            headerToolbar={{start: '', right: '', end: '', center: '', left: ''}}
            locale={'fr'}
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
          />
        </ClickableTile>
      )
    })
  }

  private showDocuments() {
    return (
      <>
      </>
    )
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
          <h1 style={{fontWeight: 600}}>{this.state.org?.name}</h1>
          <Grid>
            <Column lg={12}>
              <Tile style={{borderRadius: 10}}>
                {this.showEditableInfo()}
              </Tile>
              <h2 style={{marginTop: 20, marginBottom: 10}}>Pld <Button kind={"ghost"} onClick={this.onClickCreatePld} hasIconOnly renderIcon={Add} iconDescription={"create org"}/></h2>
              {this.showPld()}
{/*              <h2 style={{marginTop: 20, marginBottom: 10}}>Documents <Button kind={"ghost"} onClick={this.onClickCreateCalendar} hasIconOnly renderIcon={Add} iconDescription={"Create document"}/></h2>
              {this.showDocuments()}*/}
              <h2 style={{marginTop: 20, marginBottom: 10}}>Calendriers <Button kind={"ghost"} onClick={this.onClickCreateCalendar} hasIconOnly renderIcon={Add} iconDescription={"Create calendar"}/></h2>
              {this.showCalendars()}
              {/* <h2>Templates <Button kind={"ghost"} onClick={this.onClickCreateTemplate} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
              <h2>Documents <Button kind={"ghost"} onClick={this.onClickCreateDocument} hasIconOnly renderIcon={Add} iconDescription={"Créer/Ajouter un document"}/></h2>*/}
              {/*<Editor onSave={(content) => console.log('saved !', content)}/>*/}
            </Column>
            <Column lg={4}>
              {this.showInfo()}
              {this.showMembers()}
            </Column>
          </Grid>
        </Stack>
      </>
    );
  }
}

export default withNav(OrganizationComponent);
