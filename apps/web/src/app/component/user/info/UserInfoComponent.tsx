import { RequiredUserContextProps } from "../../../context/UserContext";
import { User, UserDomain } from "@pld/shared";
import { Column, FormLabel, Grid, MultiSelect, Select, SelectItem, TextInput, Tile } from "carbon-components-react";
import { formatLongDate, Timezone } from "@pld/utils";
import { LoadingButtonComponent } from "../../LoadingButton";
import React, { useCallback, useEffect, useState } from "react";

import {Stack} from '@carbon/react';
import { useForm } from "react-hook-form";
import { UserApiController } from "../../../controller/UserApiController";
import { toast } from "react-toastify";
import { UploadUserPictureModal } from "../../../modal/UploadUserPictureModal";
import { UserInfoSkeleton } from "./UserInfoSkeleton";

type ShowUserInfoProps = {
  user?: User;
  onUpdateUser: (refreshedUser: User) => void;
} & RequiredUserContextProps;

type UserForm = {
  firstname: string;
  lastname: string;
  domain: string[];
  timezone: string;
}

const defaultUserForm: UserForm = {
  firstname: '',
  domain: [],
  lastname: '',
  timezone: '',
}

export function UserInfoComponent(props: ShowUserInfoProps) {

  const {watch, register, getValues, setValue, handleSubmit} = useForm<UserForm>({ defaultValues: defaultUserForm });
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.user !== undefined) {
      setLoading(false);
      setValue('domain', props.user.domain);
      setValue('firstname', props.user.firstname);
      setValue('lastname', props.user.lastname);
      setValue('timezone', props.user.timezone);
    } else {
      setLoading(true);
    }
  }, [props.user])

  const onUpdate = (form: UserForm) => {
    setLoading(true);
    UserApiController.updateUser(props.userContext.accessToken, {
      firstname: form.firstname,
      lastname: form.lastname,
      domain: form.domain,
      timezone: Timezone[form.timezone]
    }, (user, error) => {
      setLoading(false);
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      }
      if (user !== null) {
        props.onUpdateUser(user);
      }
    });
  }

  const onUploadedPicture = useCallback(() => {
    setModal(false);
    toast('Votre photo de profile va être mis à jour !', {type: 'success'});
    setTimeout(() => {
      props.onUpdateUser(props.user!);
    }, 2000);
  }, []);

  if (props.user) {
    return (
      <Tile style={style.tile}>
        <UploadUserPictureModal open={modal} onDismiss={() => setModal(false)} onSuccess={onUploadedPicture}/>
        <form onSubmit={handleSubmit(onUpdate)}>
          <Grid>
            <Column xlg={6}>
              <TextInput id={"created-date-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Date de création"} value={formatLongDate(new Date(props.user.created_date))}/>
              <TextInput id={"updated-date-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Dernière mise a jour"} value={formatLongDate(new Date(props.user.updated_date))}/>
              <TextInput id={"email-user"} title={'Vous ne pouvez pas changer ce champ !'} labelText={"Email"} value={props.user.email}/>
            </Column>
            <Column xlg={8}>
              <Stack orientation={"vertical"}>
                <FormLabel>Photo de profile</FormLabel>
                <img style={{padding: 12, objectFit: 'cover', width: 200, height: 200}} title={'Mettre à jour'} onClick={() => setModal(true)} src={props.user.profile_picture} alt={""}/>
              </Stack>
            </Column>
          </Grid>
          <TextInput style={{marginBottom: '20px'}} id={"lastname-input"} labelText={"Nom"} {...register('firstname')}/>
          <TextInput id={"firstname-input-disabled"} labelText={"Prénom"} {...register('lastname')}/>
          <Select id={"timezone-input"} labelText={"Timezone"} {...register('timezone')}>
            {Object.keys(Timezone).sort((a, b) => {
              if (a > b) {
                return 1;
              } else {
                return -1;
              }
            }).map((t, index) => {
              return (
                <SelectItem
                  key={index}
                  value={t}
                  text={t}
                />
              )
            })}
          </Select>
          <MultiSelect
            label={getValues('domain').join(', ')}
            titleText={"Domaines d'application"}
            id="domain-list"
            selectedItems={watch('domain').map((a) => ({label: a}))}
            items={Object.keys(UserDomain).map((d) => {
              return {
                label: d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
              }
            }).sort()}
            onChange={(e) => {
              setValue('domain', e.selectedItems.map((a) => a.label));
            }}
          />
          <div style={{marginTop: 24}}>
            <LoadingButtonComponent type={"submit"} isloading={loading}>Mettre a jour</LoadingButtonComponent>
          </div>
        </form>
      </Tile>
    )
  } else {
    return <UserInfoSkeleton/>
  }
}

const style = {
  dangerTitle: {
    fontWeight: 'bold',
    color: '#E74C3C',
    marginTop: 18,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 18,
  },
  tile: {
    borderRadius: 8,
  },
  button: {
    borderRadius: 12,
  }
}
