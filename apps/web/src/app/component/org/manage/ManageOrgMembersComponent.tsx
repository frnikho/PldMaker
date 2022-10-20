import * as React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput, Tile } from "carbon-components-react";

import {TrashCan, Add} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { Organization, User } from "@pld/shared";
import { useContext } from "react";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { useForm } from "react-hook-form";
import { ButtonStyle, TileStyle } from "@pld/ui";

type Props = {
  org: Organization;
};

type InvitationForm = {
  invitedUser: string;
}

export const ManageOrgMembersComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const {getValues, formState: {errors}, setValue, setError} = useForm<InvitationForm>();

  const isOwner = (): boolean => {
    return props.org?.owner ._id === userCtx.user?._id;
  }

  const onClickRevokeUser = (userId: string) => {
    OrganizationApiController.revokeUser(userCtx.accessToken, props.org._id, {
      memberId: userId,
    }, (org, error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(org);
      }
    });
  }

  const onClickInviteUser = () => {
    if ((props.org.owner as User).email === getValues('invitedUser')) {
      setError('invitedUser', {message: 'Vous êtes deja dans l\'organisation !'});
    } else if ((props.org.members as User[]).some((member) => member.email === getValues('invitedUser'))) {
      setError('invitedUser', {message: 'L\'utilisateur est deja présent dans l\'organisation'});
    }
    OrganizationApiController.inviteUser(userCtx.accessToken, props.org._id, {
      memberEmail: getValues('invitedUser')
    }, (org, error) => {
      if (error) {
        setError('invitedUser', {message: error.message as string});
      }
    });
  }

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={2}>
        <Table style={{marginTop: '20px', marginBottom: '20px'}} >
          <TableHead>
            <TableRow>
              <TableHeader id={"members-email"} key={"memail"}>
                Email
              </TableHeader>
              <TableHeader id={"members-names"} key={"mnames"}>
                Nom, Prénom
              </TableHeader>
              <TableHeader id={"members-domain"} key={"mdomain"}>
                Secteur(s)
              </TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...props.org.members, props.org.owner].map((user, key) => (
              <TableRow key={key}>
                <TableCell key={key + ":email"}>{user.email} {props.org.owner._id === user._id ? '👑' : null}</TableCell>
                <TableCell key={key + ":names"}>{user.firstname} {user.lastname?.toUpperCase()}</TableCell>
                <TableCell key={key + ":origin"}>{user.domain?.join(', ')}</TableCell>
                <TableCell key={key + ":actions"}>
                  {isOwner() ? <Button hasIconOnly renderIcon={TrashCan} iconDescription={"Supprimer l'utilisateur"} kind={'ghost'} onClick={() => onClickRevokeUser(user._id)}/> : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TextInput
          style={{marginBottom: 18}}
          disabled={!isOwner()}
          helperText={!isOwner() ? "Seulement le créateur peut ajouter des utilisateurs dans l'organisation !" : null}
          id={"org-invite-user"} labelText={"Ajouter un utilisateur à l'organisation"} onChange={(e) => setValue('invitedUser', e.currentTarget.value)}
          invalid={errors.invitedUser?.message !== undefined}
          invalidText={errors.invitedUser?.message}
        />
        <Button style={ButtonStyle.default} renderIcon={Add} iconDescription={"Ajouter"} onClick={onClickInviteUser}>Ajouter un utilisateur</Button>
      </Stack>
    </Tile>
  )
};
