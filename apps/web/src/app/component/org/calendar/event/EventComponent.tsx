import React, { useCallback, useEffect, useMemo } from "react";
import { CalendarMember, CalendarMemberStatus } from "@pld/shared";
import { OrganizationApiController } from "../../../../controller/OrganizationApiController";
import { CalendarApiController } from "../../../../controller/CalendarApiController";
import { Breadcrumb, BreadcrumbItem, Button, ButtonSet, Column, Grid, OverflowMenu, OverflowMenuItem, Tile } from "carbon-components-react";
import { useNavigate } from "react-router-dom";
import { formatAllDayEventDate, formatLongDate, formatLongDayEventDate, formatShortDate, generateGoogleEventLink, generateOutlookEventLink } from "@pld/utils";
import ReactMarkdown from "react-markdown";
import { Checkmark, CalendarAdd, Close, Edit, Events, HelpFilled, Misuse, TrashCan } from "@carbon/icons-react";
import { useAuth } from "../../../../hook/useAuth";
import { useMaker } from "../../../../hook/useMaker";
import { ButtonStyle, TileStyle } from "@pld/ui";
import { errorToast, successToast } from "../../../../manager/ToastManager";
import { DeleteEventModal } from "../../../../modal/org/calendar/event/DeleteEventModal";
import { useModals } from "../../../../hook/useModals";
import { UpdateEventModal } from "../../../../modal/org/calendar/event/UpdateEventModal";
import * as removeMarkdown from 'remove-markdown';

type Props = {
  orgId: string;
  calendarId: string;
  eventId: string;
};

type Modals = {
  updateEvent: boolean;
  deleteEvent: boolean;
  inviteMembersEvent: boolean;
}

