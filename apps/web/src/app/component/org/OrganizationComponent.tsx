import React, { useEffect } from "react";
import {OrganizationApiController} from "../../controller/OrganizationApiController";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column, Grid, SkeletonText
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add} from '@carbon/icons-react'
import {PldApiController} from "../../controller/PldApiController";
import {OrgHistoryModal} from "../../modal/org/OrgHistoryModal";

import { FavourType } from "@pld/shared";
import {CalendarApiController} from "../../controller/CalendarApiController";
import {toast} from "react-toastify";

import { ShowFavourIcon } from "../../util/User";
import { TemplateApiController } from "../../controller/TemplateApiController";
import { OrgMembersComponent } from "./panel/OrgMembersComponent";
import { OrgMembersSkeleton } from "./panel/OrgMembersSkeleton";
import { OrgQuickInfoComponent } from "./panel/OrgQuickInfoComponent";
import { OrgQuickInfoSkeleton } from "./panel/OrgQuickInfoSkeleton";
import { OrgInfoComponent } from "./panel/OrgInfoComponent";
import { OrgInfoSkeleton } from "./panel/OrgInfoSkeleton";
import { useMaker } from "../../hook/useMaker";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";
import { useModals } from "../../hook/useModals";
import { OrgPldItemComponent } from "./item/OrgPldItemComponent";
import { OrgCalendarItemComponent } from "./item/OrgCalendarItemComponent";
import { OrgTemplateItemComponent } from "./item/OrgTemplateItemComponent";
import { OrgListSkeleton } from "./item/OrgItemSkeleton";
import { OrgCalendarItemSkeleton } from "./item/OrgCalendarItemSkeleton";

type Props = {
  orgId: string;
};

type Modals = {
  openHistory: boolean;
}

export const OrganizationComponent = (props: Props) => {

  const {accessToken} = useAuth();
  const {org, setOrg, plds, setPlds, calendars, setCalendars, templates, setTemplates} = useMaker();
  const {openHistory, updateModals} = useModals<Modals>({openHistory: false});
  const navigate = useNavigate();

  useEffect(() => {
    loadOrg();
    loadCalendars();
    loadTemplates();
  }, []);

  const loadCalendars = () => {
    CalendarApiController.getCalendars(accessToken, props.orgId, (calendar, error) => {
      if (!error) {
        setCalendars(calendar);
      } else {
        toast('Une erreur est survenue lors du chargement des calendriers !', {type: 'error', icon: '❌'});
        console.log(error);
        setCalendars([]);
      }
    });
  }

  const loadOrg = () => {
    OrganizationApiController.findOrganizationById(accessToken, props.orgId, (org, error) => {
      if (error) {
        console.log(error);
      } else if (org !== null) {
        setOrg(org);
        loadPld(org._id);
      }
    });
  }

  const loadTemplates = () => {
    TemplateApiController.getTemplates(accessToken, props.orgId, (templates, error) => {
      if (error) {
        console.log(error);
      } else {
        setTemplates(templates);
      }
    })
  }

  const loadPld = (orgId: string) => {
    PldApiController.findOrgPld(accessToken, orgId, (pld, error) => {
      if (!error) {
        setPlds(pld);
      } else {
       console.log(error);
      }
    });
  }

  const showTitle = () => {
    if (org !== undefined) {
      return (
        <div style={{display: 'flex'}}>
          <h1 style={{fontWeight: 600}}>{org.name}</h1>
          <div style={{marginLeft: 'auto', marginRight: '0px', textAlign: 'end', marginTop:'auto', marginBottom: 'auto'}}>
            <ShowFavourIcon type={FavourType.ORG} data={org}/>
          </div>
        </div>
      )
    } else {
      return (
        <SkeletonText style={{height: 40}}/>
      )
    }
  }

  return (
    <>
      {org ? <OrgHistoryModal org={org} open={openHistory} onDismiss={() => updateModals('openHistory', false)} onSuccess={() => null}/> : null}
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate(`/`)}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Organisation</BreadcrumbItem>
      </Breadcrumb>
      <Stack gap={4}>
        {showTitle()}
        <Grid>
          <Column lg={12} xlg={12} md={8} sm={4}>
            {org ? <OrgInfoComponent org={org} onOrgUpdated={() => loadOrg()}/> : <OrgInfoSkeleton/>}
            <h2 style={{marginTop: 20, marginBottom: 10}}>Pld <Button kind={"ghost"} onClick={() => navigate('pld/new')} hasIconOnly renderIcon={Add} iconDescription={"create org"}/></h2>
            {!org ? <OrgListSkeleton/> : <Grid>{plds.map((pld, index) =>
                <Column key={index} sm={4} md={8} lg={5}>
                  <OrgPldItemComponent pld={pld}/>
                </Column>
              )}</Grid>}
            <h2 style={{marginTop: 20, marginBottom: 10}}>Calendriers <Button kind={"ghost"} onClick={() => navigate('calendar/new')} hasIconOnly renderIcon={Add} iconDescription={"Create calendar"}/></h2>
            {!org ? <OrgCalendarItemSkeleton/> : calendars.map((calendar, index) =>
              <OrgCalendarItemComponent key={index} calendar={calendar}/>
            )}
            <h2>Templates <Button kind={"ghost"} onClick={() => navigate('template/new')} hasIconOnly renderIcon={Add} iconDescription={"Créer une nouvelle organisation"}/></h2>
            {!org ? <OrgListSkeleton/> : <Grid>{templates.map((template, index) =>
              <Column key={index} sm={4} md={8} lg={5}>
                <OrgTemplateItemComponent template={template}/>
              </Column>
            )}</Grid>}

          </Column>
          <Column lg={4} xlg={4} md={8} sm={4}>
            <Stack gap={4}>
              {org ? <OrgQuickInfoComponent org={org}/> : <OrgQuickInfoSkeleton/>}
              {org ? <OrgMembersComponent org={org}/> : <OrgMembersSkeleton/>}
            </Stack>
          </Column>
        </Grid>
      </Stack>
    </>
  );
};
