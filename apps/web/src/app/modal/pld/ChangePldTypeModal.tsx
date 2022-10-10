import React, { useContext, useState } from "react";
import { Button, Modal, Select, SelectItem } from "carbon-components-react";
import {ModalComponentProps} from "../../util/Modal";
import { Organization, Pld } from "@pld/shared";
import { PldApiController } from "../../controller/PldApiController";
import { toast } from "react-toastify";
import { UserContext, UserContextProps } from "../../context/UserContext";

import { Stack } from '@carbon/react';

type Props = {
  pld: Pld;
  org: Organization;
} & ModalComponentProps;

export const UpdatePldTypeModal = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [status, setStatus] = useState<string>('');

  const onPldTypeUpdated = () => {
      PldApiController.updatePld(userCtx.accessToken, props.org._id, {
        pldId: props.pld._id,
        currentStep: status
      }, (pld, error) => {
        if (error) {
          toast(error.error, {type: 'error'});
        }
        if (pld !== null) {
          toast('PLD mis à jour 👍', {type: 'success'});
          props.onSuccess();
        }
      });
    }

  return (
    <Modal
      size={"sm"}
      open={props.open}
      primaryButtonText={"Valider"}
      onRequestClose={props.onDismiss}
      passiveModal
      modalHeading="Change le status d'advancement">
      <Stack gap={4}>
        <Select
          id="select-chante-type-modal"
          value={status}
          labelText=""
          onChange={(e) => setStatus(e.currentTarget.value)}>
          {props.pld.steps.map((step, index) => {
            return (
              <SelectItem
                key={index}
                value={step}
                text={step}
              />
            )
          })}
        </Select>
        <Button onClick={onPldTypeUpdated}>
          Valider
        </Button>
      </Stack>
    </Modal>
  );
};
