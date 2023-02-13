import * as React from "react";
import { Organization, User } from "@pld/shared";
import { Button, FilterableMultiSelect, Modal } from "carbon-components-react";
import { ModalProps } from "../../util/Modal";
import { useForm } from "react-hook-form";

type Props = {
  org: Organization;
} & ModalProps;

type Form = {
  selectedUser: User[];
}

export const FilterUserDodModal = ({org, open, onDismiss, onSuccess}: Props) => {

  const {getValues, watch, setValue} = useForm<Form>({defaultValues: {selectedUser: []}});

  const onChangeSelectedUser = () => {
    onSuccess(getValues('selectedUser'));
  }

  return (
    <Modal open={open} size={'xs'} passiveModal onRequestClose={onDismiss} modalHeading={"Filtrer les DoDs par utilisateurs"}>
      <div style={{paddingBottom: '16em'}}>
        <FilterableMultiSelect
          placeholder={watch('selectedUser').map((user) => user.email).join(', ')}
          id="user-select"
          titleText="Utilisateur"
          items={[...org.members, org.owner].map((u) => ({text: u.email, value: u._id}))}
          itemToString={(item) => (item ? item.text : '')}
          selectedItems={watch('selectedUser').map((u) => ({text: u.email, value: u._id}))}
          selectionFeedback="top"
          onChange={({ selectedItems }) => {
            setValue('selectedUser', [...org.members, org.owner].filter((u) => selectedItems.find((s) => s.value === u._id)));
          }}/>
      </div>
      <Button onClick={onChangeSelectedUser}>Valider</Button>
    </Modal>
  );
};
