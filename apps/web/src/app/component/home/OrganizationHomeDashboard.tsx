import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Button, ClickableTile, Column, DataTableSkeleton, Grid,
  SkeletonPlaceholder,
} from "carbon-components-react";
import Lottie from "lottie-react";
import {Stack} from '@carbon/react'
import {NavigationState, redirectNavigation} from "../../util/Navigation";
import { Organization, Pld, Dod, CalendarEvent } from "@pld/shared";

import {Add} from '@carbon/icons-react'
import { formatShortDate } from "@pld/utils";
import { UserApiController } from "../../controller/UserApiController";
import FullCalendar, { EventClickArg } from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import listGridPlugin from "@fullcalendar/list";
import { parseEvents } from "../../util/Event";
import { LanguageProps, withLanguage } from "../../context/LanguageContext";
import { getDataTranslation, language } from "../../language";
import { ButtonTextCompoundInput } from "@fullcalendar/core";
import { SERVER_URL_ASSETS } from "../../util/User";

type OrganizationHomeDashboardProps = unknown & RequiredUserContextProps & LanguageProps;

type OrganizationHomeDashboardState = {
  loading: boolean;
  organization: Organization[];
  pld: Pld[];
  dods: Dod[];
  calendarEvents: CalendarEvent[];
} & NavigationState

class OrganizationHomeDashboard extends React.Component<OrganizationHomeDashboardProps, OrganizationHomeDashboardState> {

  constructor(props: OrganizationHomeDashboardProps) {
    super(props);
    this.state = {
      loading: true,
      organization: [],
      calendarEvents: [],
      dods: [],
      pld: [],
    }
    this.onClickCreateOrganization = this.onClickCreateOrganization.bind(this);
    this.onClickEvent = this.onClickEvent.bind(this);
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
    UserApiController.getEvents(this.props.userContext.accessToken, (event, error) => {
      if (!error) {
        this.setState({
          calendarEvents: event,
        })
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
                <img style={style.cardImage} src={SERVER_URL_ASSETS + org.picture} alt={"Organization Picture"}/>
              </div>
              <p>Dernière mise a jour: <br/><span style={{fontWeight: 600}}>{formatShortDate(new Date(org.updated_date))}</span></p>
            </ClickableTile>
          </Column>
        })}
      </Grid>
    )
  }

  private onClickEvent(eventArg: EventClickArg) {
    const event: CalendarEvent | undefined = this.state.calendarEvents.find((evt) => evt._id === eventArg.event.id);
    if (event === undefined)
      return;
    console.log(event);
  }

  private showNoEvents() {
    return (
      <>
        <p>Vous n'avez pas d'évènements prochainement</p>
        <Lottie animationData={require('../../../assets/animations/calendar.json')} style={{width: 300}} loop={true}/>
      </>
    )
  }

  private showRecap() {
    if (this.state.calendarEvents.length <= 0)
      return this.showNoEvents();
    return (
      <FullCalendar
        buttonText={getDataTranslation<ButtonTextCompoundInput>(language.calendar, this.props.language.language)}
        titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
        eventClick={this.onClickEvent}
        aspectRatio={4}
        firstDay={1}
        locale={this.props.language.language}
        events={(arg, successCallback) => {successCallback(parseEvents(this.state.calendarEvents))}}
        plugins={[ interactionPlugin, listGridPlugin ]}
        initialView="listWeek"
      />
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
        <Stack gap={8}>
          <div>
            <h1 style={style.orgTitle}>Recap</h1>
            {this.showRecap()}
          </div>
          <div>
            <h1 style={style.orgTitle}>Mes organizations <Button kind={"ghost"} onClick={this.onClickCreateOrganization} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h1>
            {this.showLoading()}
            {this.showNoOrganizations()}
            {this.showOrgCards()}
          </div>
        </Stack>
      </>
    );
  }
}

const style = {
  orgTitle: {
    marginBottom: 8,
    fontWeight: 600
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

export default withLanguage(OrganizationHomeDashboard);