export const EventComponent = (props: Props) => {

  const navigate = useNavigate();
  const {accessToken, user} = useAuth();
  const {org, setOrg, setCalendar, calendar, event, setEvent} = useMaker();
  const {updateEvent, deleteEvent, updateModals} = useModals<Modals>({updateEvent: false, deleteEvent: false, inviteMembersEvent: false});

  const loadOrg = useCallback(() => {
    OrganizationApiController.findOrganizationById(accessToken, props.orgId, (org) => {
      if (org)
        setOrg(org);
    });
  }, [accessToken, setOrg, props.orgId]);

  const loadCalendar = useCallback(() => {
    CalendarApiController.getCalendar(accessToken, props.orgId, props.calendarId, (calendar) => {
      if (calendar)
        setCalendar(calendar);
    });
  }, [accessToken, setCalendar, props.orgId, props.calendarId]);

  const loadEvent = useCallback(() => {
    CalendarApiController.getEvent(accessToken, props.orgId, props.calendarId, props.eventId, (event) => {
      if (event) {
        setEvent(event);
      } else {
        errorToast('Impossible de récupérer les infos de la réunion !');
      }
    })
  }, [accessToken, props.calendarId, props.orgId, props.eventId, setEvent])

  useEffect(() => {
    loadOrg();
    loadCalendar();
    loadEvent();
  }, [loadOrg, loadCalendar, loadEvent]);

  const getEventDates = useMemo(() => {
      if (!event)
        return '';
      if (event.date !== undefined) {
        if (event.allDay) {
          return formatShortDate(new Date(event.date));
        } else {
          return formatLongDate(new Date(event.date));
        }
      } else if (event.deadline !== undefined) {
        if (event.allDay)
          return <p style={{fontSize: 20, margin: 0}}>{formatAllDayEventDate(new Date(event.deadline.startDate))}<br/>{formatAllDayEventDate(new Date(event.deadline.endDate))}</p>;
        return <p style={{fontSize: 20, margin: 0}}>{formatLongDayEventDate(new Date(event.deadline.startDate))}<br/>{formatLongDayEventDate(new Date(event.deadline.endDate))}</p>;
      }
      return '';
    }, [event]);

  const showUserIcon = useCallback((member: CalendarMember) => {
      if (member.status === CalendarMemberStatus.Declined) {
        return (<Misuse color={'red'} />)
      } else if (member.status === CalendarMemberStatus.Accepted) {
        return (<Checkmark color={'green'}/>)
      } else {
        return (<HelpFilled/>)
      }
    }, []);

  const showMembers = useMemo(() => {
      return event?.invitedMembers.map((a, index) => {
        return (<div key={index} title={a.status !== CalendarMemberStatus.Invited ? formatLongDate(new Date(a.updateStatusDate)) : undefined} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <p style={{marginRight: '0.3em'}} >{a.user.firstname} {a.user.lastname.toUpperCase()}</p>
           {showUserIcon(a)}
        </div>);
      })
    }, [event, showUserIcon]);

  const onClickAcceptOrDecline = useCallback((accepted: boolean) => {
    CalendarApiController.updateMembersStatus(accessToken, org._id, calendar._id, event._id, {status: accepted ? CalendarMemberStatus.Accepted : CalendarMemberStatus.Declined}, (event) => {
      if (event) {
        successToast(`Vous avez ${accepted ? 'accepter' : 'décliner'} l'invitation à cette réunion.`);
        loadEvent();
      } else {
        errorToast("Une erreur est survenue !");
      }
    });
  }, [loadEvent, accessToken, org, calendar, event]);

  const showAcceptOrDeclineMeetup = useMemo(() => {
    if (!(event?.invitedMembers.filter((u) => u.status === CalendarMemberStatus.Invited).some((u) => u.user._id === user?._id)))
      return;
    return (
      <div style={{marginBottom: '0.6em'}}>
        <Tile style={TileStyle.default}>
          <p style={{fontWeight: 'bold', marginBottom: '0.8em'}}>Accepter l'invitation à cette réunion ?</p>
          <ButtonSet style={{gap: '0.3em'}}>
            <Button style={ButtonStyle.default} iconDescription={"Accepter"} renderIcon={Checkmark} hasIconOnly onClick={() => onClickAcceptOrDecline(true)}/>
            <Button style={ButtonStyle.default} iconDescription={"Refuser"} renderIcon={Close} kind={'secondary'} hasIconOnly onClick={() => onClickAcceptOrDecline(false)}/>
          </ButtonSet>
        </Tile>
      </div>
    );
  }, [event, user, onClickAcceptOrDecline]);

  const disabledMemberButton: boolean = useMemo(() => {
    if (!event || !org || !user)
      return true;
    const invitedMembersIds = event.invitedMembers.map((i) => i.user._id);
    const members = [...org.members, org.owner].filter((m) => m._id !== user?._id).map((m) => m._id);
    return invitedMembersIds.length <= members.length;
  }, [event, org, user]);

  const showModals = useMemo(() => {
    if (!event || !calendar || !org)
      return;
    return (
      <>
        <DeleteEventModal org={org} calendar={calendar} event={event} open={deleteEvent} onDismiss={() => updateModals('deleteEvent', false)} onSuccess={() => {
          updateModals('deleteEvent', false);
          navigate(`/organization/${org._id}/calendar/${calendar._id}`);
        }}/>
        <UpdateEventModal open={updateEvent} event={event} org={org} calendar={calendar} onSuccess={() => {
            updateModals('updateEvent', false);
            loadEvent();
          }} onDismiss={() => updateModals('updateEvent', false)}/>
      </>
    );
  }, [deleteEvent, loadEvent, updateEvent, updateModals, navigate, event, org, calendar]);

  const showPage = useMemo(() => {
      if (!event || !calendar || !org)
        return;
      return (
        <Grid>
          <Column xlg={4}>
            <h4 style={{fontWeight: 'bold', fontSize: 26}}>{event.title}</h4>
            <h4 style={{fontSize: 24, margin: 0}}>
              {getEventDates}
            </h4>
            <div style={{marginTop: '0.5em'}}>
              <p>Créer par <span style={{fontWeight: 'bold'}}>{event.owner.firstname} {event.owner.lastname.toUpperCase()}</span></p>
              <p>le {formatLongDate(new Date(event.createdDate))}</p>
            </div>
            <OverflowMenu ariaLabel="overflow-menu" iconDescription={"Ajoutez la réunion à un calendrier"} renderIcon={CalendarAdd}>
              <OverflowMenuItem itemText="Google" onClick={() => {
                window.open(generateGoogleEventLink({name: encodeURIComponent(event.title), description: encodeURIComponent(removeMarkdown(event.description)), deadline: event.deadline, location: org.name}), 'blank')
              }
              }/>
              <OverflowMenuItem itemText="Outlook" onClick={() => window.open(generateOutlookEventLink({name: encodeURIComponent(event.title), description: encodeURIComponent(removeMarkdown(event.description)), deadline: event.deadline, location: org.name}), 'blank')}/>
            </OverflowMenu>
            <p style={{fontWeight: 'bold', fontSize: 20, marginTop: 28}}>Membres</p>
            {showMembers}
          </Column>
          <Column xlg={10}>
            <ReactMarkdown>
              {event.description}
            </ReactMarkdown>
          </Column>
          <Column xlg={2}>
            <Button iconDescription={'Inviter des membres'} renderIcon={Events} kind={'ghost'} hasIconOnly disabled={disabledMemberButton}/>
            <Button iconDescription={'Modifier'} renderIcon={Edit} kind={'ghost'} hasIconOnly onClick={() => updateModals('updateEvent', true)}/>
            <Button iconDescription={'Supprimer'} onClick={() => updateModals('deleteEvent', true)} renderIcon={TrashCan} hasIconOnly/>
          </Column>
        </Grid>
      )
    }, [disabledMemberButton, calendar, event, org, getEventDates, showMembers, updateModals]);

  return (
    <div>
      {showModals}
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}/calendar/${props.calendarId}`)}>Calendrier</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Réunion</BreadcrumbItem>
      </Breadcrumb>
      {showAcceptOrDeclineMeetup}
      {showPage}
    </div>
  );
};
