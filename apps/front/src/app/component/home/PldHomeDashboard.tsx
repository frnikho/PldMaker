import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {
  Button,
  ButtonSet,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";

import {Account} from '@carbon/icons-react';
import {formatLongDate, formatShortDate} from "@pld/utils";
import {Organization} from "@pld/shared";

type PldHomeDashboardProps = RequiredUserContextProps

type PldHomeDashboardState = unknown

export class PldHomeDashboard extends React.Component<PldHomeDashboardProps, PldHomeDashboardState> {

  constructor(props: PldHomeDashboardProps) {
    super(props);
  }

  override componentDidMount() {
    if (this.props.userContext.accessToken === undefined)
      return;
  }

  private showPLD() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader id={"name"} key={"name"}>Nom</TableHeader>
            <TableHeader id={"description"} key={"description"}>Description</TableHeader>
            <TableHeader id={"created_date"} key={"created_date"}>Création</TableHeader>
            <TableHeader id={"updated_date"} key={"updated_date"}>Mise à jour</TableHeader>
            <TableHeader id={"author"} key={"author"}>Manager</TableHeader>
            <TableHeader id={"org"} key={"org"}>Organisation</TableHeader>
            <TableHeader id={"action"} key={"action"}>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.userContext.favours?.pld.map((pld, index) => (
            <TableRow key={index}>
              <TableCell>{pld.title}</TableCell>
              <TableCell>{pld.description}</TableCell>
              <TableCell>{formatShortDate(new Date(pld.created_date ?? new Date()))}</TableCell>
              <TableCell>{formatLongDate(new Date(pld.updated_date ?? new Date()))}</TableCell>
              <TableCell>{pld.manager.lastname?.toUpperCase()} {pld.manager.firstname}</TableCell>
              <TableCell>{(pld.owner as Organization).name}</TableCell>
              <TableCell>
                <ButtonSet>
                  <Button
                    kind="ghost" renderIcon={Account} iconDescription={"Gérer"} hasIconOnly/>
                </ButtonSet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  override render() {
    return (
      <>
        <h1>Mes PLD favoris <Button kind={"ghost"} hasIconOnly renderIcon={Account} iconDescription={"Créer une nouvelle organisation"}/></h1>
        {this.showPLD()}
      </>
    );
  }


}
