import React, { useCallback, useEffect, useState } from "react";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Button, ClickableTile, Column, DataTableSkeleton, Grid,
  SkeletonPlaceholder,
} from "carbon-components-react";
import Lottie from "lottie-react";
import {Stack} from '@carbon/react'
import { Organization, CalendarEvent } from "@pld/shared";

import {Add} from '@carbon/icons-react'
import { formatShortDate } from "@pld/utils";
import { UserApiController } from "../../controller/UserApiController";
import FullCalendar, { EventClickArg } from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import listGridPlugin from "@fullcalendar/list";
import { parseEvents } from "../../util/Event";
import {useAuth} from "../../hook/useAuth";
import {useLanguage} from "../../hook/useLanguage";
import {useNavigate} from "react-router-dom";

export const OrganizationHomeDashboard = () => {

  const {accessToken} = useAuth();
  const {getCurrentLanguage, translate} = useLanguage();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = useCallback(() => {
      OrganizationApiController.getMeOrganizations(accessToken, (orgs, error) => {
        if (!error) {
          setOrgs(orgs);
          setLoading(false);
        } else {
          //TODO check error
        }
      });
      UserApiController.getEvents(accessToken, (event, error) => {
        if (!error) {
          setEvents(event);
        } else {
          //TODO check error
        }
      });
    }, [accessToken]);

  useEffect(() => {
    init();
  }, [init]);

  const onClickCreateOrganization = () => {
    navigate('organization/new');
  }

  const showLoading = () => {
    if (!loading)
      return;
    return (
      <>
        <SkeletonPlaceholder style={{margin: '10px', height: '60px', width: '100%'}}/>
        <DataTableSkeleton/>
      </>
    )
  }

  const showNoEvents = () => {
    return (
      <>
        <p>{translate('home.events.noEvents')}</p>
        <Lottie animationData={require('../../../assets/animations/calendar.json')} style={{width: 300}} loop={true}/>
      </>
    )
  }

  const showOrgCards = () => {
    return (
      <Grid>
        {orgs.map((org, index) => {
          return <Column xlg={4} lg={6} md={4} sm={4} key={index}>
            <ClickableTile style={style.card} onClick={() => navigate(`/organization/${org._id}`)}>
              <p style={style.cardTitle}>{org.name}</p>
              <p style={style.cardDescription}>{org.description.substring(0, 120)} {org.description.length > 120 ? '...' : ''}</p>
              <div style={style.cardImageContainer as any}>
                <img style={style.cardImage} src={org.picture} alt={"Organization"}/>
              </div>
              <p>{translate('lexical.lastUpdateDate')} <br/><span style={{fontWeight: 600}}>{formatShortDate(new Date(org.updated_date))}</span></p>
            </ClickableTile>
          </Column>
        })}
      </Grid>
    )
  }

  const onClickEvent = (eventArg: EventClickArg) => {
    const event: CalendarEvent | undefined = events.find((evt) => evt._id === eventArg.event.id);
    if (event === undefined)
      return;
    console.log(event);
    navigate(`/organization/${event.calendar.org._id}/calendar/${event.calendar._id}/event/${event._id}`);
  }

  const showRecap = () => {
    if (events.length <= 0)
      return showNoEvents();
    return (
      <FullCalendar
        titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
        eventClick={onClickEvent}
        aspectRatio={4}
        firstDay={1}
        locale={getCurrentLanguage()}
        events={(arg, successCallback) => {successCallback(parseEvents(events))}}
        plugins={[ interactionPlugin, listGridPlugin ]}
        initialView="listWeek"
      />
    )
  }

  const showNoOrganizations = () => {
    if (orgs.length !== 0 || loading)
      return;
    return (
      <Stack>
        <Lottie animationData={require('../../../assets/animations/organization.json')} loop={true} style={{width: '300px'}}/>
        <h4>{translate('home.org.noOrgs')}</h4>
        <h4><Button kind={"ghost"} onClick={onClickCreateOrganization}>{translate('home.org.noOrgCreateButton')}</Button></h4>
      </Stack>)
  }

  return (
    <Stack gap={8}>
      <div>
        <h1 style={style.orgTitle}>{translate('home.events.title')}</h1>
        {showRecap()}
      </div>
      <div>
        <h1 style={style.orgTitle}>{translate('home.org.title')} <Button kind={"ghost"} onClick={onClickCreateOrganization} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h1>
        {showLoading()}
        {showNoOrganizations()}
        {showOrgCards()}
      </div>
    </Stack>
  );
};


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
