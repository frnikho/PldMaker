import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {PldApiController} from "../../controller/PldApiController";
import { Organization, Pld, Dod, FavourType, OrganizationSection, DodStatus, Template } from "@pld/shared";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonSet, ButtonSkeleton,
  Column,
  Grid, SkeletonText,
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {RecentlyViewed, Hourglass, Download} from '@carbon/icons-react';

import {DodApiController} from "../../controller/DodApiController";
import {toast} from "react-toastify";
import {SocketContext} from "../../context/SocketContext";
import {PldOnlineMembersComponent} from "./panel/PldOnlineMembersComponent";
import {ShowFavourIcon} from "../../util/User";
import {PldHistoryModal} from "../../modal/pld/PldHistoryModal";
import { ResumePldModal } from "../../modal/pld/ResumePldModal";
import { PldStepsComponent } from "./panel/PldStepsComponent";
import { PldQuickInfoComponent } from "./panel/PldQuickInfoComponent";
import { PldStateComponent } from "./panel/PldStateComponent";
import { PldInfoComponent } from "./panel/PldInfoComponent";
import { useNavigate } from "react-router-dom";
import { PldDoDsComponents } from "./panel/PldDoDsComponents";
import { PldDocumentsComponent } from "./panel/PldDocumentsComponent";
import { ButtonStyle } from "../../style/ButtonStyle";
import { GeneratePldModal, ReportForm } from "../../modal/pld/GeneratePldModal";
import { PldGenerator } from "../../docx/PldGenerator";
import {PldQuickInfoSkeleton} from "./panel/PldQuickInfoSkeleton";
import {PldInfoSkeleton} from "./panel/PldInfoSkeleton";
import {PldOnlineMembersSkeleton} from "./panel/PldOnlineMembersSkeleton";
import {PldStateSkeleton} from "./panel/PldStateSkeleton";
import {PldStepsSkeleton} from "./panel/PldStepsSkeleton";
import {PldDoDsSkeleton} from "./panel/PldDoDsSkeleton";

type Props = {
  pldId: string;
  orgId: string;
};

type Modals = {
  openHistory: boolean;
  openResume: boolean;
  openSign: boolean;
  openGenerate: boolean;
}

