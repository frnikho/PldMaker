import * as React from "react";
import { Button, NumberInput, Select, SelectItem, TextArea, TextInput, Tile } from "carbon-components-react";
import { RequiredLabel } from "../../../util/Label";
import { Organization, Pld, User } from "@pld/shared";
import { PldRevisionsComponent } from "./PldRevisionsComponent";

import { Stack } from '@carbon/react';

import { Renew } from '@carbon/icons-react';

import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PldApiController } from "../../../controller/PldApiController";
import { toast } from "react-toastify";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { TileStyle } from "../../../style/TileStyle";
import { ButtonStyle } from "../../../style/ButtonStyle";

type Props = {
  pld: Pld
  org: Organization;
  loadPld: () => void;
};

type InfoForm = {
  title: string;
  description: string;
  promotion: number;
  manager: User;
}

export const PldInfoComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const {getValues, watch, setValue, formState: {errors}} = useForm<InfoForm>({
    defaultValues: {
      description: props.pld.description,
      manager: props.pld.manager,
      promotion: props.pld.promotion,
      title: props.pld.title,
    }
  });

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    setValue('manager', props.pld.manager);
    setValue('promotion', props.pld.promotion);
    setValue('title', props.pld.title);
    setValue('description', props.pld.description);
  }

  const onUpdatePld = () => {
    const form = getValues();
    PldApiController.updatePld(userCtx.accessToken, props.org._id,{
      title: form.title,
      pldId: props.pld._id,
      promotion: form.promotion,
      manager: form.manager._id,
      description: form.description,
    }, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
        toast('Pld mis à jour ', {type: 'success', icon: '👍'});
      }
    });
    props.loadPld();
  }

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <TextInput id={"pld-title"} value={watch('title')} labelText={<RequiredLabel message={"Titre"}/>} onChange={(e) => setValue('title', e.currentTarget.value)}/>
        <TextArea rows={4} id={"pld-description"}  labelText={<RequiredLabel message={"Description"}/>} value={watch('description')} onChange={(e) => setValue('description', e.currentTarget.value)}/>
        <NumberInput id={"promotion"} iconDescription={""} label={<RequiredLabel message={"Promotion"}/>} value={watch('promotion')} onChange={(e, {value}) => setValue('promotion', value)}/>

        <Select
          id="new-pld-manager"
          onChange={(e) => {
            const selectedManager = ([...props.org.members, props.org.owner]).find((member) => member._id === e.currentTarget.value);
            if (selectedManager === undefined)
              return;
            setValue('manager', selectedManager)
          }}
          labelText={<RequiredLabel message={"Manager"}/>}
          value={watch('manager')._id}>
          <SelectItem text={(props.org.owner as User).email} value={(props.org.owner as User)._id} />
          {(props.org.members as User[]).map((user, index) => {
            return (<SelectItem key={index} value={user._id} text={user.email}/>)
          })}
        </Select>
        <Button style={ButtonStyle.default} onClick={onUpdatePld} renderIcon={Renew} iconDescription={"Update"}>Mettre à jour</Button>
        <PldRevisionsComponent pld={props.pld} org={props.org} loadPld={props.loadPld}/>
      </Stack>
    </Tile>
  );
};
