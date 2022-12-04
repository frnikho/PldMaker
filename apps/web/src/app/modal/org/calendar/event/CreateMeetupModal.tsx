import * as React from "react";
import { ModalProps } from "../../../../util/Modal";
import { Button, Checkbox, Modal, MultiSelect, TextArea, TextInput, TimePicker } from "carbon-components-react";
import { useAuth } from "../../../../hook/useAuth";
import { useForm } from "react-hook-form";
import { NewCalendarEvent, Organization } from "@pld/shared";
import { Deadline, formatDateNumeric } from "@pld/utils";

import {Add} from '@carbon/icons-react';
import { ButtonStyle } from "@pld/ui";

import {Stack} from '@carbon/react';
import { RequiredLabel } from "../../../../util/Label";
import Circle from "@uiw/react-color-circle";
import { useEffect, useState } from "react";
import { validate } from "class-validator";
import { CalendarApiController } from "../../../../controller/CalendarApiController";
import { toast } from "react-toastify";
import { LoadingButton } from "../../../../component/utils/LoadingButton";

type Props = {
  date: Date;
  org: Organization;
  calendarId: string;
} & ModalProps;

type EventOptions = {
  name: string;
  description: string;
  members: string[];
  inviteAll: boolean;
  color: string;
  startingHours: string;
  endingHours: string;
}

const colors = [ '#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'];

export const CreateMeetupModal = (props: Props) => {

  const {user, accessToken} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const {watch, setValue, getValues} = useForm<EventOptions>({
    defaultValues: {
      name: '',
      description: '',
      startingHours: '',
      endingHours: '',
      color: '#1abc9c',
      inviteAll: false,
      members: [...props.org.members.map((m) => m._id), props.org.owner._id].filter((a) => a !== user?._id)}
  });

  useEffect(() => {
    setValue('startingHours', props.date.toLocaleString('fr-FR').substring(11, 16));
    const endTime = props.date.setHours(props.date.getHours()+1);
    setValue('endingHours', new Date(endTime).toLocaleString('fr-FR').substring(11, 16))
  }, [setValue, props.date])

  const onClickCreate = () => {
    setLoading(true);
    const meetup = getValues();
    const deadline: Deadline = {
      startDate: new Date(Date.parse(`${props.date.toISOString().substring(0, 10)}, ${meetup.startingHours}`)),
      endDate: new Date(Date.parse(`${props.date.toISOString().substring(0, 10)}, ${meetup.endingHours}`))
    };
    const newEvent: NewCalendarEvent = new NewCalendarEvent(meetup.name, meetup.description, meetup.inviteAll ? [...props.org.members.map((m) => m._id), props.org.owner._id].filter((a) => a !== user?._id) : meetup.members, meetup.color, false, false, undefined, deadline);
    validate(newEvent).then((a) => {
      console.log(a);
      CalendarApiController.createEvent(accessToken, props.org._id, props.calendarId, newEvent, (calendar, error) => {
        if (error || calendar === null) {
          toast('Une erreur est survenue !', {type: 'error'});
        } else {
          toast('Événement créer avec succès !', {type: 'success'});
          props.onSuccess(calendar);
        }
        setLoading(false);
      });
    })
  }

  return (
    <Modal passiveModal open={props.open} onRequestClose={() => props.onDismiss()}>
      <h4 style={{fontWeight: 'bold', marginBottom: '1em'}}>Créer une réunion</h4>
      <Stack gap={2}>
        <RequiredLabel message={"Date de la réunion"}/>
        <div style={{display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: "center", gap: '0.4em'}}>
          Le
          <Button title={"Changer de date"} onClick={() => props.onDismiss(true)} kind={'ghost'}><p style={{fontWeight: 'bold', fontSize: '1rem'}}>{formatDateNumeric(props.date)}</p></Button>
          à
          <TimePicker onChange={(event) => setValue('startingHours', event.currentTarget.value)} style={{width: '7em'}} value={watch('startingHours')} size={'lg'} id={"start-hours"}/>
        </div>
        <div style={{marginBottom: '1em', display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: "center", gap: '0.4em'}}>
          Se termine à
          <TimePicker onChange={(event) => setValue('endingHours', event.currentTarget.value)} style={{width: '7em'}} value={watch('endingHours')} size={'lg'} id={"end-hours"}/>
        </div>
      </Stack>
      <Stack gap={4}>
        <Stack gap={4}>
          <TextInput value={watch('name')} onChange={(event) => {setValue('name', event.currentTarget.value)}} id={"name"} labelText={<RequiredLabel message={"Nom de la réunion"}/>} placeholder={"Réunion hebdomadaire ..."}/>
          <TextArea value={watch('description')} onChange={(event) => {setValue('description' , event.currentTarget.value)}} id={"description"} labelText={<RequiredLabel message={"Description"}/>} placeholder={"Mise en commun des deux dernières semaines ..."}></TextArea>
          <Checkbox labelText={`Invitez tout les membres de l'organisation`}
                    id="invite-all"
                    checked={watch('inviteAll')}
                    onChange={(evt, {checked}) => {setValue('inviteAll', checked)}}/>
          <MultiSelect
            disabled={watch('inviteAll')}
            label={[...props.org.members, props.org.owner].filter((u) => getValues('members').some((m) => u._id === m)).map((a) => `${a.firstname} ${a.lastname}`).join(', ')}
            id="carbon-multiselect-example"
            titleText="Afficher le calendriers des utilisateurs: "
            items={[...props.org.members, props.org.owner].filter((a) => a._id !== user?._id)}
            itemToString={(user) => (`${user.firstname} ${user.lastname} (${user.domain.join(', ')})`)}
            selectionFeedback="top-after-reopen"
            selectedItems={[...props.org.members, props.org.owner].filter((u) => watch('members').some((m) => u._id === m))}
            onChange={({ selectedItems }) => {
              setValue('members', selectedItems.map((u) => u._id));
            }
            }/>
        </Stack>
        <Stack gap={4}>
          <RequiredLabel message={"Couleur"}/>
          <Circle
            colors={colors}
            color={watch('color')}
            onChange={(color) => {
              setValue('color', color.hex);
            }}
          />
        </Stack>
        <LoadingButton loading={loading} renderIcon={Add} style={ButtonStyle.default} onClick={onClickCreate}>Créer la réunion</LoadingButton>
      </Stack>
    </Modal>
  );
};
