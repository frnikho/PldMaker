import * as React from "react";
import { Button, NumberInput, Select, SelectItem, TextArea, TextInput, Tile } from "carbon-components-react";
import { RequiredLabel } from "../../../util/Label";
import { Organization, Pld, PldUpdateBody, User } from "@pld/shared";
import { PldRevisionsComponent } from "./PldRevisionsComponent";

import { Stack } from '@carbon/react';

import { Renew, Close } from '@carbon/icons-react';

import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PldApiController } from "../../../controller/PldApiController";
import { toast } from "react-toastify";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { TileStyle } from "@pld/ui";
import { ButtonStyle } from "@pld/ui";
import { onEnter } from "../../../util/FieldData";
import { validate } from "class-validator";
import { errorToast } from "../../../manager/ToastManager";

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
  tags: string[];
}

export const PldInfoComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const {getValues, watch, setValue, formState: {errors}} = useForm<InfoForm>({
    defaultValues: {
      description: props.pld.description,
      manager: props.pld.manager,
      promotion: props.pld.promotion,
      title: props.pld.title,
      tags: props.pld.tags,
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
    setValue('tags', props.pld.tags);
  }

  const onUpdatePld = () => {
    const form = getValues();
    console.log(form);

    const body = new PldUpdateBody(props.pld._id, form.title, form.description, form.manager._id, form.promotion, undefined, form.tags);

    validate(body).then((errors) => {
      console.log(errors);
      if (errors.length <= 0) {
        PldApiController.updatePld(userCtx.accessToken, props.org._id,body, (pld, error) => {
          if (error) {
            toast(error.error, {type: 'error'});
          }
          if (pld !== null) {
            toast('Pld mis à jour ', {type: 'success', icon: '👍'});
          }
        });
      } else {
        errorToast(Object.values(errors[0]?.constraints ?? '')[0]);
      }
    });


    props.loadPld();
  }

  const promotionValue = (): number => {
    const value = watch('promotion');
    if (isNaN(value)) {
      return 0;
    }
    return watch('promotion');
  }

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <TextInput id={"pld-title"} value={watch('title')} labelText={<RequiredLabel message={"Titre"}/>} onChange={(e) => setValue('title', e.currentTarget.value)}/>
        <TextArea rows={4} id={"pld-description"}  labelText={<RequiredLabel message={"Description"}/>} value={watch('description')} onChange={(e) => setValue('description', e.currentTarget.value)}/>
        <NumberInput id={"promotion"} iconDescription={""} label={<RequiredLabel message={"Promotion"}/>} value={promotionValue()} min={2000} max={2900} onChange={(e, {value}) => setValue('promotion', parseInt(value, 10))}/>
        <Stack gap={4}>
          <RequiredLabel message={"Mots-clés"}/>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {watch('tags')?.map((tag, index) => {
              return (
                <Button key={index}
                        style={{marginLeft: 2, marginRight: 2, borderRadius: 16}}
                        renderIcon={Close}
                        kind={'ghost'}
                        onClick={() => {
                          const array = getValues('tags');
                          array.splice(index, 1)
                          setValue('tags', array);
                        }}
                        size="sm">
                  {tag}
                </Button>
              )
            })}
          </div>
          <TextInput
            invalid={errors.tags?.message !== undefined}
            invalidText={errors.tags?.message}
            id={"pld-tag-input"} helperText={"Les tags sont utilisés pour la génération des documents word"} hideLabel={true} labelText={""}
            onKeyDown={(e) => onEnter(e, () => {
              if (e.currentTarget.value.length <= 0 || e.currentTarget.value === ' ') {
                return;
              }
              const array = getValues('tags') ?? [];
              array.push(e.currentTarget.value);
              e.currentTarget.value = '';
              setValue('tags', array);
            })}/>
        </Stack>
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
