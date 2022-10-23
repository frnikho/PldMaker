// @flow
import * as React from "react";
import { Organization, UpdateOrganizationBody } from "@pld/shared";
import { useAuth } from "../../../hook/useAuth";
import { Button, NumberInput, TextArea, Tile } from "carbon-components-react";
import { RequiredLabel } from "../../../util/Label";

import {Renew, Settings} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { useNavigate } from "react-router-dom";
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { TileStyle } from "@pld/ui";
import { useLanguage } from "../../../hook/useLanguage";

type Props = {
  org: Organization;
  onOrgUpdated: () => void;
};

type Form = {
  description: string;
  versionShifting: number;
}

export const OrgInfoComponent = (props: Props) => {

  const {translate} = useLanguage();
  const navigate = useNavigate();
  const {accessToken} = useAuth();
  const {getValues, setValue, watch} = useForm<Form>({defaultValues: {versionShifting: props.org.versionShifting, description: props.org.description}});

  useEffect(() => {
    setValue('description', props.org.description);
    setValue('versionShifting', props.org.versionShifting);
  }, [props.org]);

  const onClickUpdate = () => {
    const form = getValues();
    const body: UpdateOrganizationBody = {
      orgId: props.org._id,
      description: form.description,
      versionShifting: form.versionShifting,
    }
    OrganizationApiController.updateOrg(accessToken, body, (org, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        toast('Organisation mis à jour !', {type: 'success'});
        props.onOrgUpdated();
      }
    })
  }

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <TextArea rows={4} id={"description"} maxLength={512} labelText={translate('lexical.description')} value={watch('description')} onChange={(a) => setValue('description', a.currentTarget.value)}/>
        <NumberInput iconDescription={""} min={0.01} max={2.0} id={"versionShifting"} value={watch('versionShifting')} onChange={(a, {value}) => setValue('versionShifting', value)} label={<RequiredLabel message={translate('lexical.versioning')}/>}/>
        <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <Button renderIcon={Renew} iconDescription={"Update"} style={{borderRadius: 8}} onClick={onClickUpdate}>{translate('lexical.update')}</Button>
          <Button onClick={() => navigate('manage')} style={{borderRadius: 8}} renderIcon={Settings} iconDescription={"Settings"}>{translate('lexical.settings')}</Button>
        </div>
      </Stack>
    </Tile>
  );
};
