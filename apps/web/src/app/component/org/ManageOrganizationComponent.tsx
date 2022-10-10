import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "../../context/UserContext";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import { DodStatus, Organization, OrganizationSection } from "@pld/shared";
import {toast} from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
} from "carbon-components-react";

import {Stack} from '@carbon/react';
import {SocketContext} from "../../context/SocketContext";
import { ManageOrgDodStatusComponent } from "./manage/ManageOrgDodStatusComponent";
import { ManageOrgSectionsComponent } from "./manage/ManageOrgSectionsComponent";
import { ManageOrgMembersComponent } from "./manage/ManageOrgMembersComponent";
import { TransferOrgComponent } from "./manage/TransferOrgComponent";
import { DeleteOrgComponent } from "./manage/DeleteOrgComponent";
import { useNavigate } from "react-router-dom";

type Props = {
  orgId: string;
};

export const ManageOrganizationComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const socketCtx = useContext(SocketContext);
  const [org, setOrg] = useState<undefined | Organization>(undefined);
  const [dodStatus, setDodStatus] = useState<DodStatus[]>([]);
  const [sections, setSections] = useState<OrganizationSection[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrg();
    registerListeners();
  }, [])


  const registerListeners = () => {
    socketCtx.on('Org:Update', ({orgId}: { orgId: string }) => {
      if (props.orgId === orgId) {
        loadOrg();
      }
    });
  }

  const loadDodStatus = () => {
    OrganizationApiController.getOrgDodStatus(userCtx.accessToken, props.orgId, (dodStatus, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        setDodStatus(dodStatus);
      }
    });
  }

  const loadOrg = () => {
    loadSection();
    loadDodStatus();
    OrganizationApiController.findOrganizationById(userCtx.accessToken, props.orgId, (org, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      }
      if (org !== null) {
        setOrg(org);
      }
    });
  }

  const loadSection = () => {
    OrganizationApiController.getOrgSections(userCtx.accessToken, props.orgId, (section, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        setSections(section);
      }
    });
  }

  const showOrg = () => {
    if (org === undefined)
      return;
    return (
      <Stack gap={6}>
        <h2 style={styles.title}>Statuts</h2>
        <ManageOrgDodStatusComponent org={org} dodStatus={dodStatus} onStatusChanged={loadDodStatus} userContext={userCtx}/>
        <h2 style={styles.title}>Sections des DoDs</h2>
        <ManageOrgSectionsComponent sections={sections} org={org} onUpdateSection={loadSection}/>
        <h2 style={styles.title}>Membres</h2>
        <ManageOrgMembersComponent org={org}/>
        <h2 style={styles.title}>Transférer l'organisation</h2>
        <TransferOrgComponent org={org}/>
        <h2 style={styles.title}>Supprimer l'organisation</h2>
        <DeleteOrgComponent org={org}/>
      </Stack>
    )
  }

  return (
    <>
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => {navigate(`/organization/${props.orgId}`);}}>Organisation</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Manage</BreadcrumbItem>
      </Breadcrumb>
      {showOrg()}
    </>);
};

const styles = {
  title: {
    fontWeight: 'bold'
  }
}