export const PldComponent = (props: Props) => {

  const [org, setOrg] = useState<Organization | undefined>(undefined);
  const [pld, setPld] = useState<Pld | undefined>(undefined);
  const [dod, setDod] = useState<Dod[]>([]);
  const [dodStatus, setDodStatus] = useState<DodStatus[]>([]);
  const [sections, setSections] = useState<OrganizationSection[]>([]);
  const [modals, setModals] = useState<Modals>({openHistory: false, openResume: false, openSign: false, openGenerate: false});
  const userCtx = useContext<UserContextProps>(UserContext);
  const socketCtx = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    registerListeners();
    loadOrg();
    loadPld();
    loadDodStats();
    loadDod();
    loadSections();
  }, []);

  const registerListeners = () => {
    socketCtx.on('Pld:Update', ({pldId}: { pldId: string }) => {
      if (props.pldId === pldId) {
        loadPld();
      }
    });
    socketCtx.on('Dod:Update', ({pldId}: { pldId: string }) => {
      if (props.pldId === pldId) {
        loadDod();
      }
    });
  }

  const updateModal = (modal: keyof Modals, value: boolean) => {
    setModals({
      ...modals,
      [modal]: value
    })
  }

  const loadDodStats = () => {
    OrganizationApiController.getOrgDodStatus(userCtx.accessToken, props.orgId, (dodStatus, error) => {
      if (error) {
        toast('une erreur est survenue lors de la récupération des statuts !');
      } else {
        setDodStatus(dodStatus);
      }
    });
  }

  const loadOrg = () => {
    OrganizationApiController.findOrganizationById(userCtx.accessToken, props.orgId, (org, error) => {
      if (error) {
        console.log(error);
      }
      if (org !== null) {
        setOrg(org);
      }
    });
  }

  const loadSections = () => {
    OrganizationApiController.getOrgSections(userCtx.accessToken, props.orgId, (sections, error) => {
      if (error) {
        console.log(error);
      }
      if (sections !== null) {
        setSections(sections);
      }
    })
  }

  const loadPld = () => {
    PldApiController.findPld(userCtx.accessToken, props.orgId, props.pldId, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
        setPld(pld);
      }
    });
  }

  const loadDod = () => {
    DodApiController.findDodWithPld(userCtx.accessToken, props.orgId, props.pldId, (dod, error) => {
      if (error) {
        toast(error.error, {type: 'error'})
      } else {
        setDod(dod);
      }
    });
  }

  const generate = (report: ReportForm, template?: Template) => {
    if (!org || !pld) {
      toast('Impossible de récupérer les informations pour générer le document !', {type: 'error'});
      return;
    }
    const generator = new PldGenerator(org, pld, dod, dodStatus, report, template);
    PldGenerator.getBlobFromDoc(generator.generate(), (blob) => {
      window.open(URL.createObjectURL(blob));
    });
  }

  const showTitle = () => {
    if (pld !== undefined) {
      return <h1 style={{fontWeight: 'bold'}}>{pld.title}</h1>
    } else {
      return <SkeletonText heading style={{height: '40px', width: '400px'}}/>
    }
  }

  const showButtons = () => {
    if (pld !== undefined && org !== undefined) {
      return (
        <ButtonSet style={{marginBottom: '20px', gap: 10}}>
          <Button style={ButtonStyle.default} onClick={() => updateModal('openGenerate', true)} renderIcon={Download} iconDescription="">Télécharger le document</Button>
          <Button style={ButtonStyle.default} onClick={() => updateModal('openHistory', true)} renderIcon={RecentlyViewed} iconDescription="">Voir tout les changements</Button>
          <Button style={ButtonStyle.default} onClick={() => updateModal('openResume', true)} renderIcon={Hourglass} iconDescription="">Voir le résume des J/H</Button>
        </ButtonSet>
      )
    } else {
      return (
        <ButtonSet style={{marginBottom: '20px', gap: 10}}>
          <ButtonSkeleton/>
          <ButtonSkeleton/>
          <ButtonSkeleton/>
        </ButtonSet>
      )
    }
  }

  return (
    <>
      {pld && org ? <GeneratePldModal
        pld={pld}
        org={org}
        open={modals.openGenerate}
        onClickDownload={generate}
        onDismiss={() => updateModal('openGenerate', false)}
        onSuccess={() => null}/> : null}
      {pld && org ? <PldHistoryModal
        pld={pld}
        org={org}
        dods={dod}
        open={modals.openHistory} onDismiss={() => updateModal("openHistory", false)} onSuccess={() => null}
      /> : null}
      {pld && org ? <ResumePldModal
        onDismiss={() => updateModal('openResume', false)}
        dodColors={dodStatus}
        onSuccess={() => updateModal('openResume', false)}
        reload={() => loadOrg()}
        sections={sections}
        pld={pld} org={org} dods={dod} open={modals.openResume} hide={(show) => updateModal('openResume', show)} /> : null}
      <Breadcrumb noTrailingSlash style={{marginBottom: 40}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem onClick={() => null} isCurrentPage>Pld</BreadcrumbItem>
      </Breadcrumb>
      <div style={{display: 'flex'}}>
        {showTitle()}
        <div style={{marginLeft: 'auto', marginRight: '0px', textAlign: 'end', marginTop:'auto', marginBottom: 'auto'}}>
          {pld !== undefined ? <ShowFavourIcon type={FavourType.PLD} data={pld}/> : null}
        </div>
      </div>
      <Grid>
        <Column lg={12} md={8} sm={4}>
          <Stack gap={6}>
            {pld && org ? <PldInfoComponent pld={pld} org={org} loadPld={loadPld}/> : <PldInfoSkeleton/>}
            {pld && org ? <PldDoDsComponents reloadDoDs={() => loadDod()} sections={sections} pld={pld} org={org} dod={dod} dodStatus={dodStatus}/> : <PldDoDsSkeleton/>}
            <PldDocumentsComponent/>
            {showButtons()}
          </Stack>
        </Column>
        <Column lg={4} md={8} sm={4}>
          <Stack gap={6}>
            {pld && org ? <PldQuickInfoComponent pld={pld} org={org}/> : <PldQuickInfoSkeleton/>}
            {pld ? <PldStateComponent pld={pld}/> : <PldStateSkeleton/>}
            {pld && org ? <PldStepsComponent pld={pld} org={org} onPldStepUpdated={loadPld}/> : <PldStepsSkeleton/>}
            {org ? <PldOnlineMembersComponent org={org} /> : <PldOnlineMembersSkeleton/>}
          </Stack>
        </Column>
      </Grid>
    </>
  );
};
