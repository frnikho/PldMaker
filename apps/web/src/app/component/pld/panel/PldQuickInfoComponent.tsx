import * as React from "react";
import { Column, Tile } from "carbon-components-react";
import { formatLongDate } from "@pld/utils";

import {Stack} from '@carbon/react';
import { Organization, Pld } from "@pld/shared";
import { TileStyle } from "@pld/ui";

type Props = {
  pld: Pld;
  org: Organization;
};

export const PldQuickInfoComponent = (props: Props) => {
  const showLastAuthorPld = () => {
    if (props.pld === undefined || props.org.owner === undefined)
      return;
    if (props.pld.revisions.length > 0) {
      return props.pld.revisions[props.pld.revisions.length-1].owner.email;
    } else {
      return (props.org.owner.email);
    }
  }

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <div>
          <h4 style={{fontWeight: 600}}>Date de création :</h4>
          <p>{formatLongDate(new Date(props.pld.created_date ?? ""))}</p>
        </div>
        <div>
          <h4 style={{fontWeight: 600}}>Dernière mise à jour :</h4>
          <p>{formatLongDate(new Date(props.pld.updated_date ?? ""))}</p>
          <p>par <b>{showLastAuthorPld()}</b></p>
        </div>
        <div>
          <Stack orientation={"horizontal"}>
            <Column lg={3}>
              <h4 style={{}}>Version actuelle </h4>
              <h1 style={{fontWeight: 'bold'}}>{props.pld?.version}</h1>
            </Column>
            <Column lg={3}>
              <h4 style={{}}>Nombre de révisions </h4>
              <h1 style={{fontWeight: 'bold'}}>{props.pld?.revisions.length}</h1>
            </Column>
          </Stack>
        </div>
      </Stack>
    </Tile>
  )
};
